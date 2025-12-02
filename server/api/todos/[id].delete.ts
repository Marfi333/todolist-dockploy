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

    const deletedTodo = await db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();

    if (deletedTodo.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Todo not found',
      });
    }

    return { success: true, message: 'Todo deleted successfully' };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete todo',
    });
  }
});

