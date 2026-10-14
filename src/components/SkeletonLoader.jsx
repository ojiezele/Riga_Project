import React from 'react';

export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-12"></div>
            </div>
            <div className="space-y-3 mb-6">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-20"></div>
            </div>
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-32"></div>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3 w-1/3">
                            <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/6"></div>
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/6"></div>
                        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm animate-pulse">
                    <div className="flex justify-between items-center mb-3">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                        <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                    </div>
                    <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonFullPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 flex flex-col space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm animate-pulse">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
                </div>
                <div className="flex space-x-4">
                    <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-24"></div>
                    <div className="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                </div>
            </div>
            <SkeletonStats />
            <SkeletonTable />
        </div>
    );
}
