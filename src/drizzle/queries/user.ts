import { db } from '../db';
import { usersTable, type SelectUser, type InsertUser } from '../schema';
import { eq } from 'drizzle-orm';

export async function createUser(data: InsertUser) {
	return await db.insert(usersTable).values(data);
}

export async function getUserByEmail(email: SelectUser['email']) {
	return await db.select().from(usersTable).where(eq(usersTable.email, email));
}
