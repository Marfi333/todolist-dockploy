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

    const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);

    if (todo.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo not found',
      });
    }

    return todo[0];
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch todo',
    });
  }
});

