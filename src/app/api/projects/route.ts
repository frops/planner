import { NextResponse } from 'next/server';

let projects: any[] = [];

// Load initial data if running in browser
if (typeof window !== 'undefined') {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    }
}

export async function GET() {
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const newProject = {
            id: Date.now(),
            name,
            createdAt: new Date().toISOString()
        };

        projects.push(newProject);

        // Save to localStorage if running in browser
        if (typeof window !== 'undefined') {
            localStorage.setItem('projects', JSON.stringify(projects));
        }

        return NextResponse.json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
} 