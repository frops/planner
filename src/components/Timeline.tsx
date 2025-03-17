'use client';

import { format, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, areIntervalsOverlapping } from 'date-fns';
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
        ? eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 })
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
            INV: 'bg-slate-500',
            PAF: 'bg-slate-500',
        };
        return colors[team] || 'bg-gray-500';
    };

    // Функция для определения позиции периода
    const getPeriodPosition = (date: Date) => {
        for (let i = 0; i < periods.length; i++) {
            const periodStart = viewMode === 'weeks'
                ? startOfWeek(periods[i], { weekStartsOn: 1 })
                : startOfMonth(periods[i]);

            const periodEnd = viewMode === 'weeks'
                ? endOfWeek(periods[i], { weekStartsOn: 1 })
                : endOfMonth(periods[i]);

            if (date >= periodStart && date <= periodEnd) {
                return i;
            }
        }
        return -1;
    };

    // Определяем ширину одного периода в пикселях
    const periodWidth = 200;

    // Вычисляем высоту контейнера задач
    const taskContainerHeight = filteredTasks.length * 30 + 10; // 30px на задачу + отступ

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
            <div
                className="grid relative"
                style={{
                    gridTemplateColumns: `repeat(${periods.length}, minmax(${periodWidth}px, 1fr))`,
                    minWidth: `${periods.length * periodWidth}px`,
                    minHeight: `${taskContainerHeight + 50}px` // Добавляем общую высоту для учета заголовков
                }}
            >
                {periods.map((period, index) => {
                    const periodStart = viewMode === 'weeks' ? startOfWeek(period, { weekStartsOn: 1 }) : startOfMonth(period);
                    const periodEnd = viewMode === 'weeks' ? endOfWeek(period, { weekStartsOn: 1 }) : endOfMonth(period);
                    const formatStr = viewMode === 'weeks' ? 'MMM d' : 'MMMM yyyy';

                    return (
                        <div
                            key={periodStart.toISOString()}
                            className="timeline-cell border-r border-gray-200 p-2"
                        >
                            <div className="text-sm font-semibold mb-2 sticky top-0 bg-white">
                                {format(periodStart, formatStr)}
                                {viewMode === 'weeks' && ` - ${format(periodEnd, 'MMM d')}`}
                            </div>
                        </div>
                    );
                })}

                {/* Tasks container */}
                <div
                    className="absolute w-full"
                    style={{
                        top: '45px',
                        height: `${taskContainerHeight}px`
                    }}
                >
                    {filteredTasks.map((task, taskIndex) => {
                        const taskStart = new Date(task.startDate);
                        const taskEnd = new Date(task.endDate);

                        // Skip tasks that are entirely outside the visible range
                        if (taskEnd < startDate || taskStart > endDate) {
                            return null;
                        }

                        // Find the position of start and end periods
                        const startPeriodIndex = getPeriodPosition(taskStart);
                        const endPeriodIndex = getPeriodPosition(taskEnd);

                        // Skip if task doesn't align with any visible period
                        if (startPeriodIndex === -1 && endPeriodIndex === -1) {
                            return null;
                        }

                        // Use the first visible period if start is before view
                        const effectiveStartIndex = startPeriodIndex === -1 ? 0 : startPeriodIndex;
                        // Use the last visible period if end is after view
                        const effectiveEndIndex = endPeriodIndex === -1 ? periods.length - 1 : endPeriodIndex;

                        // Calculate position and width based on period indices
                        const left = effectiveStartIndex * periodWidth;
                        const width = (effectiveEndIndex - effectiveStartIndex + 1) * periodWidth;

                        const colorClass = getTaskColor(task.code);

                        return (
                            <div
                                key={task.id}
                                className={`${colorClass} text-white absolute rounded-sm overflow-hidden`}
                                style={{
                                    left: `${left}px`,
                                    width: `${width}px`,
                                    top: `${taskIndex * 30}px`,
                                    height: '24px',
                                }}
                            >
                                <div className="font-mono text-xs whitespace-nowrap truncate px-1">
                                    {task.code}: {task.title}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 