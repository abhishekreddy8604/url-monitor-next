// src/components/UrlList.tsx
'use client'
import React, { useState } from 'react';
import type { Url } from './Dashboard';
import { Trash2 } from 'lucide-react'; // Import the trash icon

interface UrlListProps {
  urls: Url[];
  onRefresh: () => void;
}

export function UrlList({ urls, onRefresh }: UrlListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      onRefresh(); // Refresh the list after successful deletion
    } catch (error) {
      console.error('Error deleting URL:', error);
      alert('Failed to delete URL');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {urls.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No URLs added yet. Add your first URL above.
        </p>
      ) : (
        urls.map((url) => (
          <div
            key={url.id}
            className="p-4 border rounded-lg flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-black">{url.name || url.url}</h3>
              <p className="text-sm text-gray-500">{url.url}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    url.status === 200
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {url.status === 200 ? 'Online' : 'Offline'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Last checked: {url.lastChecked 
                    ? new Date(url.lastChecked).toLocaleString() 
                    : 'Never'}
                </p>
              </div>
              
              <button
                onClick={() => handleDelete(url.id)}
                disabled={deletingId === url.id}
                className={`p-2 rounded-full hover:bg-red-50 transition-colors
                  ${deletingId === url.id ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title="Delete URL"
              >
                {deletingId === url.id ? (
                  <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5 text-red-600" />
                )}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}