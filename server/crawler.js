const config = require('./config.js');
const logger = require('./logger.js').default;
logger.debug('Booting');

const httpPromise = require('./httpPromise');
const MongoClient = require('mongodb').MongoClient;

const CONNECTIONSTRING = config.mongo.constr;
const DBNAME = config.mongo.dbname;
const COLLECTION = config.mongo.collection;
const MAXCALLS = config.app.maxcallsbeforesleep;
const SLEEPTIME = config.app.sleeptime;
const BASEURL = config.app.baseurl;
const POSTSURL = "/forums/listPosts.json";
const APIKEY = config.app.apikey;
const FORUM = config.app.forum;
const initUrl = `${BASEURL}${POSTSURL}?api_key=${APIKEY}&forum=${FORUM}`;

let client = null;

let counter = 0;
const caller = async (url) => {
    let nextUrl = null;
    try {
        logger.info(`Calling on url: ${url}`);
        counter += 1;
        const res = await httpPromise.get(url);
        await handler(res);
        logger.info(`counter ${counter}`);
        if (counter % MAXCALLS === 0) {
            logger.info(`Rest for now, reached max calls ${counter}`);
            if (res.cursor.hasNext && res.cursor.next) {
                nextUrl = `${initUrl}&cursor=${res.cursor.next}`;
                logger.info(`Next url=${nextUrl}`);
            }
            const slept = await sleep(SLEEPTIME);
            logger.info(slept);
            if (nextUrl) {
                logger.info(`Resume after sleep Next url=${nextUrl}`);
                await caller(nextUrl);
            }
            return;
        }
        if (res.cursor.hasNext && res.cursor.next) {
            nextUrl = `${initUrl}&cursor=${res.cursor.next}`;
            logger.info(`Next url=${nextUrl}`);
            caller(nextUrl);
        } else {
            if (client && client.isConnected() === true) {
                client.close();
            }
            logger.info("No next url, exit");
        }
    } catch (e) {
        logger.error(e);
        logger.info("sleep and continue");
        const slept = await sleep(10000);
        logger.info(slept);
        logger.info(`Next url=${nextUrl}, current url=${url}`);
        if (nextUrl) {
            caller(nextUrl);
        } else if (url) {
            caller(nextUrl);
        } else {
            logger.error("no url or next url, exit");
        }
    }
};

const handler = async (res) => {
    try {
        if (client.isConnected() === false) {
            await client.connect();
        }
        if (res.response && Array.isArray(res.response)) {
            const postsLength = res.response.length;
            logger.info(`Posts count=${postsLength}`);
            const savers = [];
            for (let i = 0; i < postsLength; i++) {
                const post = res.response[i];
                if (!post.isSpam) {
                    savers.push(saver(post));
                }
            }
            const results = await Promise.all(savers);
            const totalRes = red(results);
            logger.info(JSON.stringify(totalRes));
            logger.debug(`all savers done, count=${savers.length}`);
        } else {
            logger.info(`No posts`);
        }
    } catch (e) {
        logger.error(e);
    } finally {
        // if (client && client.isConnected() === true) {
        //     logger.trace("close client");
        //     client.close();
        // }
    }
};

const saver = async (post) => {
    try {
        const db = client.db(DBNAME);
        const coll = db.collection(COLLECTION);
        const find = await coll.findOne({id: post.id});
        if (find) {
            logger.trace(`Post id ${post.id} already existed, skip`);
            return "existed";
        }
        return coll.insertOne(post).
            then((res) => {
                const r = res.result;
                if (r && r.n && r.n === 1 && r.ok && r.ok === 1) {
                    return "inserted";
                }
                logger.debug("unkown result");
                logger.debug(res);
                return "unknown";
            });
    } catch (e) {
        logger.error(e);
    }
    return "error";
};

const sleep = (time) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Slept ${time}ms`);
        }, time);
    });

const red = (arr) =>
    arr.reduce((acc, curr) => {
        if (typeof acc[curr] === 'undefined') {
            acc[curr] = 1;
        } else {
            acc[curr] += 1;
        }

        return acc;
    }, {});

const initer = async() => {
    client = new MongoClient(CONNECTIONSTRING, { useNewUrlParser: true });
    caller(initUrl);
};

initer();