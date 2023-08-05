import { Request, Response } from "express";
import path from "path";

import fs from "fs";
const category = require('../db/models/category')

const db = require('../db/models');

const { Op } = require('sequelize')


class ProductServices {
    body: Request['body'];
    params: Request['params'];
    query: Request['query'];
    files: Request['files']
    protocol: Request['protocol']



    constructor(req: Request) {
        this.body = req.body;
        this.params = req.params;
        this.query = req.query
        this.files = req.files
        this.protocol = req.protocol


    }


    getAllProduct = async () => {
        const page: any = this.query.page || 0;
        const limit: any = this.query.limit || 10;
        const search: any = this.query.search || "";
        const offset: number = parseInt(limit) * parseInt(page);



        const totalRows = await db.product.count({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    description: {
                        [Op.like]: '%' + search + '%'
                    }
                }],
            }
        })
        const totalPage = Math.ceil(totalRows / limit);


        const result = await db.product.findAll({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    description: {
                        [Op.like]: '%' + search + '%'
                    }
                }],

            },
            offset: offset,
            limit: parseInt(limit),
            order: [
                ['id', 'DESC']
            ],

        })


        // let products: any[] = await db.product.findAll();

        return {
            products: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        };
    }

    getProducts = async () => {
        const limit: any = this.query.limit || 10;
        const search: any = this.query.search || "";
        const last_id: any = this.query.last_id || 0;
        const category_id = this.query.category_id || '';

        let result = [];
        if (parseInt(last_id) < 1) {
            if (category_id != '') {
                const products = await db.product.findAll({
                    where: {
                        [Op.or]: [{
                            name: {
                                [Op.like]: '%' + search + '%'
                            }
                        }, {
                            description: {
                                [Op.like]: '%' + search + '%'
                            }
                        }],
                        [Op.and]: [{
                            category_id: {
                                [Op.eq]: this.query.category_id
                            }
                        }]
                    },
                    limit: parseInt(limit),
                    order: [
                        ['id', 'DESC']
                    ],
                })
                result = products;
            } else {

                const products = await db.product.findAll({
                    where: {
                        [Op.or]: [{
                            name: {
                                [Op.like]: '%' + search + '%'
                            }
                        }, {
                            description: {
                                [Op.like]: '%' + search + '%'
                            }
                        }],
                    },
                    limit: parseInt(limit),
                    order: [
                        ['id', 'DESC']
                    ],
                })
                result = products;
            }

        } else {
            if (category_id != '') {
                const products = await db.product.findAll({
                    where: {
                        id: {
                            [Op.lt]: parseInt(last_id)
                        },
                        [Op.or]: [{
                            name: {
                                [Op.like]: '%' + search + '%'
                            }
                        }, {
                            description: {
                                [Op.like]: '%' + search + '%'
                            }
                        }],
                        [Op.and]: [{
                            category_id: {
                                [Op.eq]: this.query.category_id
                            }
                        }]
                    },
                    limit: parseInt(limit),
                    order: [
                        ['id', 'DESC']
                    ],
                })
                result = products;
            } else {

                const products = await db.product.findAll({
                    where: {
                        id: {
                            [Op.lt]: parseInt(last_id)
                        },
                        [Op.or]: [{
                            name: {
                                [Op.like]: '%' + search + '%'
                            }
                        }, {
                            description: {
                                [Op.like]: '%' + search + '%'
                            }
                        }],
                    },
                    limit: parseInt(limit),
                    order: [
                        ['id', 'DESC']
                    ],
                })
                result = products;
            }
        }
        return {
            products: result,
            lastId: result.length ? result[result.length - 1].id : 0,
            hasMore: result.length >= parseInt(limit) ? true : false
        };

    }

    getProductById = async () => {
        let product = await db.product.findOne({ where: { id: this.params.id }, include: [{ model: db.category, as: 'category' }, { model: db.variant, as: 'variant' }] });

        return product;
    }
    storeProduct = async (req: Request, res: Response) => {
        const { name, description, price, stock, category_id } = this.body;

        const { image }: any = this.files;
        const fileSize = image.data.length;
        const ext = path.extname(image.name);
        const date = new Date();
        const fileName = image.md5 + `_${date.getSeconds()}` + ext;
        const url = `${this.protocol}://${req.get("host")}/images/${fileName}`;
        const allowedType = ['.png', '.jpeg', '.jpg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).send({ message: "Invalid file type" })

        if (fileSize > 5000000) return res.status(422).send({ message: "Image must be less than 5 mb" })

        image.mv(`./public/images/${fileName}`, async (err: any) => {

            if (err) return res.status(500).send({ message: err.message })
            try {
                const product = await db.product.create({ name, description, price, stock, category_id, image: fileName, url: url });

                return product;

            } catch (error) {
                return Promise.reject({ error: error });
            }
        })
    }

    deleteProduct = async (res: Response) => {
        let product = await db.product.findOne({ where: { id: this.params.id } })

        if (!product) return res.status(404).send({ message: 'No data found!' })

        try {
            const filePath = `./public/images/${product.image}`;
            fs.unlinkSync(filePath);

            await db.product.destroy({ where: { id: this.params.id } });

            const response = {
                message: 'Product deleted successfully'
            }

            return response
        } catch (error) {
            return Promise.reject({ error: error })
        }
    }
    updateProduct = async (req: Request, res: Response) => {

        const { name, description, price, stock, category_id } = this.body;
        let product = await db.product.findOne({ where: { id: this.params.id } })
        if (!product) return res.status(404).send({ message: 'No data found!' })

        if (req.files) {

            const { image }: any = this.files;
            const fileSize = image.data.length;
            const ext = path.extname(image.name);
            const date = new Date();
            const fileName = image.md5 + `_${date.getSeconds()}` + ext;
            const url = `${this.protocol}://${req.get("host")}/images/${fileName}`;
            const allowedType = ['.png', '.jpeg', '.jpg'];

            if (!allowedType.includes(ext.toLowerCase())) return res.status(422).send({ message: "Invalid file type" })

            if (fileSize > 5000000) return res.status(422).send({ message: "Image must be less than 5 mb" })

            const filePath = `./public/images/${product.image}`;
            fs.unlinkSync(filePath);

            image.mv(`./public/images/${fileName}`, async (err: any) => {

                if (err) return res.status(500).send({ message: err.message })
                try {
                    const product = await db.product.update({ name, description, price, stock, category_id, image: fileName, url: url }, { where: { id: this.params.id } });



                } catch (error) {

                    return Promise.reject({ error: error });
                }
            })

        } else {
            try {
                const product = await db.product.update({ name, description, price, stock, category_id }, { where: { id: this.params.id } });

            } catch (error) {
                return Promise.reject({ error: error });
            }
        }

    }
}

export default ProductServices;