import express from "express"
import createHttpError from "http-errors"
import { adminOnlyMiddleware } from "../lib/auth/adminOnly.js"
import { basicAuthMiddleware } from "../lib/auth/basicAuth.js"
import { JWTAuthMiddleware } from "../lib/auth/jwtAuth.js"
import { createTokens, verifyRefreshAndCreateNewTokens } from "../lib/auth/tools.js"
import productModel from "./productModel.js"
import userModel from "./userModel.js"


const router = express.Router()

router.post("/user", async (req, res, next) => {
  try {
    const newUser = new userModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

router.get("/user", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await userModel.find({})
    res.send(users)
  } catch (error) {
    next(error)
  }
})

router.get("/user/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id)
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with Id ${req.user._id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

router.put("/user/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    })
    res.send(updatedUser)
  } catch (error) {
    next(error)
  }
})

router.delete("/user/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await userModel.findByIdAndDelete(req.user._id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})


router.post("/user/login", async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await userModel.checkCredentials(email, password)
        if (user) {
            const { accessToken, refreshToken } = await createTokens(user)
      res.send({ accessToken, refreshToken })
    } else {
        next(createHttpError(401, `Credentials are not ok!`))
    }
} catch (error) {
    next(error)
}
})

router.post("/user/refreshTokens", async (req, res, next) => {
    try {
        const { currentRefreshToken } = req.body
        const { accessToken, refreshToken } = await verifyRefreshAndCreateNewTokens(currentRefreshToken)
        res.send({ accessToken, refreshToken })
    } catch (error) {
        
        next(error)
    }
})

router.get("/user/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.userId)
    res.send(user)
  } catch (error) {
    next(error)
  }
})

router.delete("/user/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.userId)
    if (user) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `User with Id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
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

export default router