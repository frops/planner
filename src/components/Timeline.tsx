'use client';

import { format, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useLocalStorage } from '@/components/LocalStorageProvider';

interface TimelineProps {
    startDate: Date;
    endDate: Date;
    projectId?: number;
    viewMode: 'weeks' | 'months';
}

export function Timeline({ startDate, endDate, projectId, viewMode }: TimelineProps) {
    const { tasks } = useLocalStorage();

    const periods = viewMode === 'weeks'
        ? eachWeekOfInterval({ start: startDate, end: endDate })
        : eachMonthOfInterval({ start: startDate, end: endDate });

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
        <div className="relative overflow-x-auto">
            {/* Today line */}
            <div
                className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                style={{
                    left: `${((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100}%`,
                }}
            />

            {/* Timeline grid */}
            <div className="grid" style={{
                gridTemplateColumns: `repeat(${periods.length}, minmax(200px, 1fr))`,
                minWidth: `${periods.length * 200}px`
            }}>
                {periods.map((period) => {
                    const periodStart = viewMode === 'weeks' ? startOfWeek(period) : startOfMonth(period);
                    const periodEnd = viewMode === 'weeks' ? endOfWeek(period) : endOfMonth(period);
                    const formatStr = viewMode === 'weeks' ? 'MMM d' : 'MMMM yyyy';

                    return (
                        <div key={periodStart.toISOString()} className="timeline-cell border-r border-gray-200 p-2">
                            <div className="text-sm font-semibold mb-2 sticky top-0 bg-white">
                                {format(periodStart, formatStr)}
                                {viewMode === 'weeks' && ` - ${format(periodEnd, 'MMM d')}`}
                            </div>

                            {/* Tasks for this period */}
                            <div className="space-y-1">
                                {filteredTasks
                                    .filter((task) => {
                                        const taskStart = new Date(task.startDate);
                                        const taskEnd = new Date(task.endDate);
                                        return taskStart <= periodEnd && taskEnd >= periodStart;
                                    })
                                    .map((task) => (
                                        <div
                                            key={task.id}
                                            className={`${getTaskColor(task.code)} text-white p-2 rounded shadow-sm`}
                                        >
                                            <div className="font-mono text-xs">{task.code}</div>
                                            <div className="text-sm font-medium truncate">{task.title}</div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 