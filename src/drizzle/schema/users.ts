import { pgTable, text } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';

export const userTable = pgTable('users_table', {
	id: id,
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	phone_number: text('phone_number').notNull().unique(),
	password: text('password').notNull(),
	created_at: createdAt,
	updated_at: updatedAt,
});
