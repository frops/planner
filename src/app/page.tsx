'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/components/LocalStorageProvider';

export default function Home() {
    const { projects, addProject } = useLocalStorage();
    const [newProjectName, setNewProjectName] = useState('');

    const createProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        try {
            await addProject({ name: newProjectName });
            setNewProjectName('');
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
            </div>
        </main>
    );
} 