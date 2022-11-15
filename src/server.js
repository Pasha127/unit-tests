import express from "express"
import cors from "cors"
import errorHandler from "./errorHandler.js"
import router from "./api/index.js"

const server = express()

server.use(cors())
server.use(express.json())
server.use("/", router)
server.use(errorHandler)

export default server