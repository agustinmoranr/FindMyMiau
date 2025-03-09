import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';

export const petImagesTable = pgTable('pet_images_table', {
	id: id,
	pet_id: uuid('pet_id').notNull(),
	image_url: text('image_url').notNull(),
	createdAt,
});
