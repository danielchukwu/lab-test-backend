CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"avatar" varchar(255),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"date_of_birth" varchar(100),
	"phone" varchar(50),
	"email" varchar(50)
);
