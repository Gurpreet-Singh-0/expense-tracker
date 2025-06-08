'use client';

import { motion } from 'framer-motion';

export default function Card({ 
  title, 
  children, 
  className = '',
  hoverEffect = false
}) {
  const Container = hoverEffect ? motion.div : 'div';
  
  return (
    <Container
      whileHover={hoverEffect ? { y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      className={`bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100/75 transition-all duration-200 ${className}`}
    >
      {title && (
        <div className="px-4 py-4 sm:px-5 border-b border-gray-100/50">
          <h3 className="text-base sm:text-lg font-semibold leading-6 text-gray-800 tracking-tight">
            {title}
          </h3>
        </div>
      )}
      <div className="px-4 py-4 sm:p-5">
        {children}
      </div>
    </Container>
  );
}