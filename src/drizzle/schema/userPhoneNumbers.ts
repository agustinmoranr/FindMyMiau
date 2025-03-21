import { pgPolicy, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { usersTable } from './users';
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';

export const userPhoneNumbersTable = pgTable(
	'user_phone_numbers_table',
	{
		id: id,
		user_id: uuid('user_id')
			.notNull()
			.references(() => usersTable.id),
		phone_number: text('phone_number').notNull(),
		label: text('label'),
		createdAt,
		updatedAt,
	},
	(table) => [
		pgPolicy('users_can_view_contact_numbers', {
			as: 'permissive',
			for: 'select',
			using: sql`true`,
		}),
		pgPolicy('owners_can_modify_contact_numbers', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'all',
			using: sql`auth.uid() = ${table.user_id}`,
			withCheck: sql`auth.uid() = ${table.user_id}`,
		}),
	],
);
