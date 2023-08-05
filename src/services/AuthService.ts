import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Authentication from "../core/Authentication";
const db = require('../db/models');

class AuthService {
    body: Request['body'];
    params: Request['params'];
    cookies: Request['cookies'];

    constructor(req: Request) {
        this.body = req.body;
        this.params = req.params;
        this.cookies = req.cookies;

    }

    register = async (res: Response) => {
        // memgambil attribute pada body request
        const { name, username, email, password } = this.body;

        // mengenkripsi password
        const hashedPassword = await Authentication.hash(password);

        // menginsert data ke database
        const user = await db.user.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        // mengembalikan status ok ke client
        return res.status(200).send({
            code: 200,
            message: 'User created'
        });

    }

    login = async (res: Response) => {
        // mengambil attribute pada request body
        let { username, password } = this.body;

        // cari data user by username
        const user = await db.user.findOne({
            where: { username }
        });

        // jika user tidak ada maka direturn 403
        if (!user) {
            return res.status(403).send({ code: 403, message: 'Credentials dot not match' })
        }

        // check password
        let compare = await Authentication.verify(password, user.password);

        // jika password tidak cocok maka akan dikembalikan dengan code 403
        if (!compare) {
            return res.status(403).send({ code: 403, message: 'Credentials do not match' })
        }

        // generate json web token
        let token = Authentication.generateToken(user.id, user.username, user.email);

        // generate refresh token
        let refreshToken = Authentication.generateRefreshToken(user.id, user.username, user.email);

        // update refresh token kedalam database
        await db.user.update({ refresh_token: refreshToken }, { where: { id: user.id } });

        // mengembalikan response ok ke client
        return res
            .cookie('X-SESSION', refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
            .status(200)
            .send({
                code: 200,
                message: 'Logged In',
                token: token
            });
    }
    refreshToken = async (res: Response) => {

        //mengambil refresh token dari request
        const refreshToken = this.cookies['X-SESSION'];

        // jika tidak ada refresh token maka dikembalikan dengan kode 401
        if (!refreshToken) return res.status(401).send();

        // mengambil user dengan refreshtoken yang sama
        const user = await db.user.findAll({ where: { refresh_token: refreshToken } });

        // jika tidak ada user yang cocok maka dikembalikan dengan kode 403
        if (!user[0]) return res.status(403).send();

        // mengambil secret key pada env
        let secret = process.env.REFRESH_TOKEN_SECRET || "secret";

        // memverifikasi dam mengenerate access token baru dan dikembalikan ke clinet
        jwt.verify(refreshToken, secret, (err: any, decode: any) => {
            if (err) return res.status(403);

            const token = Authentication.generateToken(user[0].id, user[0].username, user[0].email);

            return res.send({ token });

        });

        // mengembalikan error dengan kode 400
        return res.status(400).send();
    }
    logout = async (res: Response) => {
        // mengambil refresh token dari cookie
        const refreshToken = this.cookies['X-SESSION'];

        // jika refreshtoken tidak ada maka akan dikirimkan status 204 
        if (!refreshToken) return res.status(204).send();

        // mencari user dengen refresh token yang cocok
        const user = await db.user.findOne({ where: { refresh_token: refreshToken } });

        // mengupdate refresh token menjadi null
        await db.user.update({ refresh_token: null }, { where: { id: user.id } })

        // menghapus cookie pada client
        res.clearCookie('X-SESSION');

        // mengirimkan status ok
        return res.status(200).send();
    }
    getProfile = async () => {
        const { username } = this.params;

        const user = await db.user.findOne({ where: { username: username }, attributes: ['id', 'name', 'username', 'email', 'role'] },)

        return user;
    }

}

export default AuthService;