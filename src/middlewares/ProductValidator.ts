import { Request, Response, NextFunction } from "express";
import { check, validationResult, body } from "express-validator";
const db = require('../db/models');

const create = [
    body('name')
        .notEmpty().withMessage('The name field cannot be empty'),
    body('description')
        .notEmpty().withMessage('The description field cannot be empty'),
    body('price')
        .notEmpty().withMessage('The price field cannot be empty'),
    body('category_id')
        .notEmpty().withMessage('The category field cannot be empty'),
    body('stock')
        .notEmpty().withMessage('The stock field cannot be empty'),

    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            return res.status(422).send({ code: 422, errors: errors.array() })
        }
        if (req.files === null) return res.status(422).send({ code: 422, errors: [{ msg: "Please upload the image", param: "image" }] })



        return next();
    }

]
const update = [
    check('name')
        .notEmpty().withMessage('The name field cannot be empty'),
    check('description')
        .notEmpty().withMessage('The description field cannot be empty'),
    check('price')
        .notEmpty().withMessage('The price field cannot be empty'),
    check('category_id')
        .notEmpty().withMessage('The category field cannot be empty'),
    check('stock')
        .notEmpty().withMessage('The stock field cannot be empty'),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).send({ code: 422, errors: errors.array() })
        }


        return next();
    }

]

export { create, update }