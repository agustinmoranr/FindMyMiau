import { db } from '../db';
import { userTable, type SelectUser, type InsertUser } from '../schema';
import { eq } from 'drizzle-orm';

export async function createUser(data: InsertUser) {
	return await db.insert(userTable).values(data);
}

export async function getUserByEmail(email: SelectUser['email']) {
	return await db.select().from(userTable).where(eq(userTable.email, email));
}
