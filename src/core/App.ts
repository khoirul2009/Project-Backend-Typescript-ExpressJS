import express, { Application } from "express";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import UserRoutes from "../routers/UserRoutes";
import ProductRoutes from "../routers/ProductRoutes";
import AuthRoutes from "../routers/AuthRoutes";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { config as dotenv } from 'dotenv';
import bodyParser from "body-parser";
import CategoryRoutes from "../routers/CategoryRoutes";
import CartRoutes from "../routers/CartRoutes";
import VariantRoutes from "../routers/VariantRoutes";

export default class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(express.json());
        this.app.use(cors({
            origin: 'http://127.0.0.1:5173',
            optionsSuccessStatus: 200,
            credentials: true
        }));
        this.plugins();
        this.app.use(express.static('public'))
        this.routes();
        this.app.use(compression());
        this.app.use(helmet());

        dotenv();

    }

    protected plugins(): void {
        this.app.use(morgan("dev"));
        this.app.use(cookieParser());
        this.app.use(fileUpload());

    }

    protected routes(): void {
        this.app.use("/api/v1/users", UserRoutes);
        this.app.use('/api/v1/auth', AuthRoutes);
        this.app.use("/api/v1/products", ProductRoutes);
        this.app.use("/api/v1/categories", CategoryRoutes);
        this.app.use("/api/v1/carts", CartRoutes);
        this.app.use("/api/v1/variants", VariantRoutes);
    }
}
