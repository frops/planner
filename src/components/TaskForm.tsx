'use client';

import { useState } from 'react';

interface TaskFormProps {
    projectId?: number;
}

export function TaskForm({ projectId }: TaskFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        startDate: '',
        endDate: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate code format (e.g., FOO-123)
        const codeRegex = /^[A-Z]{1,4}-\d+$/;
        if (!codeRegex.test(formData.code)) {
            alert('Invalid code format. Use format like FOO-123');
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    projectId,
                }),
            });

            if (response.ok) {
                setFormData({
                    title: '',
                    code: '',
                    startDate: '',
                    endDate: '',
                });
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Code (e.g., FOO-123)
                </label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    pattern="[A-Z]{1,4}-\d+"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
                />
            </div>

            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                </label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                </label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    min={formData.startDate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Add Task
            </button>
        </form>
    );
} 