import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): any => {


    let secretKey = process.env.ACCESS_TOKEN_SECRET || "secret";
    const authHeader = req.headers.authorization;
    let token: string = authHeader && authHeader.split(" ")[1] || "";
    try {
        if (token == null) return res.status(401).send();
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {

                return res.status(403).send({
                    code: 403,
                    message: "Forbidden"
                });
            }

            return next();
        });
    } catch (error) {

        res.status(500).send({ error });
    }


}