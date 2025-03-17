'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Timeline } from '../components/Timeline';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '@/components/TaskList';

interface Project {
    id: number;
    name: string;
}

export default function Home() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const createProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newProjectName }),
            });

            if (response.ok) {
                setNewProjectName('');
                fetchProjects();
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Planner</h1>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Project</h2>
                        <form onSubmit={createProject} className="flex gap-4">
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Enter project name"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Create
                            </button>
                        </form>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h2>
                        <div className="grid gap-4">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/project/${project.id}`}
                                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-gray-900">{project.name}</span>
                                        <span className="text-gray-500">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <TaskList />
                </div>
            </div>
        </main>
    );
} 