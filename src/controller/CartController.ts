import CartServices from "../services/CartServices";
import IController from "./ControllerInterface";
import { Request, Response } from "express";


class CartController implements IController {
    public index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = new CartServices(req);
            const carts = await services.getCart();

            return res.status(200).send({
                status: 'success',
                carts
            })
        } catch (error) {

            return res.status(500).send({ error })
        }


    }
    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = new CartServices(req);
            const carts = await services.storeCart();

            return res.status(200).send({
                status: 'success',
                message: 'Product added to cart'
            });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error });
        }
    }
    public update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = new CartServices(req);
            await services.increaseQty();

            return res.status(200).send({
                status: 'success',
                message: 'Quantity +1'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error });
        }
    }
    public select = async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = new CartServices(req);
            const result = await services.select();

            return res.status(200).send({
                status: 'success',
                message: result
            })
        } catch (error) {
            return res.status(500).send({ error })
        }
    }
    public show(req: Request, res: Response): Response | Promise<Response> {
        throw new Error("Method not implemented.");
    }
    public delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const services = new CartServices(req);
            const carts = await services.delete();

            return res.status(200).send({
                status: 'success',
                message: 'Cart deleted successfully'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ error })
        }
    }

}

export default new CartController()