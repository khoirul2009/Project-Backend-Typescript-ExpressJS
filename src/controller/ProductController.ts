import { Request, Response } from "express";
import IController from "./ControllerInterface";
import ProductService from "../services/ProductServices"

class ProductController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new ProductService(req);

            const products = await service.getAllProduct();
            return res.status(200).send(products)

        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: error })
        }

    }
    browseProducts = async (req: Request, res: Response) => {
        try {
            const service = new ProductService(req);

            const products = await service.getProducts();
            return res.status(200).send(products)

        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: error })
        }
    }

    create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new ProductService(req);
            const product = await service.storeProduct(req, res);

            return res.status(200).send({
                code: 200,
                message: 'Product created successfully',
                data: product
            })
        } catch (error) {
            return res.status(500).send({ message: error })
        }
    }
    update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new ProductService(req);
            const product = await service.updateProduct(req, res);

            return res.status(200).send({ message: 'Product updated successfully' })
        } catch (error) {

            return res.status(500).send({ error })
        }
    }
    show = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new ProductService(req);
            const product = await service.getProductById();

            return res.status(200).send({ product: product })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: error })
        }
    }
    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new ProductService(req);
            const product = await service.deleteProduct(res);

            return res.status(200).send(product)
        } catch (error) {
            return res.status(500).send({ error })
        }
    }


}

export default new ProductController();