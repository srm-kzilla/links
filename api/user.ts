import { NextApiRequest, NextApiResponse } from "next"
import jwt from 'jsonwebtoken'
import * as nextConnect from "next-connect"

export default nextConnect <NextApiRequest, NextApiResponse > ({
   onError(req : NextApiRequest, res : NextApiResponse, token){
     res.status(200).json({"msg": "User authenticated"})
})
