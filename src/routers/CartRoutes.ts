import BaseRoutes from "./BaseRoutes";
import { auth } from "../middlewares/AuthMiddleware";
import CartController from "../controller/CartController";
import { create } from "../middlewares/CartValidator"

class CartRoutes extends BaseRoutes {
    routes(): void {
        this.router.get('/', auth, CartController.index);
        this.router.post('/', auth, create, CartController.create);
        this.router.put('/qty/:id', auth, CartController.update);
        this.router.put('/select/:id', CartController.select);
        this.router.delete('/:id', auth, CartController.delete);
        // this.router.get('/:id', auth, CartController.show);
    }

}

export default new CartRoutes().router;