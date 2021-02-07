import { type } from 'os';
import * as yup from 'yup'

export const userSchema= yup.object(
    {
        name : yup.string(),
        email : yup.string().email().required(),
        password:  yup.string().required(),
        createdAt: yup.number().default(()=>{
            return +new Date();
        }),
        updatedAt: yup.number().default(()=>{
            return +new Date();
        })
    }
)

export type User =yup.InferType <typeof userSchema>