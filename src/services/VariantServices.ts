import { Request, Response } from "express";
import Authentication from "../core/Authentication";
import path from "path";

import fs from "fs";
const db = require('../db/models');

const { Op } = require('sequelize')
class VariantServices {
    body: Request['body'];
    params: Request['params'];
    query: Request['query'];
    files: Request['files']
    protocol: Request['protocol']

    constructor(req: Request) {
        this.body = req.body;
        this.params = req.params;
        this.query = req.query;
        this.files = req.files;
        this.protocol = req.protocol;
    }

    getVariant = async () => {

        let variant = await db.variant.findAll({ where: { product_id: this.query.product_id } })

        return variant;
    }

    storeVariant = async (req: Request, res: Response) => {

        const { img }: any = this.files;
        const fileSize = img.data.length;
        const ext = path.extname(img.name);
        const date = new Date();
        const fileName = img.md5 + `_${date.getSeconds()}` + ext;
        const url = `${this.protocol}://${req.get("host")}/images/${fileName}`;
        const allowedType = ['.png', '.jpeg', '.jpg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).send({ message: "Invalid file type" })

        if (fileSize > 5000000) return res.status(422).send({ message: "Image must be less than 5 mb" })

        const product = await db.product.findOne({ where: { id: this.query.product_id } })

        if (!product) return res.status(404).send({ message: 'Data not found' });

        img.mv(`./public/images/${fileName}`, async (err: any) => {

            if (err) return res.status(500).send({ message: err.message })
            try {
                const variant = await db.variant.create({ name: this.body.name, img: fileName, url: url, product_id: this.query.product_id, stock: this.body.stock, extra: this.body.extra });

                return variant;

            } catch (error) {
                return Promise.reject({ error: error });
            }
        })
    }
    deleteVariant = async (req: Request, res: Response) => {
        let variant = await db.variant.findOne({ where: { id: this.params.id } })

        if (!variant) return res.status(404).send({ message: 'No data found!' })

        try {
            const filePath = `./public/images/${variant.img}`;
            fs.unlinkSync(filePath);

            await db.variant.destroy({ where: { id: this.params.id } });

            const response = {
                message: 'variant deleted successfully'
            }

            return response
        } catch (error) {
            return Promise.reject({ error: error })
        }
    }
    updateVariant = async (req: Request, res: Response) => {
        let variant = await db.variant.findOne({ where: { id: this.params.id } })
        if (!variant) return res.status(404).send({ message: 'No data found!' })

        if (req.files) {

            const { img }: any = this.files;
            const fileSize = img.data.length;
            const ext = path.extname(img.name);
            const date = new Date();
            const fileName = img.md5 + `_${date.getSeconds()}` + ext;
            const url = `${this.protocol}://${req.get("host")}/images/${fileName}`;
            const allowedType = ['.png', '.jpeg', '.jpg'];

            if (!allowedType.includes(ext.toLowerCase())) return res.status(422).send({ message: "Invalid file type" })

            if (fileSize > 5000000) return res.status(422).send({ message: "Image must be less than 5 mb" })

            const filePath = `./public/images/${variant.img}`;
            fs.unlinkSync(filePath);

            img.mv(`./public/images/${fileName}`, async (err: any) => {

                if (err) return res.status(500).send({ message: err.message })
                try {
                    const variant = await db.variant.update({ name: this.body.name, img: fileName, url: url, product_id: this.body.product_id }, { where: { id: this.params.id } });

                } catch (error) {

                    return Promise.reject({ error: error });
                }
            })
        } else {
            try {
                const product = await db.product.update({ name, product_id: this.body.product_id }, { where: { id: this.params.id } });

            } catch (error) {
                return Promise.reject({ error: error });
            }
        }
    }


}
export default VariantServices;
