import { useState } from 'react';
import { useTaskStore } from '../store';
import { Task } from '../types';

export const TaskForm: React.FC = () => {
    const addTask = useTaskStore((state) => state.addTask);
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const team = code.split('-')[0];
        const color = getTeamColor(team);

        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            code,
            team,
            startDate,
            endDate,
            color,
        };

        addTask(newTask);
        setTitle('');
        setCode('');
        setStartDate('');
        setEndDate('');
    };

    const getTeamColor = (team: string): string => {
        const colors: { [key: string]: string } = {
            FOO: '#FFE4E1',
            BAR: '#E6E6FA',
            BAZ: '#F0FFF0',
            QUX: '#FFF0F5',
        };
        return colors[team] || '#F5F5F5';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Code (e.g., FOO-123)</label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    pattern="[A-Z]+-\d+"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Add Task
            </button>
        </form>
    );
}; 