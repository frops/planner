import { NextResponse } from 'next/server';
import db from '@/lib/db';
import logger from '@/utils/logger';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(params.id);

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        logger.info('Deleted task:', { id: params.id });
        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('Error deleting task:', error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
} 