import mongoose from "mongoose";
import { config } from "./config";

export default () => {
    const connect = () => {
        mongoose.connect(config.DB_URL!)
            .then(() => {
                console.log("Db connection is done successufully!")
            })
            .catch((e) => {
                console.log('Something went wrong during DB connection'+e.getMessage())
                return process.exit(1)
            })
    }
    connect();

    mongoose.connection.on('disconnected',connect)
}