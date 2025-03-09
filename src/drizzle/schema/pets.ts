import {
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
	pgEnum,
	integer,
	jsonb,
} from 'drizzle-orm/pg-core';

import { userTable } from './users';
import { petImagesTable } from './petImages';
// import { gendersEnum, petSpeciesEnum } from '../enums';
import { createdAt, id, updatedAt } from '../schemaHelpers';

export const petSpecies = ['perro', 'gato', 'ave', 'otro'] as const;
export type PetSpecies = (typeof petSpecies)[number];
export const petSpeciesEnum = pgEnum('pet_species', petSpecies);

export const genders = ['macho', 'hembra'] as const;
export type Genders = (typeof genders)[number];
export const gendersEnum = pgEnum('genders', genders);

export const petTable = pgTable('pets_table', {
	id,
	user_id: uuid('user_id')
		.notNull()
		.references(() => userTable.id),
	name: varchar('name', { length: 100 }).notNull(),
	species: petSpeciesEnum('species').notNull(),
	raza: varchar('raza', { length: 50 }),
	age: integer('age'),
	gender: gendersEnum('gender'),
	description: text('description'),
	profile_image_id: uuid('profile_image_id')
		.references(() => petImagesTable.id)
		.notNull(),
	qr_url: text('qr_url').notNull().unique(),
	extra_fields: jsonb('extra_fields'),
	created_at: createdAt,
	updated_at: updatedAt,
});
