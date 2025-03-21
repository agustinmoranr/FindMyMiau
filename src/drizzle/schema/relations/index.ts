import { relations } from 'drizzle-orm';
import { usersTable } from '../users';
import { userImagesTable } from '../userImages';
import { petsTable } from '../pets';
import { petImagesTable } from '../petImages';
import { petContactNumbersTable } from '../petContactNumbers';

// Define relations for the users table
export const userRelations = relations(usersTable, ({ many }) => ({
	// A user can have many entries in the user_images table
	userImages: many(userImagesTable),

	// A user can have many entries in the pets table
	pets: many(petsTable),
}));

// Define relations for the userImages join table
export const userImagesRelations = relations(userImagesTable, ({ one }) => ({
	// Each entry in the join table relates to exactly one user
	user: one(usersTable, {
		fields: [userImagesTable.user_id],
		references: [usersTable.id],
	}),
}));

// Define relations for the Pet table
export const petRelations = relations(petsTable, ({ one, many }) => ({
	//A pet can have one entry in users table
	petOwner: one(usersTable, {
		fields: [petsTable.user_id],
		references: [usersTable.id],
	}),

	// A pet can have many entries in the pet_images table
	petImages: many(petImagesTable),

	mainContactNumber: one(petContactNumbersTable, {
		fields: [petsTable.main_contact_number_id],
		references: [petContactNumbersTable.id],
	}),
}));

// Define relations for the PetImages join table
export const petImagesRelations = relations(petImagesTable, ({ one }) => ({
	// Each entry in the join table relates to exactly one pet
	pet: one(petsTable, {
		fields: [petImagesTable.pet_id],
		references: [petsTable.id],
	}),

	// Each entry in the join table relates to exactly one user
	user: one(usersTable, {
		fields: [petImagesTable.user_id],
		references: [usersTable.id],
	}),
}));

export const petContactNumbersRelations = relations(
	petContactNumbersTable,
	({ one, many }) => ({
		owner: one(usersTable, {
			fields: [petContactNumbersTable.user_id],
			references: [usersTable.id],
		}),
		associatedPets: many(petsTable),
	}),
);
