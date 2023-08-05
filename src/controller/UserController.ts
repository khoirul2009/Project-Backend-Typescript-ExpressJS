import { Request, Response } from "express";
import IController from "./ControllerInterface";
import UserService from "../services/UserService"


class UserController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        try {

            const service: UserService = new UserService(req);
            const result = await service.getAll();

            return res.status(200).send(result);
        } catch (error) {
            return res.status(500).send({
                code: 500,
                message: "Server error",
                error: error

            });
        }

    }
    create = async (req: Request, res: Response): Promise<Response> => {

        try {
            const service: UserService = new UserService(req);
            const user = await service.store();

            return res.status(201).send({
                code: 200,
                message: "User created successfully",
                data: user
            });

        } catch (error) {

            return res.status(500).send({
                code: 500,
                message: "Server error",
                error: error
            });
        }

    }
    show = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: UserService = new UserService(req);
            const user = await service.getOne();

            return res.status(200).send({
                code: 200,
                data: user
            });
        } catch (error) {
            return res.status(500).send({
                code: 500,
                message: "Server error",
                error: error
            });
        }

    }
    update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: UserService = new UserService(req);
            const user = await service.update();

            return res.status(200).send({
                code: 200,
                data: user,
                message: 'User edited successfully'
            });
        } catch (error) {
            return res.status(500).send({
                code: 500,
                message: "Server error",
                error: error
            });
        }


    }
    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service: UserService = new UserService(req);
            const user = await service.delete();

            return res.status(200).send({
                code: 200,
                data: user,
                message: "User deleted successfully"
            });

        } catch (error) {

            return res.status(500).send({
                code: 500,
                message: "Server error",
                error: error
            });
        }



    }

}

export default new UserController();