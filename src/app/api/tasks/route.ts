import { NextResponse } from 'next/server';
import db from '@/lib/db';
import logger from '@/utils/logger';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        let query = 'SELECT * FROM tasks';
        let params: any[] = [];

        if (projectId) {
            query += ' WHERE project_id = ?';
            params.push(projectId);
        }

        query += ' ORDER BY start_date ASC';

        const tasks = db.prepare(query).all(...params);
        return NextResponse.json(tasks);
    } catch (error) {
        logger.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
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

        const result = db.prepare(`
      INSERT INTO tasks (project_id, title, code, start_date, end_date)
      VALUES (?, ?, ?, ?, ?)
    `).run(projectId, title, code, startDate, endDate);

        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

        logger.info('Created new task:', {
            id: task.id,
            title: task.title,
            code: task.code,
            projectId: task.project_id
        });

        return NextResponse.json(task);
    } catch (error) {
        logger.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
} 