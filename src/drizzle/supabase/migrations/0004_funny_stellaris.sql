ALTER TABLE "user_images" RENAME TO "user_images_table";--> statement-breakpoint
ALTER TABLE "user_images_table" DROP CONSTRAINT "user_images_user_id_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "user_images_table" ADD CONSTRAINT "user_images_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER POLICY "owners_can_view_their_images" ON "user_images_table" TO authenticated USING (auth.uid() = "user_images_table"."user_id");--> statement-breakpoint
ALTER POLICY "anyone_can_view_public_images" ON "user_images_table" TO public USING ("user_images_table"."is_public" = true);--> statement-breakpoint
ALTER POLICY "owners_can_access_their_user_images" ON "user_images_table" TO authenticated USING (auth.uid() = "user_images_table"."user_id") WITH CHECK (auth.uid() = "user_images_table"."user_id");