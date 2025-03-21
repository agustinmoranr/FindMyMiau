import { relations } from 'drizzle-orm';
import { foreignKey } from 'drizzle-orm/pg-core';
import { usersTable } from '../users';
import { userImagesTable } from '../userImages';
import { petsTable } from '../pets';
import { petImagesTable } from '../petImages';
import { userPhoneNumbersTable } from '../userPhoneNumbers';
import { petUserPhoneNumbersTable } from '../pet_userPhoneNumbers';

// Define relations for the users table
export const userRelations = relations(usersTable, ({ many, one }) => ({
	// A user can have many entries in the user_images table
	userImages: many(userImagesTable),

	// A user can have many entries in the pets table
	pets: many(petsTable),

	// A user can have many entries in the userPhoneNumbers table
	userPhoneNumbers: many(userPhoneNumbersTable),

	// A user can have an userImage entry that can be its profile image
	profileImage: one(userImagesTable, {
		fields: [usersTable.profile_image_id],
		references: [userImagesTable.id],
	}),
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

	// A pet can have many entries in the pet_userPhoneNumbers table
	petContactNumbers: many(petUserPhoneNumbersTable),

	// A pet can have an entry that will be the mainContactPhoneNumber
	mainContactPhoneNumber: one(petUserPhoneNumbersTable, {
		fields: [petsTable.main_contact_phone_number_id],
		references: [petUserPhoneNumbersTable.id],
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

export const userPhoneNumbersRelations = relations(
	userPhoneNumbersTable,
	({ one, many }) => ({
		//An userPhoneNumber belongs to one user owner
		owner: one(usersTable, {
			fields: [userPhoneNumbersTable.user_id],
			references: [usersTable.id],
		}),

		// An userPhoneNumber can have many entries in the pet_userPhoneNumbers table
		associatedPetPhoneNumbers: many(petUserPhoneNumbersTable),
	}),
);

export const petUserPhoneNumbersRelations = relations(
	petUserPhoneNumbersTable,
	({ one, many }) => ({
		// a pet_userPhoneNumber belongs to only one userPhoneNumber entry
		userPhoneNumber: one(userPhoneNumbersTable, {
			fields: [petUserPhoneNumbersTable.user_phone_number_id],
			references: [userPhoneNumbersTable.id],
		}),

		// a pet_userPhoneNumber belongs to only one pet entry
		pet: one(petsTable, {
			fields: [petUserPhoneNumbersTable.pet_id],
			references: [petsTable.id],
		}),
	}),
);

export const userProfileImageRelation = foreignKey({
	columns: [usersTable.profile_image_id],
	foreignColumns: [userImagesTable.id],
	name: 'user_profile_image_fk',
});

export const petMainContactPhoneNumberRelation = foreignKey({
	columns: [petsTable.main_contact_phone_number_id],
	foreignColumns: [petUserPhoneNumbersTable.id],
	name: 'pet_main_contact_fk',
});
