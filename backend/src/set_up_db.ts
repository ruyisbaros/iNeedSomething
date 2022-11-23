import mongoose from "mongoose";
import { config } from "./config";
import Logger from 'bunyan'
const log: Logger = config.createLogs('DBSetUp');

export default () => {
    const connect = () => {
        mongoose.connect(config.DB_URL!)
            .then(() => {
                log.info("Db connection is done successufully!")
            })
            .catch((e) => {
                log.error('Something went wrong during DB connection' + e)
                return process.exit(1)
            })
    }
    connect();

    mongoose.connection.on('disconnected', connect)
}