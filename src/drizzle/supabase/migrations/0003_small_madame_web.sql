CREATE TABLE "user_phone_numbers_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"phone_number" text NOT NULL,
	"label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_phone_numbers_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pet_user_phone_numbers_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_id" uuid NOT NULL,
	"user_phone_number_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pet_user_phone_numbers_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pet_contact_numbers_table" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "users_can_view_contact_numbers" ON "pet_contact_numbers_table" CASCADE;--> statement-breakpoint
DROP POLICY "owners_can_modify_contact_numbers" ON "pet_contact_numbers_table" CASCADE;--> statement-breakpoint
DROP TABLE "pet_contact_numbers_table" CASCADE;--> statement-breakpoint
ALTER TABLE "pets_table" RENAME COLUMN "main_contact_number_id" TO "main_contact_phone_number_id";--> statement-breakpoint
ALTER TABLE "pets_table" DROP CONSTRAINT "pets_table_user_id_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "user_phone_numbers_table" ADD CONSTRAINT "user_phone_numbers_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_user_phone_numbers_table" ADD CONSTRAINT "pet_user_phone_numbers_table_pet_id_pets_table_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_user_phone_numbers_table" ADD CONSTRAINT "pet_user_phone_numbers_table_user_phone_number_id_user_phone_numbers_table_id_fk" FOREIGN KEY ("user_phone_number_id") REFERENCES "public"."user_phone_numbers_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "users_can_view_contact_numbers" ON "user_phone_numbers_table" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "owners_can_modify_contact_numbers" ON "user_phone_numbers_table" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "user_phone_numbers_table"."user_id") WITH CHECK (auth.uid() = "user_phone_numbers_table"."user_id");--> statement-breakpoint
CREATE POLICY "users_can_view_pet_contact_numbers" ON "pet_user_phone_numbers_table" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "owners_can_modify_pet_contact_numbers" ON "pet_user_phone_numbers_table" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM "pets_table" 
        WHERE "pets_table"."id" = "pet_user_phone_numbers_table"."pet_id" 
        AND "pets_table"."user_id" = auth.uid()
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM "pets_table" 
        WHERE "pets_table"."id" = "pet_user_phone_numbers_table"."pet_id" 
        AND "pets_table"."user_id" = auth.uid()
      ));