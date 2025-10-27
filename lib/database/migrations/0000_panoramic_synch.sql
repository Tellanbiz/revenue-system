CREATE TYPE "public"."user_role" AS ENUM('admin', 'supervisor', 'collector', 'department_head');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."collection_status" AS ENUM('pending', 'completed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."collection_type" AS ENUM('revenue', 'permit', 'license', 'fee', 'fine');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'mobile_money', 'bank_transfer', 'card', 'check');--> statement-breakpoint
CREATE TYPE "public"."frequency" AS ENUM('one_time', 'monthly', 'quarterly', 'annually');--> statement-breakpoint
CREATE TYPE "public"."revenue_source_type" AS ENUM('market', 'permit', 'license', 'property', 'utility', 'fine', 'other');--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"phone_number" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'collector' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"employee_id" varchar(50),
	"department" varchar(255),
	"assembly_ward" varchar(255),
	"address" text,
	"emergency_contact" varchar(255),
	"emergency_phone" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"is_phone_verified" boolean DEFAULT false NOT NULL,
	"profile_picture_url" varchar(500),
	"notes" text,
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_number" varchar(50) NOT NULL,
	"collector_id" integer NOT NULL,
	"taxpayer_id" integer,
	"type" "collection_type" NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'GHS' NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"transaction_reference" varchar(255),
	"payment_date" timestamp NOT NULL,
	"status" "collection_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"revenue_source" varchar(255),
	"category" varchar(255),
	"subcategory" varchar(255),
	"assembly_ward" varchar(255),
	"location_details" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer,
	"approved_by" integer,
	"approved_at" timestamp,
	"reconciled" boolean DEFAULT false NOT NULL,
	"reconciled_at" timestamp,
	"reconciled_by" integer,
	CONSTRAINT "collections_collection_number_unique" UNIQUE("collection_number")
);
--> statement-breakpoint
CREATE TABLE "assemblies" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"district" varchar(255),
	"region" varchar(255),
	"population" integer,
	"area_sq_km" integer,
	"address" text,
	"phone" varchar(255),
	"email" varchar(255),
	"assembly_head_id" integer,
	"deputy_head_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"collection_target" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer,
	"description" text,
	"notes" text,
	CONSTRAINT "assemblies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "revenue_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "revenue_source_type" NOT NULL,
	"category" varchar(255),
	"subcategory" varchar(255),
	"standard_rate" numeric(15, 2),
	"minimum_amount" numeric(15, 2),
	"maximum_amount" numeric(15, 2),
	"currency" varchar(3) DEFAULT 'GHS' NOT NULL,
	"frequency" "frequency" DEFAULT 'one_time',
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"requirements" text,
	"applicable_to" varchar(255),
	"responsible_department" varchar(255),
	"applicable_assemblies" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer,
	"updated_by" integer,
	"notes" text,
	"effective_date" timestamp DEFAULT now() NOT NULL,
	"expiry_date" timestamp,
	CONSTRAINT "revenue_sources_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_collector_id_users_id_fk" FOREIGN KEY ("collector_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_reconciled_by_users_id_fk" FOREIGN KEY ("reconciled_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assemblies" ADD CONSTRAINT "assemblies_assembly_head_id_users_id_fk" FOREIGN KEY ("assembly_head_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assemblies" ADD CONSTRAINT "assemblies_deputy_head_id_users_id_fk" FOREIGN KEY ("deputy_head_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assemblies" ADD CONSTRAINT "assemblies_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_sources" ADD CONSTRAINT "revenue_sources_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_sources" ADD CONSTRAINT "revenue_sources_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;