import { Request, Response, NextFunction } from "express";
import { check, validationResult, body } from "express-validator";
const db = require('../db/models');

const create = [
    body('name')
        .notEmpty().withMessage('The name field cannot be empty'),
    body('extra')
        .notEmpty().withMessage('The extra price field cannot be empty'),
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
    body('name')
        .notEmpty().withMessage('The name field cannot be empty'),
    body('extra')
        .notEmpty().withMessage('The extra price field cannot be empty'),
    body('stock')
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