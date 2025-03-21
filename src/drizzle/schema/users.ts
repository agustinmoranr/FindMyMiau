import { sql } from 'drizzle-orm';
import {
	boolean,
	pgPolicy,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
// import { userImagesTable } from './userImages';
import { authenticatedRole } from 'drizzle-orm/supabase';
import { createdAt, id, updatedAt } from '../schemaHelpers';

export const usersTable = pgTable(
	'users_table',
	{
		id: id,
		name: text('name').notNull(),
		email: text('email').notNull().unique(),
		phone_number: text('phone_number').unique(),
		password: text('password'),
		profile_image_url: text('profile_image_url'),
		is_public: boolean('is_public').default(true), // Flag to control visibility
		deletedAt: timestamp({ withTimezone: true }),
		created_at: createdAt,
		updated_at: updatedAt,
	},
	(table) => [
		// Policy for SELECT - owners can see their own data
		pgPolicy('owners_can_view_their_data', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'select',
			using: sql`auth.uid() = ${table.id}`,
		}),

		// Policy for SELECT - everyone can see the user data, while its profile be public
		pgPolicy('users_can_view_their_data_if_public_profile', {
			as: 'permissive',
			for: 'select',
			using: sql`${table.is_public} = true`,
		}),

		// Only owners can modify their own data
		pgPolicy('owners_can_modify_data', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'all',
			using: sql`auth.uid() = ${table.id}`,
			withCheck: sql`auth.uid() = ${table.id}`,
		}),
	],
);

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
