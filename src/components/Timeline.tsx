'use client';

import { format, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, differenceInDays } from 'date-fns';
import { useLocalStorage } from '@/components/LocalStorageProvider';
import { useEffect } from 'react';

interface TimelineProps {
    startDate: Date;
    endDate: Date;
    projectId?: number;
    viewMode: 'weeks' | 'months';
}

export function Timeline({ startDate, endDate, projectId, viewMode }: TimelineProps) {
    const { tasks } = useLocalStorage();

    // Определяем периоды
    const periods = viewMode === 'weeks'
        ? eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 })
        : eachMonthOfInterval({ start: startDate, end: endDate });

    // Получаем для каждого периода его реальные даты начала и конца
    const periodRanges = periods.map(period => {
        const periodStart = viewMode === 'weeks'
            ? startOfWeek(period, { weekStartsOn: 1 })
            : startOfMonth(period);
        const periodEnd = viewMode === 'weeks'
            ? endOfWeek(period, { weekStartsOn: 1 })
            : endOfMonth(period);
        return { periodStart, periodEnd };
    });

    // Общий видимый диапазон
    const visibleRangeStart = periodRanges[0].periodStart;
    const visibleRangeEnd = periodRanges[periodRanges.length - 1].periodEnd;
    const totalVisibleDays = differenceInDays(visibleRangeEnd, visibleRangeStart) + 1;

    // Отладочный вывод
    useEffect(() => {
        console.log("Visible range:", visibleRangeStart, "to", visibleRangeEnd, "Total days:", totalVisibleDays);
        console.log("Period ranges:", periodRanges);

        if (tasks) {
            const taskDebug = tasks.map(t => {
                const startDate = new Date(t.startDate);
                const endDate = new Date(t.endDate);
                return {
                    id: t.id,
                    code: t.code,
                    title: t.title,
                    startDate,
                    endDate,
                    startPosition: getPositionForDate(startDate),
                    endPosition: getPositionForDate(endDate)
                };
            });
            console.log("Tasks debug:", taskDebug);
        }
    }, [periodRanges, tasks, viewMode]);

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

    // Функция для определения позиции даты относительно всего диапазона (в процентах)
    const getPositionForDate = (date: Date) => {
        // Если дата раньше начала видимого диапазона
        if (date < visibleRangeStart) {
            return 0;
        }
        // Если дата позже конца видимого диапазона
        if (date > visibleRangeEnd) {
            return 100;
        }

        // Иначе вычисляем позицию в процентах
        const daysBefore = differenceInDays(date, visibleRangeStart);
        return (daysBefore / totalVisibleDays) * 100;
    };

    // Определяем ширину одного периода в пикселях
    const periodWidth = 200;
    const totalGridWidth = periods.length * periodWidth;

    // Вычисляем высоту контейнера задач
    const taskContainerHeight = filteredTasks.length * 30 + 10; // 30px на задачу + отступ

    return (
        <div className="relative overflow-x-auto">
            {/* Today line */}
            <div
                className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                style={{
                    left: `${getPositionForDate(today)}%`,
                }}
            />

            {/* Timeline grid */}
            <div
                className="grid relative"
                style={{
                    gridTemplateColumns: `repeat(${periods.length}, minmax(${periodWidth}px, 1fr))`,
                    minWidth: `${totalGridWidth}px`,
                    minHeight: `${taskContainerHeight + 50}px` // Добавляем общую высоту для учета заголовков
                }}
            >
                {periods.map((period, index) => {
                    const periodStart = periodRanges[index].periodStart;
                    const periodEnd = periodRanges[index].periodEnd;
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
                        if (taskEnd < visibleRangeStart || taskStart > visibleRangeEnd) {
                            return null;
                        }

                        // Calculate position and width as percentage of total grid
                        const startPos = getPositionForDate(taskStart);
                        const endPos = getPositionForDate(taskEnd);

                        // Convert percentage to pixels
                        const left = (startPos / 100) * totalGridWidth;
                        const width = ((endPos - startPos) / 100) * totalGridWidth;

                        const colorClass = getTaskColor(task.code);

                        return (
                            <div
                                key={task.id}
                                className={`${colorClass} text-white absolute rounded-sm overflow-hidden`}
                                style={{
                                    left: `${left}px`,
                                    width: `${Math.max(width, 5)}px`, // Минимальная ширина 5px
                                    top: `${taskIndex * 30}px`,
                                    height: '24px',
                                }}
                            >
                                <div className="font-mono text-xs whitespace-nowrap truncate px-1">
                                    {task.code}: {task.title}
                                    <span className="ml-2 text-xs opacity-75">
                                        ({format(taskStart, 'MMM d')} - {format(taskEnd, 'MMM d')})
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 