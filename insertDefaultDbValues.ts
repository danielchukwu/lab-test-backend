import db from "./db";
import { gender } from "./db/schema";

(async () => {
  console.log('inserting default genders ... 🚀')
  const genders = await db.query.gender.findMany();

  if (genders.length != 2) {
    await db.insert(gender).values([{ value: 'male' }, { value: 'female' }]);
  }
  console.log('insertion complete ✅ 😁');
})();