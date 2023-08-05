import IController from "./ControllerInterface";
import { Request, Response } from "express";
import CategoryServices from "../services/CategoryServices";


class CategoryController implements IController {
    index = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new CategoryServices(req)
            const categories = await service.getAllCategory();

            return res.status(200).send(categories)
        } catch (error) {
            return res.status(500).send({ error })
        }


    }
    create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new CategoryServices(req)
            const category = await service.storeCategory(req, res);

            return res.status(200).send({ code: 200, message: "Category created successfully" })
        } catch (error) {
            return res.status(500).send({ error })
        }

    }
    update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new CategoryServices(req)
            const category = await service.updateCategory(req, res);

            return res.status(200).send({ code: 200, message: "Category updated successfully" })
        } catch (error) {
            return res.status(500).send({ error })
        }
    }
    show = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new CategoryServices(req)
            const category = await service.getCategoryById();

            return res.status(200).send({ code: 200, category: category })
        } catch (error) {
            return res.status(500).send({ error })
        }
    }
    delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const service = new CategoryServices(req)
            const category = await service.deleteCategory(res);

            return res.status(200).send({ code: 200, message: "Category deleted successfully" })
        } catch (error) {
            return res.status(500).send({ error })
        }
    }

}

export default new CategoryController;