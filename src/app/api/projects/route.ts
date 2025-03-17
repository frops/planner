import { NextResponse } from 'next/server';
import db from '@/lib/db';
import logger from '@/utils/logger';

export async function GET() {
    try {
        const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
        return NextResponse.json(projects);
    } catch (error) {
        logger.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const result = db.prepare('INSERT INTO projects (name) VALUES (?)').run(name);
        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);

        logger.info('Created new project:', { id: project.id, name: project.name });
        return NextResponse.json(project);
    } catch (error) {
        logger.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
} 