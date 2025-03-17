'use client';

import { format, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { useLocalStorage } from '@/components/LocalStorageProvider';

interface TimelineProps {
    startDate: Date;
    endDate: Date;
    projectId?: number;
}

export function Timeline({ startDate, endDate, projectId }: TimelineProps) {
    const { tasks } = useLocalStorage();

    const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
    const today = new Date();

    const filteredTasks = projectId
        ? tasks.filter(task => task.projectId === projectId)
        : tasks;

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
                className="today-line"
                style={{
                    left: `${((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100}%`,
                }}
            />

            {/* Timeline grid */}
            <div className="timeline-grid">
                {weeks.map((week) => {
                    const weekStart = startOfWeek(week);
                    const weekEnd = endOfWeek(week);

                    return (
                        <div key={weekStart.toISOString()} className="timeline-cell">
                            <div className="text-sm font-semibold mb-2">
                                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                            </div>

                            {/* Tasks for this week */}
                            {filteredTasks
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