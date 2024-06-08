import config from "./config"

import log4js from "log4js"

const log4jsConfig: log4js.Configuration = {
    "appenders": {
        "console": {
            "type": "console"
        }
    },
    "categories": {
        "default": {
            "appenders": ["console"],
            "level": "debug"
        }
    }
}

if (config.environment != "production") {
    log4jsConfig.appenders["toDateFile"] = {
        "type": "dateFile",
        "filename": config.logFilePath
    }
    log4jsConfig.categories.default.appenders.push("toDateFile")
}

log4js.configure(log4jsConfig)

export const logger = log4js.getLogger('server')
logger.debug('Init logger')
