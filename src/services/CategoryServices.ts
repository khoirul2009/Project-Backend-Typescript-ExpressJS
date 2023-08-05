import { Request, Response } from "express";
import path from "path";
import fs from "fs";
const db = require('../db/models');
const { Op } = require('sequelize')



class CategoryServices {
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
    getAllCategory = async () => {
        const page: any = this.query.page || 0;
        const limit: any = this.query.limit || 10;
        const search: any = this.query.search || "";
        const offset: number = parseInt(limit) * parseInt(page);

        let totalRows = await db.category.count({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }]
            }
        });

        const totalPage = Math.ceil(totalRows / limit);
        let category = await db.category.findAll({
            where: {
                [Op.or]: [{
                    name: {
                        [Op.like]: '%' + search + '%'
                    }
                }]
            },
            offset: offset,
            limit: parseInt(limit),
            order: [
                ['id', 'DESC']
            ],
        });


        return {
            categories: category,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        };
    }
    getCategoryById = async () => {
        let category = await db.category.findOne({ where: { id: this.params.id } });

        return category;
    }

    storeCategory = async (req: Request, res: Response) => {
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
                const category = await db.category.create({ name: this.body.name, image: fileName, url: url });

                return category;

            } catch (error) {
                return Promise.reject({ error: error });
            }
        })
    }
    updateCategory = async (req: Request, res: Response) => {

        const { name } = this.body;
        let category = await db.category.findOne({ where: { id: this.params.id } })
        if (!category) return res.status(404).send({ message: 'No data found!' })

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

            const filePath = `./public/images/${category.image}`;
            fs.unlinkSync(filePath);

            image.mv(`./public/images/${fileName}`, async (err: any) => {

                if (err) return res.status(500).send({ message: err.message })
                try {
                    const category = await db.category.update({ name, image: fileName, url: url }, { where: { id: this.params.id } });

                } catch (error) {

                    return Promise.reject({ error: error });
                }
            })

        } else {
            try {
                const product = await db.category.update({ name }, { where: { id: this.params.id } });

            } catch (error) {
                return Promise.reject({ error: error });
            }
        }

    }
    deleteCategory = async (res: Response) => {
        let category = await db.category.findOne({ where: { id: this.params.id } })

        if (!category) return res.status(404).send({ message: 'No data found!' })

        try {
            const filePath = `./public/images/${category.image}`;
            fs.unlinkSync(filePath);

            await db.category.destroy({ where: { id: this.params.id } });

            const response = {
                message: 'Product deleted successfully'
            }

            return response
        } catch (error) {
            return Promise.reject({ error: error })
        }
    }
}

export default CategoryServices;