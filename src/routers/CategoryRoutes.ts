import CategoryController from "../controller/CategoryController"; // user controller
import BaseRouter from "./BaseRoutes";
import { auth } from '../middlewares/AuthMiddleware';
import { create, update } from "../middlewares/CategoryValidator";

class CategoryRoutes extends BaseRouter {

    public routes(): void {
        this.router.get("/", CategoryController.index);
        this.router.post("/", create, CategoryController.create);
        this.router.get("/:id", CategoryController.show);
        this.router.put("/:id", update, CategoryController.update);
        this.router.delete("/:id", CategoryController.delete);
    }
}

export default new CategoryRoutes().router;