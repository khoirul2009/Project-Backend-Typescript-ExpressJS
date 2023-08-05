import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
const db = require('../db/models');


class AuthController {
    register = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new AuthService(req);
            return service.register(res);
        } catch (error) {
            return res.status(500).send({ error });
        }

    }
    login = async (req: Request, res: Response): Promise<Response> => {

        try {
            const service = new AuthService(req);
            return service.login(res);
        } catch (error) {
            return res.status(500).send({ error });
        }

    }
    profile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new AuthService(req);
            const profile = await service.getProfile();

            return res.status(200).send({
                code: 200,
                data: profile
            });
        } catch (error) {
            return res.status(500).send(error)
        }

    }
    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        try {

            const service = new AuthService(req);
            return service.refreshToken(res);
        } catch (error) {
            return res.status(500).send({ error });
        }
    }
    logout = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new AuthService(req);
            return service.logout(res);
        } catch (error) {
            return res.status(500).send({ error });
        }
    }
}

export default new AuthController();