import React from 'react';
import { Link } from 'react-router-dom';
import { Skull, ArrowRight } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-red-500">
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <div className="relative z-20 text-center px-4">
          <Skull className="w-20 h-20 mx-auto mb-6 animate-pulse" />
          <h1 className="text-6xl font-bold mb-4 text-shadow-glow">80s Horror Challenge</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Dare to watch every horror movie from the 1980s? Join the ultimate horror challenge
            and track your progress through the golden age of horror.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold transition-colors"
            >
              Accept the Challenge <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}