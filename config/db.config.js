import mongoose from "mongoose"
import dotevn from "dotenv"
dotevn.config()

export default class DbConfig {
    constructor(){
        this.mongoURI = "mongodb://localhost:27017/pain-gain"
    }

    async connectDb() {
        return mongoose.connect(this.mongoURI, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: true
        }).then(() => {
            console.log(`Connect database success`)
        }).catch(error => {
            console.error(`Connection error: ${error.stack}`)
            process.exit(1)
        })
    }
}