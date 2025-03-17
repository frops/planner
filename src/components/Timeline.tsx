import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { useTaskStore } from '../store';

interface TimelineProps {
    startDate: Date;
    endDate: Date;
}

export const Timeline: React.FC<TimelineProps> = ({ startDate, endDate }) => {
    const tasks = useTaskStore((state) => state.tasks);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const today = new Date();

    return (
        <div className="overflow-x-auto">
            <div className="min-w-max">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-1">
                    {days.map((day) => (
                        <div
                            key={day.toISOString()}
                            className={`p-2 text-center text-sm ${isSameDay(day, today) ? 'bg-blue-100' : ''
                                }`}
                        >
                            {format(day, 'd')}
                        </div>
                    ))}
                </div>
                <div className="mt-4 space-y-2">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-2"
                            style={{ backgroundColor: task.color }}
                        >
                            <div className="w-32 truncate">{task.title}</div>
                            <div className="text-sm text-gray-600">{task.code}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 