'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/components/LocalStorageProvider';

interface TaskFormProps {
    projectId?: number | null;
    onSuccess?: () => void;
}

export function TaskForm({ projectId, onSuccess }: TaskFormProps) {
    const { addTask } = useLocalStorage();
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
            await addTask({
                ...formData,
                projectId: projectId ?? null,
            });

            setFormData({
                title: '',
                code: '',
                startDate: '',
                endDate: '',
            });

            onSuccess?.();
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
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Add Task
            </button>
        </form>
    );
} 