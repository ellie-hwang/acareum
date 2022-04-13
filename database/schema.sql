set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."tanks" (
	"tankId" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"imageId" integer NOT NULL,
	"size" int NOT NULL,
	CONSTRAINT "tanks_pk" PRIMARY KEY ("tankId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."inhabitants" (
	"inhabitantId" serial NOT NULL,
	"tankId" integer NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"status" TEXT NOT NULL,
	"dateAdded" timestamp with time zone NOT NULL,
	"imageId" integer NOT NULL,
	CONSTRAINT "inhabitants_pk" PRIMARY KEY ("inhabitantId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."conditions" (
	"conditionsId" serial NOT NULL,
	"tankId" integer NOT NULL,
	"pH" serial NOT NULL,
	"temperature" integer NOT NULL,
	"ammonia" DECIMAL NOT NULL,
	"nitrite" DECIMAL NOT NULL,
	"nitrate" DECIMAL NOT NULL,
	"dateLogged" timestamp with time zone NOT NULL,
	CONSTRAINT "conditions_pk" PRIMARY KEY ("conditionsId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."images" (
	"imageId" serial NOT NULL,
	"imageUrl" TEXT NOT NULL,
	CONSTRAINT "images_pk" PRIMARY KEY ("imageId")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "tanks" ADD CONSTRAINT "tanks_fk0" FOREIGN KEY ("imageId") REFERENCES "images"("imageId");

ALTER TABLE "inhabitants" ADD CONSTRAINT "inhabitants_fk0" FOREIGN KEY ("tankId") REFERENCES "tanks"("tankId");
ALTER TABLE "inhabitants" ADD CONSTRAINT "inhabitants_fk1" FOREIGN KEY ("imageId") REFERENCES "images"("imageId");

ALTER TABLE "conditions" ADD CONSTRAINT "conditions_fk0" FOREIGN KEY ("tankId") REFERENCES "tanks"("tankId");
