CREATE TYPE "public"."birthdate_accuracy" AS ENUM('exact', 'month_year', 'year_only', 'estimated');--> statement-breakpoint
CREATE TYPE "public"."genders" AS ENUM('macho', 'hembra');--> statement-breakpoint
CREATE TYPE "public"."pet_species" AS ENUM('gato', 'perro', 'ave', 'otro');--> statement-breakpoint
CREATE TABLE "user_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"is_public" boolean DEFAULT false,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" varchar(255),
	"content_type" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pet_contact_numbers_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"phone_number" text NOT NULL,
	"label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pet_contact_numbers_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pets_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"species" "pet_species" NOT NULL,
	"race" varchar(50),
	"birthdate" date,
	"birthdate_accuracy" "birthdate_accuracy",
	"gender" "genders",
	"description" text,
	"main_contact_number_id" uuid NOT NULL,
	"qr_url" text NOT NULL,
	"extra_fields" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pets_table_qr_url_unique" UNIQUE("qr_url")
);
--> statement-breakpoint
ALTER TABLE "pets_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pet_images_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" varchar(255),
	"content_type" varchar(50),
	"display_order" integer,
	"is_profile" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pet_images_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_images" ADD CONSTRAINT "user_images_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_contact_numbers_table" ADD CONSTRAINT "pet_contact_numbers_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets_table" ADD CONSTRAINT "pets_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets_table" ADD CONSTRAINT "pets_table_main_contact_number_id_pet_contact_numbers_table_id_fk" FOREIGN KEY ("main_contact_number_id") REFERENCES "public"."pet_contact_numbers_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_images_table" ADD CONSTRAINT "pet_images_table_pet_id_pets_table_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_images_table" ADD CONSTRAINT "pet_images_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "owners_can_view_their_images" ON "user_images" AS PERMISSIVE FOR SELECT TO "authenticated" USING (auth.uid() = "user_images"."user_id");--> statement-breakpoint
CREATE POLICY "anyone_can_view_public_images" ON "user_images" AS PERMISSIVE FOR SELECT TO public USING ("user_images"."is_public" = true);--> statement-breakpoint
CREATE POLICY "owners_can_access_their_user_images" ON "user_images" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "user_images"."user_id") WITH CHECK (auth.uid() = "user_images"."user_id");--> statement-breakpoint
CREATE POLICY "users_can_view_contact_numbers" ON "pet_contact_numbers_table" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "owners_can_modify_contact_numbers" ON "pet_contact_numbers_table" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "pet_contact_numbers_table"."user_id") WITH CHECK (auth.uid() = "pet_contact_numbers_table"."user_id");--> statement-breakpoint
CREATE POLICY "users_can_view_pets" ON "pets_table" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "owners_can_modify_pets" ON "pets_table" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "pets_table"."user_id") WITH CHECK (auth.uid() = "pets_table"."user_id");--> statement-breakpoint
CREATE POLICY "anyone_can_view_pet_images" ON "pet_images_table" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "pet_owners_can_modify_pet_images" ON "pet_images_table" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "pet_images_table"."user_id") WITH CHECK (auth.uid() = "pet_images_table"."user_id");