import ProductController from "../controller/ProductController"; // user controller
import BaseRouter from "./BaseRoutes";
import { auth } from '../middlewares/AuthMiddleware';
import { create, update } from "../middlewares/ProductValidator";

class ProductRoutes extends BaseRouter {

    public routes(): void {
        this.router.get("/", ProductController.index);
        this.router.get("/browse", ProductController.browseProducts);
        this.router.post("/", create, ProductController.create);
        this.router.get("/:id", ProductController.show);
        this.router.put("/:id", auth, update, ProductController.update);
        this.router.delete("/:id", auth, ProductController.delete);
    }
}

export default new ProductRoutes().router;