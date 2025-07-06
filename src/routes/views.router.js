import { Router } from "express"
import { ProductManager } from "../managers/ProductManager.js"

const viewsRouter = Router()

viewsRouter.get("/", (req, res)=> {
    const pageName = "Productos"
    ProductManager.getProducts()
    .then(products => {
        res.render("home",{
            pageName,
            products
        })
    })
})

viewsRouter.get("/realTimeProducts" , (req,res)=>{
    res.render("realTimeProducts")
})

export default viewsRouter