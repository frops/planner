import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                project: true,
            },
        });
        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const task = await prisma.task.create({
            data: {
                title: data.title,
                code: data.code,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                projectId: data.projectId,
            },
            include: {
                project: true,
            },
        });
        return NextResponse.json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }

        await prisma.task.delete({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
} 