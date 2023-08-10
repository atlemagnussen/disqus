import config from "./config.js"

import log4js from "log4js"

const log4jsConfig = {
    "appenders": {
        "toDateFile": {
            "type": "dateFile",
            "filename": config.logFilePath
        },
        "console": {
            "type": "console"
        }
    },
    "categories": {
        "default": {
            "appenders": ["toDateFile", "console"],
            "level": "debug"
        }
    }
}

log4js.configure(log4jsConfig);

export const logger = log4js.getLogger('server');
logger.info('Init logger');
