import express from 'express';

interface ITokenBucket {
    tokenCounter: number,
    lastRequestTimestamp: number
}

let TOKEN_BUCKET: Record<number, ITokenBucket> = {}

export const rateLimiter: express.RequestHandler = (req, res, next) => {
    const userId = parseInt(req.params.id as string, 10);
    console.log("bucket at the function start: ", TOKEN_BUCKET);

    if(!TOKEN_BUCKET[userId]) {
        TOKEN_BUCKET[userId] = {
            tokenCounter: 2,
            lastRequestTimestamp: Math.floor(Date.now() / 1000)
        }
        console.log("bucket at the end of first condition: ", TOKEN_BUCKET);
        return next();
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if(currentTimestamp - TOKEN_BUCKET[userId].lastRequestTimestamp > 60) {
        TOKEN_BUCKET[userId].tokenCounter = 3;
    }

    if(TOKEN_BUCKET[userId].tokenCounter === 0) {
        res.status(429).send("Too many requests, try again later!");
        console.log("bucket at the end of second condition: ", TOKEN_BUCKET);
        return;
    }

    TOKEN_BUCKET[userId].tokenCounter = TOKEN_BUCKET[userId].tokenCounter - 1;
    TOKEN_BUCKET[userId].lastRequestTimestamp = currentTimestamp;
    console.log("bucket at the end of the function: ", TOKEN_BUCKET);
    next()
}