import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import '../styles/HeroSlider.css';

const HeroSlider = ({ slides }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({});

  const handleImageError = (e, fallback) => {
    if (fallback && e.target.src !== fallback) {
      e.target.src = fallback;
    } else {
      // If no fallback, show a default placeholder
      e.target.style.display = 'none';
    }
  };

  const getImageSrc = (slide) => {
    // Handle both imported images (from assets) and public path images
    return slide.url;
  };

  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
      <Swiper
        modules={[Pagination, Autoplay, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/60 !w-3 !h-3',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125'
        }}
        navigation={{
          nextEl: '.hero-slider-next',
          prevEl: '.hero-slider-prev',
        }}
        autoplay={{ 
          delay: 6000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: false
        }}
        loop={true}
        speed={1200}
        spaceBetween={0}
        centeredSlides={true}
        watchSlidesProgress={true}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        className="hero-slider h-[400px] md:h-[500px] lg:h-[600px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                {/* Loading Placeholder */}
                {!imageLoaded[index] && (
                  <div className="absolute inset-0 bg-secondary-200 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                
                <motion.img
                  src={getImageSrc(slide)}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-opacity duration-700 ${
                    imageLoaded[index] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => handleImageError(e, slide.fallback)}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "linear" }}
                />
                
                {/* Gradient Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <AnimatePresence mode="wait">
                    {activeSlide === index && (
                      <motion.div
                        className="max-w-2xl text-white"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <motion.h1 
                          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        >
                          {slide.title}
                        </motion.h1>
                        
                        <motion.p 
                          className="text-lg md:text-xl mb-6 md:mb-8 text-white/90 leading-relaxed"
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                        >
                          {slide.subtitle}
                        </motion.p>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                        >
                          <Link
                            to={slide.ctaLink}
                            className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
                          >
                            {slide.cta}
                            <motion.span
                              className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                              whileHover={{ x: 5 }}
                            >
                              →
                            </motion.span>
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Arrows */}
      <button className="hero-slider-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 group">
        <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button className="hero-slider-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 group">
        <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;