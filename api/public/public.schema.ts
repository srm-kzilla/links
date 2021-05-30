import * as yup from "yup";
import { ObjectID } from "mongodb";
export const subscribeSchema = yup.object({
  email: yup.string().trim().email().required(),
});

export type SubscribeType = yup.InferType<typeof subscribeSchema>;
export interface subscribeDBSchema extends SubscribeType {
  _id?: ObjectID;
}
