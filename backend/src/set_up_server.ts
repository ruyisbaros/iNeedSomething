
import { Application, json, urlencoded, Response, Request, NextFunction, application } from "express"
import http from "http"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import hpp from "hpp"
import compression from 'compression'
import cookieSession from "cookie-session"
import httpStatusCodes from "http-status-codes"
import "express-async-errors"
import { config } from "./config"

const PORT = config.PORT || 5000;

export class MyServer {

    private app: Application;

    constructor(app: Application) {
        this.app = app
    }

    public start(): void {
        this.securityMiddleware(this.app)
        this.standartMiddleware(this.app)
        this.routesMiddleware(this.app)
        this.exceptionHandler(this.app)
        this.startServer(this.app)
    }

    private securityMiddleware(app: Application): void {
        app.use(
            cookieSession({
                name: 'session',
                keys: [config.COOKIE_KEY_ONE!, config.COOKIE_KEY_TWO!],
                maxAge: 10 * 24 * 60 * 60 * 1000, //10 days
                secure: false
            })
        )
        app.use(hpp())
        app.use(morgan("dev"));
        app.use(helmet());
        app.use(cors({
            origin: '*',
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
        }));
    }

    private standartMiddleware(app: Application): void {
        app.use(compression())
        app.use(json({ limit: '50mb' }))
        app.use(urlencoded({ extended: true, limit: '50mb' }))
    }

    private routesMiddleware(app: Application): void { }

    private exceptionHandler(app: Application): void { }

    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app)
            this.startHttpServer(httpServer)
        } catch (error) {
            console.log(error)
        }
    }

    private createSocketIO(httpServer: http.Server): void { }

    private startHttpServer(httpServer: http.Server): void {
        httpServer.listen(PORT, () => { console.log(`Server runs at ${PORT}...`) })
    }

}