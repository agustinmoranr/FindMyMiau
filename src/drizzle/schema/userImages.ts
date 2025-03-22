import { relations, sql } from 'drizzle-orm';
import {
	pgTable,
	uuid,
	pgPolicy,
	text,
	varchar,
	boolean,
} from 'drizzle-orm/pg-core';
import { authenticatedRole } from 'drizzle-orm/supabase';
import { createdAt, id } from '../schemaHelpers';
import { usersTable } from './users';

// Private user images
export const userImagesTable = pgTable(
	'user_images_table',
	{
		id: id,
		user_id: uuid('user_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		is_public: boolean('is_public').default(false), // Flag to control visibility
		url: text('url').notNull(),
		thumbnail_url: text('thumbnail_url'),
		alt_text: varchar('alt_text', { length: 255 }),
		content_type: varchar('content_type', { length: 50 }),
		createdAt,
	},
	(table) => [
		// Policy for SELECT - owners can see their own images
		pgPolicy('owners_can_view_their_images', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'select',
			using: sql`auth.uid() = ${table.user_id}`,
		}),

		// Policy for SELECT - anyone can see public images
		pgPolicy('anyone_can_view_public_images', {
			as: 'permissive',
			for: 'select',
			using: sql`${table.is_public} = true`,
		}),

		// Only owners can modify their user images
		pgPolicy('owners_can_access_their_user_images', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'all',
			using: sql`auth.uid() = ${table.user_id}`,
			withCheck: sql`auth.uid() = ${table.user_id}`,
		}),
	],
);

export type InsertUserImage = typeof userImagesTable.$inferInsert;
export type SelectUserImage = typeof userImagesTable.$inferSelect;
