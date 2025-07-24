import { Router } from "express"
import productModel from "../modules/product.model.js"

const productsRouter = Router()

productsRouter.get("/", async (req,res)=>{
    try{
        const products = await productModel.find()
        res.status(200).send(products)
    }catch(error){
        res.status(500).send(error)
    }
})

productsRouter.get("/:pid", async (req,res)=> {
    const {pid} = req.params
    try {
        const foundProduct = await productModel.findById(pid)
        if (!foundProduct) {
            return res.status(404).send("ID not found")
        }
        res.status(200).send(foundProduct)
    } catch(error){
        res.status(500).send(error)
        }
    }
)

productsRouter.post("/", async (req, res)=> {
    const productInfo = req.body
    try {
        const newProduct = await productModel.create(productInfo)
        res.status(201).send("New product created succesfully!",newProduct)
    } catch (error) {
        res.status(500).send(error)
    }
})

productsRouter.put("/:pid", async (req,res)=> {
    const {pid} = req.params
    const productInfo = req.body

    try {
        const foundProduct = await productModel.findByIdAndUpdate(pid,productInfo)
        if (!foundProduct) {
            return res.status(404).send("ID not found")
        }
        res.status(200).send("Product updated!")
    } catch (error) {
        res.status(500).send(error)
        }
    }
)

productsRouter.delete("/:pid", async (req,res)=> {
    const {pid} = req.params
    try {
        const foundProduct = await productModel.findByIdAndDelete(pid)
        if (!foundProduct) {
            return res.status(404).send("ID not found")
        }
        res.status(200).send(foundProduct)
    } catch(error){
        res.status(500).send(error)
        }
    }
)


export default productsRouter