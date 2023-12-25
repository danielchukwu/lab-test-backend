import { date, integer, pgEnum, pgTable, real, serial, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import db from '.';

// declaring enum in database
// export const popularityEnum = pgEnum('popularity', ['unknown', 'known', 'popular']);

// export const countries = pgTable('countries', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }),
// }, (countries) => {
//   return {
//     nameIndex: uniqueIndex('name_idx').on(countries.name),
//   }
// });

// export const cities = pgTable('cities', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }),
//   countryId: integer('country_id').references(() => countries.id),
//   popularity: popularityEnum('popularity'),
// });

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  avatar: varchar('avatar', {length: 255}),
  full_name: varchar('first_name', {length: 30}).notNull(),
  email: varchar('email', {length: 50}).unique().notNull(),
  gender_id: uuid('gender').notNull().references(() => gender.id),
  password: varchar('password', {length: 256}).notNull(),
  phone_number: varchar('phone_number', { length: 50 }).notNull(),
  date_of_birth: varchar('date_of_birth').notNull(),
  
  // address information
  street_address: varchar('street_address', { length: 200 }),
  city: varchar('city', { length: 50 }),
  state: varchar('state', { length: 50 }),
  country: varchar('country', { length: 50 }),
  
  // medical information
  allergies: varchar('allergies', { length: 50 }),
  height: real('height'),
  weight: real('weight'),
  current_medications: varchar('current_medications', { length: 50 }),
  
});

export const gender = pgTable('gender', {
  id: uuid('id').primaryKey().defaultRandom(),
  value: varchar('gender', { length: 10, enum: ['male', 'female'] }).unique(),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
