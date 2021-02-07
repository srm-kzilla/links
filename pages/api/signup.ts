// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { getDbClient } from "../../util/mongodb";
import { NextApiRequest, NextApiResponse } from "next"
import jwt from 'jsonwebtoken'
import { User } from '../../models/user-schema'
import * as bcrypt from 'bcrypt'
import { string } from 'yup/lib/locale';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log(req.body);
        let user: User = req.body;
        const dbClient: MongoClient = await getDbClient();
        let result = await dbClient.db('links').collection('user').findOne({ email: user.email })
        const saltRounds = 12;
        if (result) {
            return res.status(409).json({
                "msg": "User already exists"
            })
        }
        else {
            const salt = await bcrypt.genSalt(saltRounds)
            const hash = await bcrypt.hash(user.password, salt)
            user.password = hash;
            console.log(hash);
            console.log(user)
            await dbClient.db('links').collection('user').insertOne(user);
        }

        delete user['password'];
        console.log(user)
        const token = await jwt.sign(user, process.env.JWT_SECRET || '');
        res.json({ token });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            "message": "Internal Server Error",
            "err": err
        })
    }
}
