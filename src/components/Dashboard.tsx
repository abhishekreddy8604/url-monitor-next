// src/components/Dashboard.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { AddUrlForm } from './AddUrlForm';
import { UrlList } from './UrlList';
import { TimeDisplay } from './TimeDisplay';
import { AlertCircle } from 'lucide-react';

export interface Url {
 id: string;
 url: string;
 name?: string;
 status?: number;
 lastChecked?: Date;
 createdAt: Date;
 updatedAt: Date;
}

export function Dashboard() {
 const [urls, setUrls] = useState<Url[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [isAdding, setIsAdding] = useState(false);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [sortBy, setSortBy] = useState<'name' | 'status' | 'lastChecked'>('lastChecked');
 const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');

 const fetchUrls = async (showRefreshState = false) => {
   if (showRefreshState) {
     setIsRefreshing(true);
   }
   try {
     const response = await fetch('/api/urls');
     if (!response.ok) {
       throw new Error('Failed to fetch URLs');
     }
     const data = await response.json();
     setUrls(data);
     setError(null);
   } catch (err) {
     setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
     console.error('Error fetching URLs:', err);
   } finally {
     setLoading(false);
     if (showRefreshState) {
       setIsRefreshing(false);
     }
   }
 };

 useEffect(() => {
   fetchUrls();
   const interval = setInterval(() => fetchUrls(), 60 * 1000);
   return () => clearInterval(interval);
 }, []);

 const addUrl = async (newUrl: { url: string; name?: string }) => {
   setIsAdding(true);
   setError(null);
   try {
     const response = await fetch('/api/urls', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(newUrl),
     });

     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.error || 'Failed to add URL');
     }

     await fetchUrls();
   } catch (err) {
     setError(err instanceof Error ? err.message : 'Failed to add URL');
     console.error('Error adding URL:', err);
   } finally {
     setIsAdding(false);
   }
 };

 const handleManualRefresh = () => {
   fetchUrls(true);
 };

 // Sort and filter URLs
 const getSortedAndFilteredUrls = () => {
   let filteredUrls = [...urls];
   
   if (filterStatus !== 'all') {
     filteredUrls = filteredUrls.filter(url => {
       if (filterStatus === 'online') return url.status === 200;
       if (filterStatus === 'offline') return url.status !== 200;
       return true;
     });
   }

   return filteredUrls.sort((a, b) => {
     switch (sortBy) {
       case 'name':
         return (a.name || a.url).localeCompare(b.name || b.url);
       case 'status':
         return (b.status || 0) - (a.status || 0);
       case 'lastChecked':
         const dateA = a.lastChecked ? new Date(a.lastChecked).getTime() : 0;
         const dateB = b.lastChecked ? new Date(b.lastChecked).getTime() : 0;
         return dateB - dateA;
       default:
         return 0;
     }
   });
 };

 // Calculate statistics
 const stats = {
   total: urls.length,
   online: urls.filter(url => url.status === 200).length,
   offline: urls.filter(url => url.status !== 200 && url.status !== undefined).length,
   unknown: urls.filter(url => url.status === undefined).length
 };

 return (
   <div className="max-w-6xl mx-auto px-4 py-8">
     <div className="space-y-8">
       {/* Header */}
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-black">URL Monitor Dashboard</h1>
         <TimeDisplay 
           onRefresh={handleManualRefresh}
           isRefreshing={isRefreshing}
         />
       </div>

       {/* Statistics */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white rounded-lg shadow p-4">
           <h3 className="text-lg font-medium text-black">Total URLs</h3>
           <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-4">
           <h3 className="text-lg font-medium text-black">Online</h3>
           <p className="text-2xl font-bold text-green-600">{stats.online}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-4">
           <h3 className="text-lg font-medium text-black">Offline</h3>
           <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
         </div>
         <div className="bg-white rounded-lg shadow p-4">
           <h3 className="text-lg font-medium text-black">Unknown</h3>
           <p className="text-2xl font-bold text-gray-700">{stats.unknown}</p>
         </div>
       </div>

       {/* Add URL Form */}
       <div className="bg-white rounded-lg shadow p-6">
         <h2 className="text-xl font-semibold text-black mb-4">Add New URL</h2>
         <AddUrlForm onSubmit={addUrl} isLoading={isAdding} />
         {error && (
           <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center space-x-2">
             <AlertCircle className="w-5 h-5" />
             <span className="font-medium">{error}</span>
           </div>
         )}
       </div>

       {/* URL List with Controls */}
       <div className="bg-white rounded-lg shadow">
         <div className="p-6">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
             <h2 className="text-xl font-semibold text-black">Monitored URLs</h2>
             
             <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
               <select
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                 className="border rounded-md px-3 py-2 bg-white text-gray-900 font-medium"
               >
                 <option value="all">All Status</option>
                 <option value="online">Online</option>
                 <option value="offline">Offline</option>
               </select>

               <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                 className="border rounded-md px-3 py-2 bg-white text-gray-900 font-medium"
               >
                 <option value="lastChecked">Last Checked</option>
                 <option value="name">Name</option>
                 <option value="status">Status</option>
               </select>
             </div>
           </div>

           {loading ? (
             <div className="flex justify-center items-center h-32">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
             </div>
           ) : (
             <UrlList 
               urls={getSortedAndFilteredUrls()}
               onRefresh={fetchUrls}
             />
           )}
         </div>
       </div>

       {/* Footer */}
       <div className="text-center space-y-1">
         <p className="text-sm text-gray-700 font-medium">URLs are automatically checked every 15 minutes</p>
         <p className="text-sm text-gray-700 font-medium">Dashboard updates every minute</p>
       </div>
     </div>
   </div>
 );
}

export default Dashboard;