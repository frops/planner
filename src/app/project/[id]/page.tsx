'use client';

import { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Timeline } from '@/components/Timeline';
import { TaskForm } from '@/components/TaskForm';
import Link from 'next/link';

interface Project {
    id: number;
    name: string;
}

export default function ProjectPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    useEffect(() => {
        fetchProject();
    }, [params.id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`);
            const data = await response.json();
            setProject(data);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
                        <TaskForm projectId={project.id} />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Timeline</h2>
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
                        <Timeline startDate={startDate} endDate={endDate} />
                    </div>
                </div>
            </div>
        </main>
    );
} 