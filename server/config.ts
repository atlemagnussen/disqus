import dotenv from "dotenv"
import path from "path"

const environment = process.env.NODE_ENV ?? ""
console.log("env", environment)

const envFile = environment ? `.env.${environment}` : ".env"
const envFilePath = path.join(process.cwd(), "..", envFile)
console.log(`environment: ${environment}, envFilePath: ${envFilePath}`)

const config = dotenv.config({ path: envFilePath})
console.log(config)

const portStr = process.env.PORT as string
const port = portStr ? parseInt(portStr) : 8000

const apiKey = process.env.APIKEY as string

const mongoConnStr = process.env.MONGO as string

export default {
    port,
    apiKey,
    mongoConnStr
}

