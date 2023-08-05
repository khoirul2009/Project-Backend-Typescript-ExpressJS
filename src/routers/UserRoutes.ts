import UserController from "../controller/UserController"; // user controller
import BaseRouter from "./BaseRoutes";
import { create, update } from "../middlewares/UserValidator";
import { auth } from '../middlewares/AuthMiddleware';

class UserRoutes extends BaseRouter {

    public routes(): void {
        this.router.get("/", auth, UserController.index);
        this.router.post("/", auth, create, UserController.create);
        this.router.get("/:id", auth, UserController.show);
        this.router.put("/:id", auth, update, UserController.update);
        this.router.delete("/:id", auth, UserController.delete);
    }
}

export default new UserRoutes().router;