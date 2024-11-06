// src/components/TimeDisplay.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

interface TimeDisplayProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function TimeDisplay({ onRefresh, isRefreshing }: TimeDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <span>Last updated: {currentTime.toLocaleString()}</span>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        title="Refresh now"
      >
        <RefreshCcw
          className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
        />
      </button>
    </div>
  );
}