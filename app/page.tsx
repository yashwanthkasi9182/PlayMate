'use client';

import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth animation
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout title="Team Generator">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Generate fair and balanced teams for any sport or game.
            Perfect for organizing games with friends and colleagues.
          </p>

          {/* CTA Button */}
          <Link href="/generate/custom">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <span>Generate Teams</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: '⚖️',
              title: 'Fair Teams',
              description: 'AI-powered algorithms ensure balanced team distribution'
            },
            {
              icon: '🎮',
              title: 'Any Game',
              description: 'Support for any team-based sport or game'
            },
            {
              icon: '🚀',
              title: 'Quick Setup',
              description: 'Generate teams in seconds with just player names'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}