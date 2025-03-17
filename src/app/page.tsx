'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Timeline } from '../components/Timeline';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';

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
        <main className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">Project Planner</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
                <form onSubmit={createProject} className="flex gap-4">
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter project name"
                        className="flex-1 p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
                <div className="grid gap-4">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/project/${project.id}`}
                            className="p-4 border rounded hover:bg-gray-50"
                        >
                            {project.name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                    <TaskForm />
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

            <TaskList />
        </main>
    );
} 