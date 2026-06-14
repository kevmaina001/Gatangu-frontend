import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

// Threshold (ms) before we assume the backend is cold-starting and show
// the friendly overlay. A warm backend answers /api/health in well under
// this, so most visitors never see anything.
const COLD_START_THRESHOLD = 2500;
// How often to re-check health while we're waiting for it to wake up.
const POLL_INTERVAL = 3000;

/**
 * Pings the backend health endpoint on first load. If it doesn't answer
 * quickly (free-tier instances sleep and cold-start), shows a friendly
 * "waking up the store" overlay instead of letting the page sit there
 * looking broken. Dismisses itself the moment the backend responds.
 */
const BackendWakeup = () => {
  const [warming, setWarming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let thresholdTimer;
    let pollTimer;

    const markWarmingIfSlow = () => {
      thresholdTimer = setTimeout(() => {
        if (!cancelled) setWarming(true);
      }, COLD_START_THRESHOLD);
    };

    const checkHealth = async () => {
      try {
        // baseURL already ends in /api, so this hits /api/health.
        await api.get('/health', { timeout: 30000 });
        if (cancelled) return;
        // Backend is awake — clear the overlay and stop polling.
        clearTimeout(thresholdTimer);
        setWarming(false);
        return;
      } catch (err) {
        if (cancelled) return;
        // Still asleep/unreachable — keep the overlay up and retry.
        setWarming(true);
        pollTimer = setTimeout(checkHealth, POLL_INTERVAL);
      }
    };

    markWarmingIfSlow();
    checkHealth();

    return () => {
      cancelled = true;
      clearTimeout(thresholdTimer);
      clearTimeout(pollTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {warming && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center px-6 max-w-sm">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-secondary-800 mb-2">
              Waking up the store…
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              Our server was resting to save energy. This first load can take a
              few seconds — thanks for your patience!
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackendWakeup;
