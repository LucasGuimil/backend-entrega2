import fs from "fs"

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
                "thumbnails": Array(thumbnails).flat(1)
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