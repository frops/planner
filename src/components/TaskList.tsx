import { useTaskStore } from '../store';

export const TaskList: React.FC = () => {
    const tasks = useTaskStore((state) => state.tasks);
    const removeTask = useTaskStore((state) => state.removeTask);

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Tasks</h2>
            <div className="space-y-2">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: task.color }}
                    >
                        <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-gray-600">{task.code}</div>
                        </div>
                        <button
                            onClick={() => removeTask(task.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}; 