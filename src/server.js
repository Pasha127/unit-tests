import express from "express"
import cors from "cors"
import usersRouter from "./users/index.js"
import productsRouter from "./products/index.js"
import errorHandler from "./errorHandler.js"

const server = express()

server.use(cors())
server.use(express.json())
server.use("/", router)
server.use(errorHandler)

export default server