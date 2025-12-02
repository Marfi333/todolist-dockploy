import { db } from '../../database';
import { todos } from '../../database/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const allTodos = await db.select().from(todos).orderBy(desc(todos.createdAt));
    return allTodos;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch todos',
    });
  }
});

