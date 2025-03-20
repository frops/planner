'use client';

import { format, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, differenceInDays, differenceInMilliseconds, isSameDay, eachDayOfInterval, isEqual } from 'date-fns';
import { ru } from 'date-fns/locale';
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

    // Получаем все дни в видимом диапазоне для режима недель
    const allDaysInRange = viewMode === 'weeks'
        ? eachDayOfInterval({ start: visibleRangeStart, end: visibleRangeEnd })
        : [];

    // Функция для получения дробного индекса (не целое число, а точное положение внутри периода)
    const getExactPeriodPosition = (date: Date) => {
        for (let i = 0; i < periodRanges.length; i++) {
            const { periodStart, periodEnd } = periodRanges[i];

            if (date >= periodStart && date <= periodEnd) {
                // Если дата внутри периода, вычисляем дробную часть
                const periodDuration = differenceInMilliseconds(periodEnd, periodStart);
                const dateDuration = differenceInMilliseconds(date, periodStart);
                const fraction = dateDuration / periodDuration;

                return i + fraction;
            }
        }

        // Если дата раньше или позже видимого диапазона
        if (date < visibleRangeStart) return 0;
        if (date > visibleRangeEnd) return periodRanges.length;

        return -1; // Не должно происходить
    };

    // Для режима недель: функция для расчета позиции дня с равномерным распределением
    const getDayPosition = (day: Date) => {
        // Вычисляем количество полных дней от начала видимого диапазона
        const daysDiff = differenceInDays(day, visibleRangeStart);

        // В режиме недель, каждую неделю делим ровно на 7 частей
        // Определяем, в какой неделе находится день (целочисленное деление)
        const weekIndex = Math.floor(daysDiff / 7);

        // Определяем день внутри недели (0-6)
        const dayInWeek = daysDiff % 7;

        // Возвращаем индекс недели + дробную часть, соответствующую положению дня в неделе
        return weekIndex + (dayInWeek / 7);
    };

    // Отладочный вывод
    useEffect(() => {
        console.log("Visible range:", visibleRangeStart, "to", visibleRangeEnd, "Total days:", totalVisibleDays);
        console.log("Period ranges:", periodRanges);
        console.log("Today date:", today);

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
                    startPosition: getExactPeriodPosition(startDate),
                    endPosition: getExactPeriodPosition(endDate)
                };
            });
            console.log("Tasks debug:", taskDebug);
        }
    }, [periodRanges, tasks, viewMode]);

    // Получаем актуальную дату, используя свежий объект
    const today = new Date();

    // Убеждаемся, что это действительно сегодняшняя дата без кеширования
    today.setHours(0, 0, 0, 0);

    // Отладочный вывод для проверки корректности текущей даты
    useEffect(() => {
        console.log("Today real date:", new Date());
        console.log("Today in component:", today);
        console.log("Formatted with RU locale:", format(today, 'd MMM', { locale: ru }));
    }, []);

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

    // Определяем ширину одного периода в пикселях
    const periodWidth = 200;
    const totalGridWidth = periods.length * periodWidth;

    // Вычисляем высоту контейнера задач
    const taskContainerHeight = filteredTasks.length * 30 + 10; // 30px на задачу + отступ

    // Рассчитываем позицию сегодняшней линии
    const todayPosition = viewMode === 'weeks' ? getDayPosition(today) : getExactPeriodPosition(today);
    const todayPositionPx = todayPosition * periodWidth;

    // Проверяем, находится ли сегодняшний день в видимом диапазоне
    const isTodayVisible = today >= visibleRangeStart && today <= visibleRangeEnd;

    return (
        <div className="relative overflow-x-auto">
            {/* Today line - fixed position relative to content */}
            {isTodayVisible && (
                <div
                    className="absolute top-0 bottom-0 w-px bg-red-600 z-10"
                    style={{
                        left: `${todayPositionPx}px`,
                        opacity: '0.8' // Делаем линию темнее
                    }}
                >
                    <div className="absolute top-0 -ml-[3px] w-[7px] h-[7px] rounded-full bg-red-600"></div>
                    <div className="absolute -top-6 -ml-[25px] bg-red-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                        {format(today, 'd MMM', { locale: ru })}
                    </div>
                </div>
            )}

            {/* Timeline grid */}
            <div
                className="grid relative"
                style={{
                    gridTemplateColumns: `repeat(${periods.length}, minmax(${periodWidth}px, 1fr))`,
                    minWidth: `${totalGridWidth}px`,
                    minHeight: `${taskContainerHeight + 50}px` // Добавляем общую высоту для учета заголовков
                }}
            >
                {/* Day separator lines for week mode */}
                {viewMode === 'weeks' && periods.map((period, periodIndex) => {
                    // Получаем начало и конец недели
                    const weekStart = periodRanges[periodIndex].periodStart;

                    // Создаем полоски для 7 дней недели
                    return Array.from({ length: 7 }).map((_, dayIndex) => {
                        // Позиция внутри недели (от 0/7 до 6/7)
                        const dayPosition = periodIndex + (dayIndex / 7);
                        const dayPositionPx = dayPosition * periodWidth;

                        // Первая полоска (начало недели/понедельник) совпадает с границей, делаем ее более заметной
                        const isFirstDayOfWeek = dayIndex === 0;

                        return (
                            <div
                                key={`${periodIndex}-${dayIndex}`}
                                className={`absolute top-0 bottom-0 w-px ${isFirstDayOfWeek ? 'bg-gray-500' : 'bg-gray-200'} z-5`}
                                style={{
                                    left: `${dayPositionPx}px`,
                                    opacity: isFirstDayOfWeek ? '1' : '0.7'
                                }}
                            />
                        );
                    });
                })}

                {periods.map((period, index) => {
                    const periodStart = periodRanges[index].periodStart;
                    const periodEnd = periodRanges[index].periodEnd;

                    // Форматирование заголовков периодов
                    let headerText = '';
                    if (viewMode === 'weeks') {
                        // Формат "Мар 3 - Мар 9", убедимся, что месяц с заглавной буквы и используем русскую локаль
                        const startFormatted = format(periodStart, 'MMM d', { locale: ru });
                        const endFormatted = format(periodEnd, 'MMM d', { locale: ru });
                        headerText = `${startFormatted} - ${endFormatted}`;
                    } else {
                        // Формат "Мар 2024", убедимся, что месяц с заглавной буквы и используем русскую локаль
                        headerText = format(periodStart, 'MMM yyyy', { locale: ru });
                    }

                    return (
                        <div
                            key={periodStart.toISOString()}
                            className="timeline-cell p-2"
                            style={{
                                borderRight: viewMode === 'weeks'
                                    ? '2px solid rgb(107 114 128)' // bg-gray-500 
                                    : '1px solid rgb(229 231 235)' // bg-gray-200
                            }}
                        >
                            <div className="text-sm font-semibold mb-2 sticky top-0 bg-white">
                                {headerText}
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

                        // Calculate exact fractional positions for weeks mode
                        let startPos, endPos;

                        if (viewMode === 'weeks') {
                            // Используем функцию getDayPosition для расчета точного положения в неделе
                            startPos = getDayPosition(taskStart);
                            endPos = getDayPosition(taskEnd);

                            // Если задача заканчивается за пределами видимого диапазона, ограничиваем
                            if (taskEnd > visibleRangeEnd) {
                                endPos = periods.length;
                            }

                            // Если задача начинается до видимого диапазона, ограничиваем
                            if (taskStart < visibleRangeStart) {
                                startPos = 0;
                            }
                        } else {
                            // Для режима месяцев используем оригинальную функцию
                            startPos = getExactPeriodPosition(taskStart);
                            endPos = getExactPeriodPosition(taskEnd);
                        }

                        // Convert positions to pixels
                        const left = startPos * periodWidth;
                        const width = (endPos - startPos) * periodWidth;

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
                                        ({format(taskStart, 'MMM d', { locale: ru })} - {format(taskEnd, 'MMM d', { locale: ru })})
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