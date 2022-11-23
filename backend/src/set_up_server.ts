import { Application, json, urlencoded, Response, Request, NextFunction, application } from "express"
import http from "http"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import hpp from "hpp"
import Logger from 'bunyan'
import compression from 'compression'
import cookieSession from "cookie-session"
import httpStatusCodes from "http-status-codes"
import { Server } from "socket.io"
import { createClient } from 'redis'
import { createAdapter } from "@socket.io/redis-adapter"
import "express-async-errors"
import { config } from "./config"
import applicationRoutes from "./routes"
import { CustomError, IErrorResponse } from './funcs/globalFuncs/helpers/error_handler';

const PORT = config.PORT || 5000;
const log:Logger=config.createLogs('serverSetUp');

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
                secure: config.NODE_ENV !== "development"
            })
        )
        app.use(hpp())
        app.use(morgan("dev"));
        app.use(helmet());
        app.use(cors({
            origin: config.CLIENT_URL,
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

    private routesMiddleware(app: Application): void {
        applicationRoutes(app)
    }

    private exceptionHandler(app: Application): void {
        app.all('*', (req: Request, res: Response) => {
            res.status(httpStatusCodes.NOT_FOUND).json({ message: `${req.originalUrl} not found!` })
        })

        app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json(error.serializeError())
            }
            next()
        })
    }

    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app)
            const socketIO: Server = await this.createSocketIO(httpServer)
            this.startHttpServer(httpServer)
            this.socketIOConnections(socketIO)
        } catch (error) {
            log.error(error)
        }
    }

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io: Server = new Server(httpServer, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
            }
        });
        const pubClient = createClient({ url: config.REDIS_HOST });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);

        io.adapter(createAdapter(pubClient, subClient))
        return io;
    }

    private startHttpServer(httpServer: http.Server): void {
        log.info(`Server has started with process ${process.pid}`)
        httpServer.listen(PORT, () => { log.info(`Server runs at ${PORT}...`) })
    }

    private socketIOConnections(io: Server): void { }

}