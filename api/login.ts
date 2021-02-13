// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { getDbClient } from "../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next"
import jwt from 'jsonwebtoken'
import { User } from '../models/user-schema'
import * as bcrypt from 'bcrypt'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        let user: User = req.body;
        const dbClient: MongoClient = await getDbClient();
        let result = await dbClient.db('links').collection('user').findOne({ email: user.email })

        if (!result) {
            return res.status(401).json({ "msg": "User not found" })
        }

        const isAuthorised = await bcrypt.compare(user.password, result['password'])
        
        if (isAuthorised) {
            delete result['password'];
            const token = jwt.sign({ result }, process.env.JWT_SECRET || '');
            return res.status(200).json({ token, "msg": "User authorised" });
        }
        else {
            return res.status(401).json({"msg": "Invalid password!"})
        }

    } catch (err) {
        res.status(500).send({
            "msg": "Internal Server Error",
            "err": err
        })
    }
}