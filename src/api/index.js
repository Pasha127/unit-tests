import express from "express"
import productModel from "./productModel.js"

const router = express.Router()

//////////////////////// Products ////////////////////////////////

router.post("/products/", async (req, res, next) => {
  try {
    const newProduct = new productModel(req.body)
    const { _id } = await newProduct.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

router.get("/products/", async (req, res, next) => {
  try {
    const products = await productModel.find({})
    res.send(products)
  } catch (error) {
    next(error)
  }
})
router.get("/products/:productId", async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.productId)
    if(product){
        res.status(200).send(product)
    }else{
        res.status(404)
    }
  } catch (error) {
    next(error)
  }
})
router.delete("/products/:productId", async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.productId)
    res.status(204)
  } catch (error) {
    next(error)
  }
})
router.put("/products/:productId", async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndUpdate(req.params.productId, req.body)
    if(product){
        res.status(201).send(product)
    }else{
        res.status(404)
    }
    res.status(204)
  } catch (error) {
    next(error)
  }
})

export default router