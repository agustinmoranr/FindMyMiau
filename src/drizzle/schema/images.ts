// import { relations, sql } from 'drizzle-orm';
// import { pgPolicy, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
// import { authenticatedRole } from 'drizzle-orm/supabase';
// import { createdAt, id } from '../schemaHelpers';
// import { petImagesTable } from './petImages';
// import { usersTable } from './users';

// export const imagesTable = pgTable(
// 	'images_table',
// 	{
// 		id,
// 		user_id: uuid('user_id')
// 			.notNull()
// 			.references(() => usersTable.id, { onDelete: 'cascade' }),
// 		url: text('url').notNull(),
// 		thumbnail_url: text('thumbnail_url'),
// 		alt_text: varchar('alt_text', { length: 255 }),
// 		content_type: varchar('content_type', { length: 50 }),
// 		created_at: createdAt,
// 	},
// 	(table) => [
// 		pgPolicy('users_can_crud_own_images', {
// 			as: 'permissive',
// 			to: authenticatedRole,
// 			for: 'all',
// 			using: sql`auth.uid() = ${table.user_id}`,
// 			withCheck: sql`auth.uid() = ${table.user_id}`,
// 		}),
// 	],
// );

// // Define relations for the Images table
// // export const imagesRelations = relations(imagesTable, ({ one }) => ({
// // 	petImage: one(petImagesTable, {
// // 		fields: [imagesTable.id],
// // 		references: [petImagesTable.image_id],
// // 	}),
// // }));
