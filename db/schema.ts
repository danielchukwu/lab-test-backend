import { integer, pgEnum, pgTable, serial, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

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
  first_name: varchar('first_name', {length: 100}),
  last_name: varchar('last_name', {length: 100}),
  date_of_birth: varchar('date_of_birth', {length: 100}),
  phone: varchar('phone', { length: 50 }),

  email: varchar('email', {length: 100}).unique().notNull(),
  password: varchar('password', {length: 256}).notNull(),
});
export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type