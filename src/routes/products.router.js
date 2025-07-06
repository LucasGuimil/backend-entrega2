import { Router } from "express"
import {ProductManager} from "../managers/ProductManager.js"

const productsRouter = Router()

productsRouter.get("/", (req,res)=>{
    ProductManager.getProducts()
    .then(products => res.send(products))
    
})

productsRouter.get("/:pid", (req,res)=> {
    const {pid} = req.params
    ProductManager.getProducts().then(products => {
        const foundProduct = products.find(product => product.id === parseInt(pid))
        if(!foundProduct) return res.status(404).json("El id del producto indicado no existe.")
        res.status(200).json(foundProduct)
    })
})

productsRouter.post("/", (req, res)=> {
    const productInfo = req.body
    ProductManager.addProduct(productInfo)
    res.status(201).json("El producto ha sido creado correctamente.")
})

productsRouter.put("/api/products/:pid", (req,res)=> {
    const {pid} = req.params
    const productInfo = req.body
    ProductManager.getProducts().then(products => {
        const foundProduct = products.some(product => product.id === parseInt(pid))
        if(!foundProduct) {
            return res.status(404).json("El id del producto indicado no existe.")
        }else{
            ProductManager.updateProduct(pid,productInfo) 
            res.status(200).json("El producto fue modificado correctamente.")
        }
    })
}
)

productsRouter.delete("/:pid", (req,res)=> {
    const {pid} = req.params
    ProductManager.getProducts().then(products => {
        const foundProduct = products.find(product => product.id === parseInt(pid))
        if(!foundProduct) {
            return res.status(404).json("El id del producto indicado no existe.")
        }else{
            ProductManager.deleteProduct(pid)
            res.status(200).json("El producto fue eliminado correctamente.")
        }
    })
})


export default productsRouter