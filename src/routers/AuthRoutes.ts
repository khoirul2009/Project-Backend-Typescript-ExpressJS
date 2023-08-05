import BaseRoutes from "./BaseRoutes";
import AuthController from '../controller/AuthController';
import { register, login } from "../middlewares/AuthValidator";
import { auth } from "../middlewares/AuthMiddleware";

class AuthRoutes extends BaseRoutes {
    routes(): void {
        this.router.post('/register', register, AuthController.register);
        this.router.post('/login', login, AuthController.login);
        this.router.get('/profile/:username', auth, AuthController.profile);
        this.router.get('/token', AuthController.refreshToken);
        this.router.delete('/logout', AuthController.logout);
    }

}

export default new AuthRoutes().router;