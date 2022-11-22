import { config } from './config';
import { MyServer } from './set_up_server';
import express, { Express } from "express"
import DbConnection from './set_up_db'

class Application {

    public initalize(): void {
        this.loadConfig()
        DbConnection()
        const app: Express = express()
        const server: MyServer = new MyServer(app)

        server.start();
    }

    private loadConfig(): void {
        config.validateConfig()
    }
}

const application: Application = new Application()

application.initalize()