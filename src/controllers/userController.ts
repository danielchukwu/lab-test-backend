import { Request, Response } from "express";
import db from "../../db";
import { eq } from "drizzle-orm";
import * as schema from '../../db/schema';

// get a user
export const user_get = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await db.query.users.findFirst({
      where: () => eq(schema.users.id, id)
    });
    if (!user) throw new Error('User not found');

    res.status(200).json(user);    
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

// get multiple users
export const users_get = async (req: Request, res: Response) => {
  const users = await db.query.users.findMany();
  res.status(200).json(users);
}

// update a user
export const user_put = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {avatar, full_name, street_address, city, state, country, allergies, height, weight, current_medications} = req.body;
  const body: Record<any, any> = {}

  // add fields that where updated to `body`
  if (avatar) body.avatar = avatar;
  if (full_name) body.full_name = full_name;
  if (street_address) body.street_address = street_address;
  if (city) body.city = city;
  if (state) body.state = state;
  if (country) body.country = country;
  if (allergies) body.allergies = allergies;
  if (height) body.height = height;
  if (weight) body.weight = weight;
  if (current_medications) body.current_medications = current_medications;
  
  // get values with content
  // const unfilteredData = [avatar, full_name, street_address, city, state, country, allergies, height, weight, current_medications];
  // const body = unfilteredData.filter(item => item !== undefined);
  // const filteredBody = new Map(body.map(item => [item, item]))
  // console.log('Filtered body:', filteredBody);
  
  const updatedUser = await db.update(schema.users).set(body).where(eq(schema.users.id, id)).returning();
  
  res.status(200).json(updatedUser);
}

// delete a user
export const user_delete = async (req: Request, res: Response) => {
  const id = req.params.id;
  await db.delete(schema.users).where(eq(schema.users.id, id))

  res.status(200).json({ msg: 'user deleted successfully!'});
}