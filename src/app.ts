import express from 'express';
import bodyParser from 'body-parser';
// import { rateLimiter } from './rateLimitingMiddleware';

const app = express();
app.use(bodyParser.json());

// const dummyGetData = [
//     {
//         productId: 1,
//         productName: 'product 1',
//         productCategory: 'category 1'
//     },
//     {
//         productId: 2,
//         productName: 'product 2',
//         productCategory: 'category 2'
//     },
//     {
//         productId: 3,
//         productName: 'product 3',
//         productCategory: 'category 3'
//     }
// ]

const requestLogger: express.RequestHandler = (req, _res, next) => {
    console.log(req.method, req.path, 'Body - ', req.body, Date());
    next();
}

app.use(requestLogger);

app.get('/healthz', (_req, res) => {
    res.status(200).send({
        status: "OK"
    });
});
// app.get('/token-bucket/:id', rateLimiter, (_req, res) => {
//     res.status(200).send(dummyGetData);
// });

app.listen(3000, () => {
    console.log("Server started at PORT:3000");
});