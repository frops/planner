'use client';

import { useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Timeline } from '../components/Timeline';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';

export default function Home() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Project Planner</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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