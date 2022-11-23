import dotenv from "dotenv"
import bunyan from "bunyan"

dotenv.config({})

class Config {
    public PORT: string | undefined;
    public NODE_ENV: string | undefined;
    public CLIENT_URL: string | undefined;
    public DB_URL: string | undefined;
    public ACCESS_TOKEN_KEY: string | undefined;
    public REFRESH_TOKEN_KEY: string | undefined;
    public COOKIE_KEY_ONE: string | undefined;
    public COOKIE_KEY_TWO: string | undefined;
    public CLOUD_NAME: string | undefined;
    public CLOUD_API_KEY: string | undefined;
    public CLOUD_API_SECRET: string | undefined;
    public REDIS_HOST: string | undefined;

    constructor() {
        this.PORT = process.env.PORT
        this.NODE_ENV = process.env.NODE_ENV
        this.CLIENT_URL = process.env.CLIENT_URL
        this.DB_URL = process.env.DB_URL
        this.ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY
        this.REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY
        this.COOKIE_KEY_ONE = process.env.COOKIE_KEY_ONE
        this.COOKIE_KEY_TWO = process.env.COOKIE_KEY_TWO
        this.CLOUD_NAME = process.env.CLOUD_NAME
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY
        this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET
        this.REDIS_HOST = process.env.REDIS_HOST
    }

    public createLogs(name: string): bunyan {
        return bunyan.createLogger({ name, level: 'debug' })
    }

    public validateConfig(): void {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`This ${key} enviroment is undefined!`)
            }
        }
    }
};

export const config: Config = new Config()