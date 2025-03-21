CREATE TYPE "public"."birthdate_accuracy" AS ENUM('exact', 'month_year', 'year_only', 'estimated');--> statement-breakpoint
CREATE TYPE "public"."genders" AS ENUM('macho', 'hembra');--> statement-breakpoint
CREATE TYPE "public"."pet_species" AS ENUM('gato', 'perro', 'ave', 'otro');--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"password" text,
	"profile_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email"),
	CONSTRAINT "users_table_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "pet_contact_numbers_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_id" uuid NOT NULL,
	"phone_number" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_images_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_id" uuid NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" varchar(255),
	"display_order" integer,
	"content_type" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
	"profile_image_id" uuid,
	"qr_url" text NOT NULL,
	"extra_fields" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pets_table_qr_url_unique" UNIQUE("qr_url")
);
--> statement-breakpoint
ALTER TABLE "pets_table" ADD CONSTRAINT "pets_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets_table" ADD CONSTRAINT "pets_table_main_contact_number_id_pet_contact_numbers_table_id_fk" FOREIGN KEY ("main_contact_number_id") REFERENCES "public"."pet_contact_numbers_table"("id") ON DELETE no action ON UPDATE no action;