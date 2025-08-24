import { Router } from "express"
import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"

const cartsRouter = Router()

cartsRouter.post("/", async (req,res)=> {
    try {
        const newCart = new cartModel()
        await newCart.save()
        res.status(201).send(`New cart created succesfully! Your ID cart is: ${newCart._id}`)
    } catch (error) {
        res.status(500).send(error)
        }
    }
)


cartsRouter.get("/:cid", async (req,res)=> {
    const {cid} = req.params
    try {
        const foundCart = await cartModel.findById(cid).populate("products.productID")
        if(!foundCart){
            return res.status(404).send("ID not found.")
        }

        res.status(200).send(foundCart)
    } catch (error) {
        res.status(500).send(error)
        }   
    }
)

cartsRouter.put("/:cid", async (req,res)=> {
    const {cid} = req.params
    const newProducts = req.body
    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("Cart ID not found in database.")
        }
        const existingProducts = await productModel.find()
        
        for (const newProduct of newProducts) {
            if (!existingProducts.some(existingProduct => existingProduct._id==newProduct.productID)) {
                return res.status(400).send("One or more of the added products does not exist in the database. Please check again!")
            }
        }
        foundCart.products = newProducts
        await cartModel.updateOne({_id:cid},foundCart)
        res.status(200).send("Cart updated succesfully!")
    } catch (error) {
        res.status(500).send(error)
        }   
    }
)

cartsRouter.post("/:cid/product/:pid", async (req,res)=> {
    const {cid, pid} = req.params
    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("Cart ID not found in database.")
        }
        const foundProduct = await productModel.findById(pid)
        if(!foundProduct){
            return res.status(404).send("Product ID not found in database.")
        }
        if(foundCart.products.some(product => product.productID==pid)){
            const existingProduct = foundCart.products.find(product => product.productID==pid)
            existingProduct.quantity++
            await cartModel.updateOne({_id:cid},foundCart)
            res.status(200).send("Updated quantity on existing product.")
        }else{
            foundCart.products.push({
                productID: pid,
                quantity: 1
            })
            await cartModel.updateOne({_id:cid},foundCart)
            res.status(200).send("Product added to cart.")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

cartsRouter.put("/:cid/product/:pid", async (req,res)=> {
    const {cid, pid} = req.params
    const newQuantity = req.body

    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("Cart ID not found in database.")
        }
        const foundProduct = await productModel.findById(pid)
        if(!foundProduct){
            return res.status(404).send("Product ID not found in database.")
        }
        if(foundCart.products.some(product => product.productID==pid)){
            const existingProduct = foundCart.products.find(product => product.productID==pid)
            existingProduct.quantity = newQuantity.quantity
            await cartModel.updateOne({_id:cid},foundCart)
            res.status(200).send("Updated quantity on existing product.")
        }else{
            res.status(400).send("The requested product does not exist in this cart. Please check again!")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

cartsRouter.delete("/:cid/product/:pid", async (req,res)=> {
    const {cid, pid} = req.params
    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("Cart ID not found in database.")
        }
        const foundProduct = await productModel.findById(pid)
        if(!foundProduct){
            return res.status(404).send("Product ID not found in database.")
        }
        if(foundCart.products.some(product => product.productID==pid)){
            const deleteIndex = foundCart.products.findIndex(product => product.productID==pid)
            foundCart.products.splice(deleteIndex,1)
            await cartModel.updateOne({_id:cid},foundCart)
            res.status(200).send("Product deleted!")
        }else{
            res.status(404).send("The requested product does not exist in this cart. Please check again!")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

cartsRouter.delete("/:cid", async (req, res)=> {
    const {cid} = req.params
    try {
        const foundCart = await cartModel.findById(cid)
        if(!foundCart){
            return res.status(404).send("Cart ID not found in database.")
        }
        foundCart.products = []
        console.log(foundCart.products)
        await cartModel.updateOne({_id:cid},foundCart)
        res.status(200).send(`Cart ${cid} successfully emptied!`)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default cartsRouter