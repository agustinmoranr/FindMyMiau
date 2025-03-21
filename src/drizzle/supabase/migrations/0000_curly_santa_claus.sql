CREATE TABLE "users_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"password" text,
	"profile_image_url" text,
	"is_public" boolean DEFAULT true,
	"deletedAt" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email"),
	CONSTRAINT "users_table_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "users_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "owners_can_modify_data" ON "users_table" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "users_table"."id") WITH CHECK (auth.uid() = "users_table"."id");