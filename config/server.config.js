import Express from "express"
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan"
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import compression from 'compression'
import responseTime from 'response-time'
import  DbConfig  from './db.config'

export default class ServerConfig {
    constructor({port, middlewares, routers}){
        this.app = Express();
        this.app.set("env", process.env.NODE_ENV || "develop")
        this.app.set("port", port)
        /* register middlewares */
        this.registerDefaultMiddlewares()

        middlewares && middlewares.forEach(mdlw => {
            this.registerMiddleware(mdlw)
        })

        this.app.get("/ping", (req, res, next) => {
            res.send("pong");
        });

        routers && routers.forEach(({ baseUrl, router }) => {
            this.registerRouter(baseUrl, router)
        })

        this.registerMiddleware(
            function (req, res, next){
                const err = new Error("Not Found")
                err.statusCode = 404;
                next(err)
            }
        )

        this.registerErrorHandlingMiddleware()

    }

    get port() {
        return this.app.get("port");
    }

    set port(port) {
        return this.app.set("port", port);
    }

    /**
     * register any middlewares
     * @param {*} middleware
     */
    registerMiddleware(middleware) {
        this.app.use(middleware)
        return this;
    }

    /**
     * register router
     * @param {*} router
     */
    registerRouter(baseUrl, router) {
        this.app.use(baseUrl, router);
        return this;
    }

    /**
     * register default middlewares
     * @param {*} no-params
     */
    registerDefaultMiddlewares() {
        this.app.use(cors())
        this.app.use(morgan('combined'))
        this.app.use(Express.json())
        this.app.use(cookieParser())
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(Express.urlencoded({ extended: false }))
        this.app.use(compression());
        this.app.use(responseTime());
        this.app.use(helmet());
    }

    /**
     * Register error handler for Express
     */
    registerErrorHandlingMiddleware() {
        const ENV = this.app.get("env");
        if(ENV === "development") {
            this.registerMiddleware(
                ({statusCode = 500, message, stack}, req, res, next) => {
                    res.status(statusCode);
                    res.json({
                        statusCode,
                        message,
                        stack
                    })
                }
            )
        } else {
            this.registerMiddleware(
                ({statusCode = 500, message}, req, res, next) => {
                    res.status(statusCode);
                    res.json({
                        statusCode,
                        message
                    })
                }
            )
        }
    }

    async listen() {
        try {
            const dbConf = new DbConfig()
            await dbConf.connectDb()
            this.app.listen(this.port, () => {
                console.log(`Listening on port: ${this.port}`)
            })
        } catch (error) {
            console.error(`DB error: ${error.message}`);
        }
    }
}