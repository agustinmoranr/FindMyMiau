import { sql } from 'drizzle-orm';
import { pgPolicy, pgTable, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { petsTable } from './pets';
import { userPhoneNumbersTable } from './userPhoneNumbers';
import { authenticatedRole } from 'drizzle-orm/supabase';

export const petUserPhoneNumbersTable = pgTable(
	'pet_user_phone_numbers_table',
	{
		id,
		pet_id: uuid('pet_id')
			.notNull()
			.references(() => petsTable.id, { onDelete: 'cascade' }),
		user_phone_number_id: uuid('user_phone_number_id')
			.notNull()
			.references(() => userPhoneNumbersTable.id, { onDelete: 'cascade' }),
		createdAt,
	},
	(table) => [
		pgPolicy('users_can_view_pet_contact_numbers', {
			as: 'permissive',
			for: 'select',
			using: sql`true`,
		}),
		pgPolicy('owners_can_modify_pet_contact_numbers', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'all',
			using: sql`EXISTS (
        SELECT 1 FROM ${petsTable} 
        WHERE ${petsTable.id} = ${table.pet_id} 
        AND ${petsTable.user_id} = auth.uid()
      )`,
			withCheck: sql`EXISTS (
        SELECT 1 FROM ${petsTable} 
        WHERE ${petsTable.id} = ${table.pet_id} 
        AND ${petsTable.user_id} = auth.uid()
      )`,
		}),
	],
);
