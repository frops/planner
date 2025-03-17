'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Project {
    id: number;
    name: string;
    createdAt: string;
    tasks: Task[];
}

interface Task {
    id: number;
    title: string;
    code: string;
    startDate: string;
    endDate: string;
    projectId: number | null;
    createdAt: string;
    project?: Project;
}

interface LocalStorageContextType {
    projects: Project[];
    tasks: Task[];
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'tasks'>) => Promise<Project>;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'project'>) => Promise<Task>;
    deleteTask: (id: number) => Promise<void>;
}

const LocalStorageContext = createContext<LocalStorageContextType | null>(null);

export function LocalStorageProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        // Load initial data from API
        const fetchData = async () => {
            try {
                const [projectsRes, tasksRes] = await Promise.all([
                    fetch('/api/projects'),
                    fetch('/api/tasks')
                ]);

                if (projectsRes.ok && tasksRes.ok) {
                    const [projectsData, tasksData] = await Promise.all([
                        projectsRes.json(),
                        tasksRes.json()
                    ]);

                    setProjects(projectsData);
                    setTasks(tasksData);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        fetchData();
    }, []);

    const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'tasks'>) => {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        });

        if (!response.ok) {
            throw new Error('Failed to create project');
        }

        const newProject = await response.json();
        setProjects(prev => [...prev, newProject]);
        return newProject;
    };

    const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'project'>) => {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }

        const newTask = await response.json();
        setTasks(prev => [...prev, newTask]);
        return newTask;
    };

    const deleteTask = async (id: number) => {
        const response = await fetch(`/api/tasks?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        setTasks(prev => prev.filter(task => task.id !== id));
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