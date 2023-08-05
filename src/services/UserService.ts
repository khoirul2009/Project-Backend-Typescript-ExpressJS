import { Request } from "express";
import Authentication from "../core/Authentication";
const db = require('../db/models');
const { Op } = require('sequelize')

class UserService {

    body: Request['body'];
    params: Request['params'];
    query: Request['query'];

    constructor(req: Request) {
        this.body = req.body;
        this.params = req.params;
        this.query = req.query;

    }



    getAll = async () => {
        const page: any = this.query.page || 0;
        const limit: any = this.query.limit || 10;
        const search: any = this.query.search || "";
        const offset: number = parseInt(limit) * parseInt(page);

        const totalRows = await db.user.count({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    email: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    username: {
                        [Op.like]: '%' + search + '%'
                    }
                }
                ],
            }
        })
        const totalPage = Math.ceil(totalRows / limit);


        const result = await db.user.findAll({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    email: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    username: {
                        [Op.like]: '%' + search + '%'
                    }
                }
                ],

            },
            offset: offset,
            limit: parseInt(limit),
            order: [
                ['id', 'DESC']
            ],

        })


        return {
            users: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        };



    }
    store = async () => {
        const { name, username, email, password } = this.body;
        const hashedPassword = await Authentication.hash(password);

        const user = await db.user.create({
            name,
            username,
            email,
            password: hashedPassword
        });
        return user;
    }
    getOne = async () => {
        const { id } = this.params

        let user = await db.user.findOne({ where: { id }, attributes: ['id', 'name', 'username', 'email', 'role'] });

        return user;
    }

    update = async () => {
        const { id } = this.params;

        const { name, username, email, password } = this.body;

        if (password !== "") {
            const hashedPassword = await Authentication.hash(password)
            const user = await db.user.update({ name, username, email, password: hashedPassword }, { where: { id } });
            return user;
        } else {
            const user = await db.user.update({ name, username, email }, { where: { id } });
            return user;
        }
    }
    delete = async () => {
        const { id } = this.params;

        const user = await db.user.destroy({
            where: { id }
        });

        return user;

    }
}

export default UserService;