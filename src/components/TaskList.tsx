'use client';

import { useEffect } from 'react';
import { useTaskStore } from '../store';
import { format } from 'date-fns';

export function TaskList() {
    const { tasks, setTasks } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const getTaskColor = (code: string) => {
        const team = code.split('-')[0];
        const colors: { [key: string]: string } = {
            FOO: 'bg-blue-500',
            ABC: 'bg-green-500',
            BAR: 'bg-purple-500',
        };
        return colors[team] || 'bg-gray-500';
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
            <div className="grid gap-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`${getTaskColor(task.code)} text-white p-4 rounded-lg`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-mono text-lg">{task.code}</div>
                                <div className="text-sm mt-1">{task.title}</div>
                                <div className="text-xs mt-2 opacity-75">
                                    {format(new Date(task.startDate), 'MMM d, yyyy')} -{' '}
                                    {format(new Date(task.endDate), 'MMM d, yyyy')}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    fetch(`/api/tasks/${task.id}`, {
                                        method: 'DELETE',
                                    }).then(() => {
                                        fetchTasks();
                                    });
                                }}
                                className="text-white hover:text-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 