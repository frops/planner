import { create } from 'zustand';

export interface Task {
    id: number;
    title: string;
    code: string;
    startDate: string;
    endDate: string;
    projectId?: number;
}

interface TaskStore {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    removeTask: (id: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
})); 