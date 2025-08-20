import { useState, useEffect, useCallback, useRef } from 'react';

const useAutoRetry = (
  fetchFunction,
  options = {}
) => {
  const {
    maxRetries = 5,
    retryDelays = [1000, 3000, 5000, 10000, 15000], // Progressive delays
    shouldRetry = (error) => {
      // Auto-retry for network errors, timeouts, and server errors
      return (
        error.code === 'ECONNABORTED' ||
        error.code === 'NETWORK_ERROR' ||
        !error.response ||
        (error.response?.status >= 500 && error.response?.status < 600) ||
        error.response?.status === 408 || // Request timeout
        error.response?.status === 429    // Too many requests
      );
    },
    onRetryAttempt = () => {},
    onMaxRetriesReached = () => {},
    enableAutoRetry = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryStage, setRetryStage] = useState(0); // For UI progress indication

  const retryTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  const executeWithRetry = useCallback(async (attemptNumber = 0) => {
    if (!mountedRef.current) return;

    try {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setIsRetrying(attemptNumber > 0);
      setRetryCount(attemptNumber);
      setRetryStage(Math.min(attemptNumber, retryDelays.length - 1));

      if (attemptNumber === 0) {
        setLoading(true);
        setError(null);
      }

      // Execute the fetch function with abort signal
      const result = await fetchFunction({
        signal: abortControllerRef.current.signal,
        attemptNumber
      });

      if (!mountedRef.current) return;

      // Success - reset everything
      setData(result);
      setLoading(false);
      setError(null);
      setIsRetrying(false);
      setRetryCount(0);
      setRetryStage(0);

    } catch (fetchError) {
      if (!mountedRef.current) return;

      // Don't retry if request was aborted
      if (fetchError.name === 'AbortError') {
        return;
      }

      console.log(`Fetch attempt ${attemptNumber + 1} failed:`, fetchError);

      // Check if we should retry and haven't exceeded max retries
      if (enableAutoRetry && shouldRetry(fetchError) && attemptNumber < maxRetries) {
        const delay = retryDelays[attemptNumber] || retryDelays[retryDelays.length - 1];
        
        onRetryAttempt(attemptNumber + 1, fetchError, delay);
        
        // Schedule next retry
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            executeWithRetry(attemptNumber + 1);
          }
        }, delay);

      } else {
        // Max retries reached or shouldn't retry
        setLoading(false);
        setIsRetrying(false);
        setError(fetchError);
        
        if (attemptNumber >= maxRetries) {
          onMaxRetriesReached(fetchError);
        }
      }
    }
  }, [fetchFunction, maxRetries, retryDelays, shouldRetry, onRetryAttempt, onMaxRetriesReached, enableAutoRetry]);

  // Manual retry function (for user-triggered retries)
  const manualRetry = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setRetryStage(0);
    executeWithRetry(0);
  }, [executeWithRetry]);

  // Cancel all ongoing operations
  const cancel = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setLoading(false);
    setIsRetrying(false);
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    mountedRef.current = true;
    executeWithRetry(0);

    return () => {
      mountedRef.current = false;
      cancel();
    };
  }, [executeWithRetry, cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    isRetrying,
    retryCount,
    retryStage,
    manualRetry,
    cancel,
    // Helper computed values
    hasReachedMaxRetries: retryCount >= maxRetries,
    nextRetryDelay: retryDelays[retryCount] || retryDelays[retryDelays.length - 1],
    isInRetryMode: isRetrying || (loading && retryCount > 0)
  };
};

export default useAutoRetry;