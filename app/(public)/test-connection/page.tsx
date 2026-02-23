'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function TestConnectionPage() {
    const [dbStatus, setDbStatus] = useState<any>(null);
    const [pingStatus, setPingStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function checkConnection() {
            try {
                // Test 1: Simple Ping
                try {
                    const pingRes = await api.get('/ping');
                    setPingStatus(pingRes.data);
                } catch (e: any) {
                    setPingStatus({ error: e.message });
                }

                // Test 2: Database Connection
                try {
                    const dbRes = await api.get('/test-db');
                    setDbStatus(dbRes.data);
                } catch (e: any) {
                    setDbStatus({ error: e.message });
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        checkConnection();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Connection Status</h1>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Ping Status */}
                        <div className={`p-4 rounded-md border ${pingStatus?.message === 'pong' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <h2 className="font-semibold text-sm uppercase tracking-wide mb-1">API Reachability</h2>
                            {pingStatus?.message === 'pong' ? (
                                <div className="flex items-center text-green-700">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>Success (Pong)</span>
                                </div>
                            ) : (
                                <div className="text-red-700 text-sm">
                                    Failed: {pingStatus?.error || 'Unknown error'}
                                </div>
                            )}
                        </div>

                        {/* DB Status */}
                        <div className={`p-4 rounded-md border ${dbStatus?.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <h2 className="font-semibold text-sm uppercase tracking-wide mb-1">Database Connection</h2>
                            {dbStatus?.status === 'success' ? (
                                <div className="text-green-700">
                                    <div className="flex items-center mb-1">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>Connected</span>
                                    </div>
                                    <p className="text-xs opacity-75 ml-7">{dbStatus.message}</p>
                                </div>
                            ) : (
                                <div className="text-red-700 text-sm">
                                    <div className="flex items-center mb-1">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        <span>Failed</span>
                                    </div>
                                    <p className="text-xs ml-7 break-all">{dbStatus?.error || dbStatus?.message || 'Unknown error'}</p>
                                </div>
                            )}
                        </div>

                        <div className="text-xs text-gray-400 mt-4 text-center">
                            API URL: {process.env.NEXT_PUBLIC_API_URL}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
