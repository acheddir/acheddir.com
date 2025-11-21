'use client';

import React from 'react';

// Simple component with standard HTML img
export function TestImage() {
  return (
    <div className="my-6">
      <img 
        src="/avatar.jpg" 
        alt="Test image" 
        width={400} 
        height={400} 
        className="rounded-lg"
        style={{ maxWidth: '100%' }}
      />
      <p className="text-center text-sm text-muted-foreground mt-2">
        Test image from public folder: /avatar.jpg
      </p>
    </div>
  );
}