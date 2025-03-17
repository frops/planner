import { NextResponse } from 'next/server';
import db from '@/lib/db';
import logger from '@/utils/logger';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(params.id);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        logger.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
} 