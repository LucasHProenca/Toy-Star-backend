import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './router/userRouter'
import { productRouter } from './router/productRouter'
import { purchaseRouter } from './router/purchaseRouter'

dotenv.config

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT || 3003), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`)
})

app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/purchases", purchaseRouter)