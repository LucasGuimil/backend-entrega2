import { Router } from "express"
import productModel from "../modules/product.model.js"

const productsRouter = Router()

productsRouter.get("/", async (req,res)=>{
    const {limit = 1, page = 1, query, sort} = req.query
    const myCustomLabels = {
        docs: "payload",
        totalDocs: false,
        limit: false,
        pagingCounter: false
    }
    
    const options = {
        limit: limit ?? 1,
        page: page,
        query: query,
        sort: {price: sort },
        customLabels: myCustomLabels
    }

    try{
        const products = await productModel.find().paginate(options)
        let resultStatus = "success"
        let prevLink = products.hasPrevPage?`${req.baseUrl}?page=${products.prevPage}&limit=${products.limit}`:null
        let nextLink = products.hasNextPage?`${req.baseUrl}?page=${products.nextPage}&limit=${products.limit}`:null
        if(page>products.totalPages){
            resultStatus="error"
        }
        res.status(200).send({
            status: resultStatus,
            ...products,
            prevLink: `${prevLink}`,
            nextLink: `${nextLink}`
            })
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