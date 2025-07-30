import { Router } from "express"
import productModel from "../modules/product.model.js"  

const productsRouter = Router()

productsRouter.get("/", async (req,res)=>{
    const {limit = 5, page = 1, sort,status,category} = req.query
    const myCustomLabels = {
        docs: "payload",
        totalDocs: false,
        limit: false,
        pagingCounter: false
    }

    const query = {
    }
    if (category){
        query.category= category.toLowerCase()
    }
    if (status){
        query.status= status.toLowerCase()
    }

    const options = {
        limit: limit,
        page: page,
        customLabels: myCustomLabels
    }
    if(sort){
        options.sort = {price: sort}
    }
    try{
        const products = await productModel.paginate(query,options)
        let resultStatus = "success"
        let prevLink = products.hasPrevPage?`http://${req.host}${req.baseUrl}?page=${products.prevPage}`:null
        let nextLink = products.hasNextPage?`http://${req.host}${req.baseUrl}?page=${products.nextPage}`:null
        if(options.limit!=5){
            prevLink = products.hasPrevPage?prevLink + `&limit=${limit}`:null
            nextLink = products.hasNextPage?nextLink + `&limit=${limit}`:null
        }
        if(sort){
            prevLink = products.hasPrevPage?prevLink + `&sort=${sort}`:null
            nextLink = products.hasNextPage?nextLink + `&sort=${sort}`:null
        }
        if(status){
            prevLink = products.hasPrevPage?prevLink + `&status=${status}`:null
            nextLink = products.hasNextPage?nextLink + `&status=${status}`:null
        }
        if(category){
            prevLink = products.hasPrevPage?prevLink + `&category=${category}`:null
            nextLink = products.hasNextPage?nextLink + `&category=${category}`:null
        }

        res.links({
            prev: prevLink,
            next: nextLink
        })
        if(products.payload.length==0){
            resultStatus="error"
            return res.status(400).send({
                status: resultStatus,
                ...products
            })
        }
        return res.status(200).send({
            status: resultStatus,
            ...products,
            prevLink: prevLink,
            nextLink: nextLink
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