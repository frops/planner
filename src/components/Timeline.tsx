'use client';

import { format, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { useState, useEffect } from 'react';

interface Task {
    id: number;
    title: string;
    code: string;
    startDate: string;
    endDate: string;
}

interface TimelineProps {
    startDate: Date;
    endDate: Date;
}

export function Timeline({ startDate, endDate }: TimelineProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
    const today = new Date();

    useEffect(() => {
        fetchTasks();
    }, [startDate, endDate]);

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
        <div className="relative">
            {/* Today line */}
            <div
                className="absolute h-full w-0.5 bg-red-500 z-10"
                style={{
                    left: `${((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100}%`,
                }}
            />

            {/* Timeline grid */}
            <div className="grid grid-cols-7 gap-1">
                {weeks.map((week) => {
                    const weekStart = startOfWeek(week);
                    const weekEnd = endOfWeek(week);

                    return (
                        <div key={weekStart.toISOString()} className="border p-2 min-h-[100px]">
                            <div className="text-sm font-semibold mb-2">
                                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                            </div>

                            {/* Tasks for this week */}
                            {tasks
                                .filter((task) => {
                                    const taskStart = new Date(task.startDate);
                                    const taskEnd = new Date(task.endDate);
                                    return taskStart <= weekEnd && taskEnd >= weekStart;
                                })
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        className={`${getTaskColor(task.code)} text-white p-1 rounded text-sm mb-1`}
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        <div className="font-mono">{task.code}</div>
                                        <div className="text-xs truncate">{task.title}</div>
                                    </div>
                                ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 