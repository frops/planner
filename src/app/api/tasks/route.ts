import { NextResponse } from 'next/server';

let tasks: any[] = [];

// Load initial data if running in browser
if (typeof window !== 'undefined') {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (projectId) {
        return NextResponse.json(tasks.filter(task => task.projectId === parseInt(projectId)));
    }

    return NextResponse.json(tasks);
}

export async function POST(request: Request) {
    try {
        const { title, code, startDate, endDate, projectId } = await request.json();

        if (!title || !code || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate code format
        const codeRegex = /^[A-Z]{1,4}-\d+$/;
        if (!codeRegex.test(code)) {
            return NextResponse.json({ error: 'Invalid code format' }, { status: 400 });
        }

        const newTask = {
            id: Date.now(),
            title,
            code,
            startDate,
            endDate,
            projectId: projectId ? parseInt(projectId) : null,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);

        // Save to localStorage if running in browser
        if (typeof window !== 'undefined') {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        return NextResponse.json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        if (taskIndex === -1) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        tasks.splice(taskIndex, 1);

        // Save to localStorage if running in browser
        if (typeof window !== 'undefined') {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
} 