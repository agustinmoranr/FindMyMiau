import { pgTable, text } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';

export const userTable = pgTable('users_table', {
	id: id,
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	phone_number: text('phone_number').unique(),
	password: text('password'),
	profile_image_url: text('profile_image_url'),
	created_at: createdAt,
	updated_at: updatedAt,
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;
