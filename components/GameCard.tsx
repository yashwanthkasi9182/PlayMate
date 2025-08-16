'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users } from 'lucide-react';

interface GameCardProps {
  title: string;
  description?: string;
  icon?: string;
  href: string;
  index: number;
}

export default function GameCard({ 
  title, 
  description, 
  icon = '🎮',
  href, 
  index 
}: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group"
    >
      <Link href={href}>
        <div className="bg-white rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-shadow duration-300 cursor-pointer">
          <div className="text-center">
            {/* Game Icon */}
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="text-6xl mb-4"
            >
              {icon}
            </motion.div>
            
            {/* Game Name */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {title}
            </h3>
            
            {/* Description */}
            {description && (
              <p className="text-gray-600 text-sm mb-4">
                {description}
              </p>
            )}
            
            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Generate Teams
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}