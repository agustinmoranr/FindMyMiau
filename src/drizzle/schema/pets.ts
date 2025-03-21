import {
	pgTable,
	text,
	uuid,
	varchar,
	pgEnum,
	jsonb,
	date,
	pgPolicy,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';

import { usersTable } from './users';
import { createdAt, id, updatedAt } from '../schemaHelpers';

export const petSpecies = ['gato', 'perro', 'ave', 'otro'] as const;
export type PetSpecies = (typeof petSpecies)[number];
export const petSpeciesEnum = pgEnum('pet_species', petSpecies);

export const genders = ['macho', 'hembra'] as const;
export type Genders = (typeof genders)[number];
export const gendersEnum = pgEnum('genders', genders);

export const birthDateAccuracyValues = [
	'exact',
	'month_year',
	'year_only',
	'estimated',
] as const;
export type BirthDateAccuracy = (typeof birthDateAccuracyValues)[number];
export const birthDateAccuracyEnum = pgEnum(
	'birthdate_accuracy',
	birthDateAccuracyValues,
);

export const petsTable = pgTable(
	'pets_table',
	{
		id,
		user_id: uuid('user_id')
			.notNull()
			.references(() => usersTable.id),
		name: varchar('name', { length: 100 }).notNull(),
		species: petSpeciesEnum('species').notNull(),
		race: varchar('race', { length: 50 }),
		birthdate: date('birthdate'),
		birthdate_accuracy: birthDateAccuracyEnum('birthdate_accuracy'),
		gender: gendersEnum('gender'),
		description: text('description'),
		main_contact_phone_number_id: uuid('main_contact_phone_number_id'),
		qr_url: text('qr_url').notNull().unique(),
		extra_fields: jsonb('extra_fields'),
		created_at: createdAt,
		updated_at: updatedAt,
	},
	(table) => [
		//Policy for SELECT - anyone can view pets
		pgPolicy('users_can_view_pets', {
			as: 'permissive',
			for: 'select', // Only applies for SELECT operations
			using: sql`true`, //Always evaluate to true (allow access to all rows)
		}),

		// Policy for INSERT/UPDATE/DELETE - only owners can modify
		pgPolicy('owners_can_modify_pets', {
			as: 'permissive', // explicitly set as permissive
			to: authenticatedRole, // apply to authenticated users
			for: 'all', // all operations (select, insert, update, delete)
			using: sql`auth.uid() = ${table.user_id}`, // For SELECT/UPDATE/DELETE
			withCheck: sql`auth.uid() = ${table.user_id}`, // For INSERT/UPDATE
		}),
	],
);
