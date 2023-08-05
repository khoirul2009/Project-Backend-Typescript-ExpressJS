import bcrypt from "bcrypt";
import user from "../db/models/user";
import jwt from "jsonwebtoken";

class Authentication {
    public static hash = (password: string) => {
        return bcrypt.hash(password, 10);
    }

    public static verify = async (password: string, encrypted: string): Promise<boolean> => {
        return await bcrypt.compare(password, encrypted);
    }

    public static generateToken = (id: number, username: string, email: string): string => {
        const secretKey: string = process.env.ACCESS_TOKEN_SECRET || "secret";

        const token: string = jwt.sign({ id, username, email }, secretKey, {
            expiresIn: '20s'
        });

        return token;
    }
    public static generateRefreshToken = (id: number, username: string, email: string): string => {
        const secretKey: string = process.env.REFRESH_TOKEN_SECRET || "secret";

        const token: string = jwt.sign({ id, username, email }, secretKey, {
            expiresIn: '1d'
        });

        return token;
    }
    public static decodeToken = (token: string): any => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret", (err, decoded: any) => {
            return decoded;
        })
    }


}

export default Authentication;