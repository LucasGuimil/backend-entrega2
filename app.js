import express from "express"
import hbs from "express-handlebars"
import productsRouter from "./src/routes/products.router.js"
import cartsRouter from "./src/routes/carts.router.js"
import viewsRouter from "./src/routes/views.router.js"
import http from "http"
import { Server } from "socket.io"

const PORT = 8080
const app = express()
app.use(express.json())

const serverHttp = http.createServer(app)
const io = new Server(serverHttp)

app.engine("handlebars", hbs.engine())
app.set("view engine", "handlebars")
app.set("views", import.meta.dirname + "/src/views")


io.on("connection",(socket)=> {
    socket.emit("hello","world")

})

app.use("/api/products",productsRouter)
app.use("/api/carts",cartsRouter)
app.use("/",viewsRouter)

app.use(express.static(import.meta.dirname + "/src/public"))


serverHttp.listen(PORT, console.log(`Listening in port ${PORT}.`))