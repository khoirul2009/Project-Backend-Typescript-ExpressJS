import { Request, Response } from "express";
const db = require('../db/models');
const { Op } = require('sequelize')

class CartServices {
    body: Request['body'];
    params: Request['params'];
    query: Request['query'];
    files: Request['files']
    protocol: Request['protocol']

    constructor(req: Request) {
        this.body = req.body;
        this.params = req.params;
        this.query = req.query;
        this.protocol = req.protocol;
    }
    public getCart = async () => {
        const result = await db.cart.findAll({
            where: { user_id: this.query.user_id },
            include: [
                { model: db.product, as: 'product' },
                { model: db.user, as: 'user' },
                { model: db.variant, as: 'variant' },
            ],
        })

        return result;
    }

    public storeCart = async () => {

        const { user_id, product_id, qty, variant_id, notes } = this.body;
        const product = await db.product.findOne({ where: { id: product_id } })
        if (!product) return Promise.reject('product not found');
        const total: number = parseInt(product.price) * parseInt(qty);

        const carts = await db.cart.findOne({
            where: {
                [Op.and]: [{
                    product_id: {
                        [Op.eq]: product_id
                    }
                }, {
                    variant_id: {
                        [Op.eq]: variant_id
                    }
                }],
            }
        })

        if (!carts) {
            await db.cart.create({ product_id, user_id, qty, total, variant_id, notes });
        } else {
            await db.cart.update({ notes: notes, total: carts.total + total }, { where: { id: carts.id } })
            await db.cart.increment('qty', { by: qty, where: { id: carts.id } })
        }

    }
    public select = async () => {
        const cart = await db.cart.findOne({ where: { id: this.params.id } })
        if (cart.selected == 0) {
            await db.cart.update({ selected: 1 }, { where: { id: this.params.id } })

            return "Cart selected"
        } else {
            await db.cart.update({ selected: 0 }, { where: { id: this.params.id } })

            return "Cart unselected"
        }
    }
    public delete = async () => {
        await db.cart.destroy({ where: { id: this.params.id } })
    }
    public increaseQty = async () => {

        await db.cart.increment('qty', { by: 1, where: { id: this.params.id } })

    }


}

export default CartServices;