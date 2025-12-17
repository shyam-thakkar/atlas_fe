'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfileDetailsPage() {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
      if (!name) return 'U';
      return name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
       <div className="border-b border-gray-100 pb-6 ml-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
            <p className="mt-2 text-lg text-gray-500 max-w-2xl">
                Manage your personal information and account preferences. 
                This information will be displayed on your generated portfolio.
            </p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden">
            {/* Header / Avatar */}
            <div className="px-8 py-8 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white flex flex-col sm:flex-row items-center sm:items-start gap-6">
                 <div className="relative">
                     <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 shadow-md">
                        <span className="text-2xl font-semibold leading-none text-white tracking-wider">
                            {getInitials(user?.name)}
                        </span>
                     </span>
                     <div className="absolute bottom-0 right-0 w-6 h-6 border-4 border-white rounded-full bg-green-500"></div>
                 </div>
                 
                 <div className="text-center sm:text-left flex-1 min-w-0 pt-1">
                     <h2 className="text-xl font-bold text-gray-900 truncate">{user?.name}</h2>
                     <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
                     <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                         <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            Member
                         </span>
                          <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                            Early Access
                         </span>
                     </div>
                 </div>
            </div>

            {/* Form Fields */}
            <div className="px-8 py-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                   {/* Full Name */}
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700 block">
                           Full Name
                       </label>
                       <div className="relative">
                           <input 
                              type="text" 
                              value={user?.name || ''} 
                              readOnly
                              disabled
                              className="block w-full rounded-lg border-0 bg-gray-50 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-not-allowed opacity-75"
                           />
                           <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                              </svg>
                           </div>
                       </div>
                       <p className="text-xs text-gray-500">Your public display name.</p>
                   </div>
                   
                   {/* Email */}
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700 block">
                           Email Address
                       </label>
                       <div className="relative">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-200 bg-gray-50">
                                <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input 
                                    type="email" 
                                    value={user?.email || ''} 
                                    readOnly
                                    disabled
                                    className="block flex-1 border-0 bg-transparent py-2.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed opacity-75"
                                />
                            </div>
                       </div>
                       <p className="text-xs text-gray-500">Used for login and notifications.</p>
                   </div>
               </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Account Information</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Authentication Method</dt>
                            {/* Assuming Google if email provider, but generic fallback for now */}
                            <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                <div className="p-1 bg-white border border-gray-200 rounded shadow-sm">
                                     <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
                                </div>
                                Standard (Email/Password)
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                Free Tier
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                    User ID: <span className="font-mono">{user?.id}</span>
                </p>
                <div className="flex gap-4">
                     <button
                        type="button"
                        disabled
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 cursor-not-allowed flex items-center gap-2 hover:bg-gray-50"
                     >
                        Edit Profile
                        <span className="text-[10px] font-normal px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">Soon</span>
                     </button>
                </div>
            </div>
        </div>
    </div>
  );
}
