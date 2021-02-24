import { type } from 'os';
import * as yup from 'yup'

export const userSchema= yup.object(
    {
        name : yup.string().trim().min(1, "name cannot be null"),
        email : yup.string().trim().min(1, "email cannot be null").email().required(),
        password:  yup.string().trim().min(8, "password should have at least 8 characters").required(),
        createdAt: yup.number().default(()=>{
            return +new Date();
        }),
        updatedAt: yup.number().default(()=>{
            return +new Date();
        })
    }
)

export type User =yup.InferType <typeof userSchema>