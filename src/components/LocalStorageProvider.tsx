'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Project {
    id: number;
    name: string;
    createdAt: string;
}

interface Task {
    id: number;
    title: string;
    code: string;
    startDate: string;
    endDate: string;
    projectId: number | null;
    createdAt: string;
}

interface LocalStorageContextType {
    projects: Project[];
    tasks: Task[];
    addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
    deleteTask: (id: number) => Promise<void>;
}

const LocalStorageContext = createContext<LocalStorageContextType | null>(null);

export function LocalStorageProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        // Load initial data from localStorage
        const storedProjects = localStorage.getItem('projects');
        const storedTasks = localStorage.getItem('tasks');

        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
        const newProject: Project = {
            ...projectData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
        };

        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));

        return newProject;
    };

    const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        const newTask: Task = {
            ...taskData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        return newTask;
    };

    const deleteTask = async (id: number) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    return (
        <LocalStorageContext.Provider
            value={{
                projects,
                tasks,
                addProject,
                addTask,
                deleteTask,
            }}
        >
            {children}
        </LocalStorageContext.Provider>
    );
}

export function useLocalStorage() {
    const context = useContext(LocalStorageContext);
    if (!context) {
        throw new Error('useLocalStorage must be used within a LocalStorageProvider');
    }
    return context;
} 