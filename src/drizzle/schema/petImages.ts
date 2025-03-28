import { relations, sql } from 'drizzle-orm';
import {
	integer,
	pgTable,
	boolean,
	uuid,
	pgPolicy,
	text,
	varchar,
} from 'drizzle-orm/pg-core';
import { authenticatedRole } from 'drizzle-orm/supabase';
import { createdAt, id } from '../schemaHelpers';
import { petsTable } from './pets';
import { usersTable } from './users';

export const petImagesTable = pgTable(
	'pet_images_table',
	{
		id: id,
		pet_id: uuid('pet_id')
			.notNull()
			.references(() => petsTable.id, { onDelete: 'cascade' }),
		user_id: uuid('user_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),

		url: text('url').notNull(),
		thumbnail_url: text('thumbnail_url'),
		alt_text: varchar('alt_text', { length: 255 }),
		content_type: varchar('content_type', { length: 50 }),
		display_order: integer('display_order'), // For custom sorting in gallery
		is_profile: boolean('is_profile').default(false),
		createdAt,
	},
	(table) => [
		pgPolicy('anyone_can_view_pet_images', {
			as: 'permissive',
			for: 'select',
			using: sql`true`,
		}),

		pgPolicy('pet_owners_can_modify_pet_images', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'all',
			using: sql`auth.uid() = ${table.user_id}`,
			withCheck: sql`auth.uid() = ${table.user_id}`,
		}),
	],
);
