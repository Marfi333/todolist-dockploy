import { db } from '../../database';
import { todos } from '../../database/schema';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required',
      });
    }

    const newTodo = await db.insert(todos).values({
      title: body.title.trim(),
      description: body.description?.trim() || null,
      completed: false,
    }).returning();

    return newTodo[0];
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create todo',
    });
  }
});

