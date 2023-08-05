import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
const db = require('../db/models');

const create = [
    check('name')
        .notEmpty().withMessage("The name field cannot be empty"),
    check('username')
        .notEmpty().withMessage("The username field cannot be empty")
        .isLength({ min: 6 }).withMessage("Username must be at least 6 chars long"),
    check('password')
        .notEmpty().withMessage("The password field cannot be empty")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 chars long"),
    check('email')
        .notEmpty().withMessage("The password field cannot be empty")
        .isEmail().withMessage("Email must be valid"),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            return res.status(422).send({ code: 422, errors: errors.array() })
        }

        const user = await db.user.findOne({
            where: { username: req.body.username }
        });

        if (user) {
            return res.status(422).send({ code: 422, message: 'Username is already created' })
        }
        return next();
    }
];

const update = [
    check('name')
        .notEmpty().withMessage("The name field cannot be empty"),
    check('username')
        .notEmpty().withMessage("The username field cannot be empty")
        .isLength({ min: 6 }).withMessage("Username must be at least 6 chars long"),
    check('email')
        .notEmpty().withMessage("The password field cannot be empty")
        .isEmail().withMessage("Email must be valid"),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            return res.status(422).send({ code: 422, errors: errors.array() })
        }

        return next();
    }
];


export { create, update };