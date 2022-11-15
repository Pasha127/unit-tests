import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "../src/api/productModel.js";
import server from "../src/server.js";
dotenv.config();
const client = supertest(server);

const newProduct = {
  name: "test product",
  description: "lorem ipsum",
  price: 29,
};

const newName = "modified product";

const notValidProduct = {
  description: "lorem ipsum",
  price: 29,
};

const specificProduct = {
    name: "specific product",
  description: "This product should be found by ID",
  price: 69
};


const invalidProductId = 12345612345612345612345;
const validProductId = 123456123456123456123456;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_CONNECTION_URL);
  const product = new productModel(newProduct);
  await product.save();
});


describe("Test Products APIs", () => {
    it("Should check that Mongo connection string is not undefined", () => {
        expect(process.env.MONGO_TEST_CONNECTION_URL).toBeDefined();
    });
    
    it("Should test that GET /products returns a success status and a body", async () => {
        const response = await client.get("/products").expect(200);
        console.log(response.body);
    });
    
    it("Should test that POST /products returns a valid _id and 201", async () => {
        const response = await client.post("/products").send(newProduct).expect(201);
        expect(response.body._id).toBeDefined();
    });
    
    it("Should test that POST /products with a not valid product returns 400", async () => {
        await client.post("/products").send(notValidProduct).expect(400);
    });
    
    it("Should test that GET /products with a not existing product returns 404", async () => {
        await client.get(`/products/${validProductId}`).expect(404);
    });
    
    it("Should test that GET /products/:productId returns the correct product with a correctly formatted ID", async () => {
        const postedProduct = await client.post("/products").send(specificProduct);
        const res = await client.get(`/products/${postedProduct.body._id}`);
        expect(res.body._id).toHaveLength(24);
        expect(res.body._id).toMatch(postedProduct.body._id);
    });
    
    it("Should test that DELETE /products/:productId returns 404 if invalid ID", async () => {
        await client.delete(`/products/${1234567}`).expect(404);
    });
    
    it("Should test that DELETE /products/:productId returns 204 if ID is valid", async () => {
        const res = await client.get(`/products`);
        await client.delete(`/products/${res[0].body._id}`).expect(204);
    });
    
    it("Should test that PUT /products/:productId returns 404 if ID is invalid", async () => {
        await client.put(`/products/${invalidProductId}`).send({name: newName}).expect(404);
        
    });
    
    it("Should test that PUT /products/:productId returns modified name string if ID is valid", async () => {
        const postedProduct = await client.post("/products").send(newProduct);
        const res = await client.put(`/products/${postedProduct.body._id}`).send({name: newName});
        expect(postedProduct.body._id).toMatch(res.body._id);
        expect(res.body.name).toMatch(newName);
        expect(typeof res.body.name).toBe("string");
    });
})

afterAll(async () => {
  await productModel.deleteMany();
  await mongoose.connection.close();
});




/* describe("Testing the library", () => {
    it("Should test that true is true", () => {
      expect(true).toBe(true)
    })
  
    it("Should test that true is true", () => {
      expect(true).toBe(true)
    })
  
    it("null", () => {
      const n = null
      expect(n).toBeNull()
      expect(n).toBeDefined()
      expect(n).not.toBeUndefined()
      expect(n).not.toBeTruthy()
      expect(n).toBeFalsy()
    })
  
    it("Should test that 2 plus 2 is 4", () => {
      expect(2 + 2).toBe(4)
    })
  })
  
  describe("Testing inside another describe function", () => {
    it("Should test that false is false", () => {
      expect(false).toBe(false)
    })
  }) */

  // By default jest does not work with the new import syntax
// We should add NODE_OPTIONS=--experimental-vm-modules to the package.json (test script) to enable that
// ON WINDOWS YOU HAVE TO USE CROSS-ENV PACKAGE TO BE ABLE TO PASS ENV VARS TO COMMAND LINE SCRIPTS!!


