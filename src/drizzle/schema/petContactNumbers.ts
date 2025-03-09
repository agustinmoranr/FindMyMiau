import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schemaHelpers';

export const petContactNumbersTable = pgTable('pet_contact_numbers_table', {
	id: id,
	pet_id: uuid('pet_id').notNull(),
	phone_number: text('phone_number').notNull(),
	createdAt,
	updatedAt,
});
