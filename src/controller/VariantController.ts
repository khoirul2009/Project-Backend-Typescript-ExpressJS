import IController from "./ControllerInterface";
import { Request, Response } from "express";
import VariantServices from "../services/VariantServices";

class VariantController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {

        try {
            const services = new VariantServices(req);
            const variant = await services.getVariant();

            return res.status(200).send({
                status: 'success',
                variant: variant
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error })
        }
    }
    create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = new VariantServices(req);
            const variant = await services.storeVariant(req, res);

            return res.status(200).send({
                status: 'success',
                message: 'Variant has been added'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error })
        }
    }
    update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = new VariantServices(req);
            const variant = await services.updateVariant(req, res);

            return res.status(200).send({
                status: 'success',
                message: 'Variant has been updated'
            })
        } catch (error) {
            return res.status(500).send({ error })
        }
    }
    show = async (req: Request, res: Response): Promise<Response> => {
        throw new Error("Method not implemented.");
    }
    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = new VariantServices(req);
            const variant = await services.deleteVariant(req, res);

            return res.status(200).send({
                status: 'success',
                message: 'Variant has been deleted'
            })
        } catch (error) {
            return res.status(500).send({ error })
        }
    }

}

export default new VariantController();