'use client';

import { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { Timeline } from '@/components/Timeline';
import { TaskForm } from '@/components/TaskForm';
import Link from 'next/link';
import { useLocalStorage } from '@/components/LocalStorageProvider';

export default function ProjectPage({ params }: { params: { id: string } }) {
    const { projects } = useLocalStorage();
    const [currentDate, setCurrentDate] = useState(() => new Date());

    useEffect(() => {
        const now = new Date();
        setCurrentDate(now);
    }, []);

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [viewMode, setViewMode] = useState<'weeks' | 'months'>('weeks');

    const startDate = viewMode === 'weeks'
        ? startOfMonth(currentDate)
        : startOfMonth(currentDate);

    const endDate = viewMode === 'weeks'
        ? endOfMonth(currentDate)
        : endOfMonth(currentDate);

    useEffect(() => {
        console.log("Current date for timeline:", currentDate);
        console.log("Start date:", startDate);
        console.log("End date:", endDate);
    }, [currentDate, startDate, endDate]);

    const project = projects.find(p => p.id === parseInt(params.id));

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Project not found</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <span className="mr-2">←</span>
                        Back to Projects
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-semibold text-gray-800">Timeline</h2>
                            <div className="flex rounded-lg border border-gray-300 p-1">
                                <button
                                    onClick={() => setViewMode('weeks')}
                                    className={`px-3 py-1 rounded-md text-sm ${viewMode === 'weeks'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Weeks
                                </button>
                                <button
                                    onClick={() => setViewMode('months')}
                                    className={`px-3 py-1 rounded-md text-sm ${viewMode === 'months'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Months
                                </button>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <Timeline
                        startDate={startDate}
                        endDate={endDate}
                        projectId={project.id}
                        viewMode={viewMode}
                    />

                    {/* Floating action button */}
                    <button
                        onClick={() => setShowTaskForm(true)}
                        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-2xl"
                    >
                        +
                    </button>

                    {/* Modal */}
                    {showTaskForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
                                    <button
                                        onClick={() => setShowTaskForm(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                                <TaskForm
                                    projectId={project.id}
                                    onSuccess={() => setShowTaskForm(false)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 