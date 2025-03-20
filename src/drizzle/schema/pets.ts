import {
	pgTable,
	text,
	uuid,
	varchar,
	pgEnum,
	jsonb,
	date,
} from 'drizzle-orm/pg-core';

import { userTable } from './users';
import { petImagesTable } from './petImages';
import { createdAt, id, updatedAt } from '../schemaHelpers';
import { petContactNumbersTable } from './petContactNumbers';

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
	'birth_date_accuracy',
	birthDateAccuracyValues,
);

export const petTable = pgTable('pets_table', {
	id,
	user_id: uuid('user_id')
		.notNull()
		.references(() => userTable.id),
	name: varchar('name', { length: 100 }).notNull(),
	species: petSpeciesEnum('species').notNull(),
	raza: varchar('raza', { length: 50 }),
	birth_date: date('birth_date'),
	birth_date_accuracy: birthDateAccuracyEnum('birth_date_accuracy'),
	gender: gendersEnum('gender'),
	description: text('description'),
	main_contact_number_id: uuid('main_contact_number_id')
		.references(() => petContactNumbersTable.id)
		.notNull(),
	profile_image_id: uuid('profile_image_id')
		.references(() => petImagesTable.id)
		.notNull(),
	qr_url: text('qr_url').notNull().unique(),
	extra_fields: jsonb('extra_fields'),
	created_at: createdAt,
	updated_at: updatedAt,
});
