import React from 'react';
import { Database } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Database className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Scale Your Database with Confidence
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Enterprise-grade database replication for high-performance applications
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};