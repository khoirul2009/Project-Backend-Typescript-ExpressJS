import RouterInterface from './RouterInterface';
import { Router } from 'express';

abstract class BaseRoutes implements RouterInterface {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }
    abstract routes(): void;

}

export default BaseRoutes;