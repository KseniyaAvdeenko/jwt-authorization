const express = require('express');
require('dotenv').config()
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {bgRed, bgGreen, bgBlueBright} = require('ansi-colors');
const mongoose = require('mongoose');
const Bree = require('bree');
const routes = require('./router/index')
const errorMiddleware = require('./middlewares/error.middleware')

const bree = new Bree({
    jobs: [
        {name: 'accessTokenReview', interval: 'every 6 hour'},
        {name: 'refreshTokenReview', interval: 'every 1 day'},
    ]
});


const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin: [process.env.CLIENT_URL]
}));
app.use('/api', routes)
app.use(errorMiddleware)

const startServer = async () => {
    try {
        await bree.start();
        await mongoose.connect(process.env.MONGO_URI).then(() => console.log(bgBlueBright.whiteBright(' Db connected')))
        app.listen(process.env.PORT, () => console.log(bgGreen.whiteBright(' Server started ')))
    } catch (e) {
        console.log(bgRed.whiteBright(e))
    }
}

startServer()