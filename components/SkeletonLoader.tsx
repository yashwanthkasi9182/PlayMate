'use client';

import { motion, Variants } from 'framer-motion';

interface SkeletonLoaderProps {
  type: 'teams' | 'matches' | 'card';
  count?: number;
}

export default function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
  const skeletonVariants: Variants = {
    initial: {
      opacity: 0.5
    },
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (type === 'teams') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            variants={skeletonVariants}
            animate="pulse"
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-300 rounded-xl p-6 shadow-lg"
          >
            <div className="h-6 bg-indigo-200 rounded mb-4 w-3/4"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, playerIndex) => (
                <div key={playerIndex} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'matches') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            variants={skeletonVariants}
            animate="pulse"
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-300 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 bg-green-200 rounded w-1/4"></div>
              <div className="h-4 bg-green-200 rounded w-16"></div>
            </div>
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
              <div className="h-4 bg-green-200 rounded w-1/2 mx-auto"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <motion.div
        variants={skeletonVariants}
        animate="pulse"
        className="bg-white rounded-xl shadow-lg p-6 h-full"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            <div className="h-6 bg-purple-200 rounded-full w-16"></div>
            <div className="h-6 bg-purple-200 rounded-full w-20"></div>
          </div>
          <div className="h-12 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg"></div>
        </div>
      </motion.div>
    );
  }

  return null;
}