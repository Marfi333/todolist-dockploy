import { db } from '../../database';
import { todos } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0');
    
    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid todo ID',
      });
    }

    const body = await readBody(event);
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title cannot be empty',
        });
      }
      updateData.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    if (body.completed !== undefined) {
      updateData.completed = Boolean(body.completed);
    }

    const updatedTodo = await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, id))
      .returning();

    if (updatedTodo.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo not found',
      });
    }

    return updatedTodo[0];
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update todo',
    });
  }
});

