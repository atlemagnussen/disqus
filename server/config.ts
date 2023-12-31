import dotenv from "dotenv"
import path from "path"

const environment = process.env.NODE_ENV ?? ""
console.log("env", environment)

const envFile = environment ? `.env.${environment}` : ".env"
const envFilePath = path.join(process.cwd(), "..", envFile)
console.log(`environment: ${environment}, envFilePath: ${envFilePath}`)

const config = dotenv.config({ path: envFilePath})
console.log(config)

const portStr = getSetting("PORT")
const port = portStr ? parseInt(portStr) : 8000

const apiKey = getSetting("APIKEY")
const mongoConnStr = getSetting("MONGO")
const dbName = getSetting("DBNAME")

const logFilePath = getSetting("LOGFILE")

export default {
    port,
    apiKey,
    mongoConnStr,
    dbName,
    logFilePath
}

function getSetting(name: string) {
    return process.env[name] as string
}