'use client'
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface TimeDisplayProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function TimeDisplay({ onRefresh, isRefreshing = false }: TimeDisplayProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(new Date().toLocaleString());
    const timer = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">{time}</span>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Check URLs now"
      >
        <RefreshCw 
          className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
        />
      </button>
    </div>
  );
}