import fs from "fs"
import productModel from "../modules/product.model.js"
import { basename } from "path"

export class ProductManager {
    static async getProducts() {
        try {
            const products = await fs.promises.readFile("./src/files/products.json", "utf-8")
            return JSON.parse(products)    
        } catch (error) {
            console.error("Se ha producido un error al leer el archivo.",error)
        }
    }

    static async addProduct(productInfo) {
        try {
            const products = await ProductManager.getProducts()
            const lastId = products[products.length-1].id
            const id = lastId+1
            const { title, description, code, price, status, stock, category, thumbnails} = productInfo
            products.push({
                "id": id,
                "title": title,
                "description": description,
                "code": code,
                "price": parseInt(price),
                "status": Boolean(status),
                "stock": parseInt(stock),
                "category": category,
                "thumbnails": thumbnails.split(",")
            })
            const converted = JSON.stringify(products,null,2)
            await fs.promises.writeFile("./src/files/products.json",converted)
            console.log("Producto creado con éxito.")
        } catch (error) {
            console.error("Se ha producido un error al crear un nuevo producto.",error)
        }
    }

    static async updateProduct(pid, productInfo){
        try {
        const products = await ProductManager.getProducts()
        const foundProduct = products.find(product => product.id === parseInt(pid))
        if(!foundProduct) {
            return console.log("El id del producto indicado no existe.")
        }else{
            const { title, description, code, price, status, stock, category, thumbnails} = productInfo 
            foundProduct.title = title || foundProduct.title
            foundProduct.description = description || foundProduct.description
            foundProduct.code = code || foundProduct.code
            foundProduct.price = price || foundProduct.price
            foundProduct.status = status || foundProduct.status
            foundProduct.stock = stock || foundProduct.stock
            foundProduct.category = category || foundProduct.category
            foundProduct.thumbnails = thumbnails || foundProduct.thumbnails
            const converted = JSON.stringify(products,null,2)
            await fs.promises.writeFile("./src/files/products.json",converted)
            console.log("Producto modificado con éxito.")    
        }
        }catch(error){
            console.error("Se ha producido un error al actualizar los datos del producto.",error)
        }
        
    }
    
    static async deleteProduct(pid){
        try {
            const products = await ProductManager.getProducts()
            const filteredProducts = products.filter(product => product.id !== parseInt(pid))
            const converted = JSON.stringify(filteredProducts,null,2)
            await fs.promises.writeFile("./src/files/products.json",converted)
        } catch (error) {
            console.error("No se pudo eliminar el producto.",error)
        }
    }
}

export const getProducts = async (newQuery)=> {
    const {limit = 10, page = 1, sort,status,category} = newQuery.query
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
    let queryPath = (!newQuery.baseUrl)?newQuery.path:newQuery.baseUrl
    try{
        const products = await productModel.paginate(query,options)
        let prevLink = products.hasPrevPage?`http://${newQuery.host}${queryPath}?page=${products.prevPage}`:null
        let nextLink = products.hasNextPage?`http://${newQuery.host}${queryPath}?page=${products.nextPage}`:null
        if(options.limit!=10){
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

        products.prevLink = prevLink
        products.nextLink = nextLink
        
        return products
    }catch(error){
        return error 
    }}