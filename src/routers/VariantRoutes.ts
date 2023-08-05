import VariantController from "../controller/VariantController";
import BaseRouter from "./BaseRoutes";
import { auth } from '../middlewares/AuthMiddleware';
import { create, update } from '../middlewares/VariantValidator'

class VariantRoutes extends BaseRouter {

    public routes(): void {
        this.router.get("/", VariantController.index);
        this.router.post("/", auth, create, VariantController.create);
        // this.router.get("/:id", VariantController.show);
        this.router.put("/:id", auth, update, VariantController.update);
        this.router.delete("/:id", VariantController.delete);
    }
}

export default new VariantRoutes().router;