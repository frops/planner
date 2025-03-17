'use client';

import { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Timeline } from '@/components/Timeline';
import { TaskForm } from '@/components/TaskForm';

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
        return <div>Loading...</div>;
    }

    return (
        <main className="min-h-screen p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{project.name}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                    <TaskForm projectId={project.id} />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Timeline</h2>
                        <div className="space-x-2">
                            <button
                                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <Timeline startDate={startDate} endDate={endDate} />
                </div>
            </div>
        </main>
    );
} 