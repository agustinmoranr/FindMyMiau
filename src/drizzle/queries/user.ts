import { db } from '../db';
import {
	usersTable,
	type SelectUser,
	type InsertUser,
	userImagesTable,
	type InsertUserImage,
} from '../schema';
import { eq } from 'drizzle-orm';

export async function createUser(data: InsertUser) {
	return await db.insert(usersTable).values(data);
}

export async function updateUser(
	id: SelectUser['id'],
	data: Partial<InsertUser>,
) {
	return await db.update(usersTable).set(data).where(eq(usersTable.id, id));
}

export async function getUserByEmail(email: SelectUser['email']) {
	return await db.select().from(usersTable).where(eq(usersTable.email, email));
}

export async function createUserImage(data: InsertUserImage) {
	return await db.insert(userImagesTable).values(data).returning();
}
