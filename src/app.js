const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require('cookie-parser')
const cors = require('cors');
require('dotenv').config()

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")


const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())



app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend is running"
    });
});

connectDb()
    .then(() => {
        console.log("Database connection established successfully");
        app.listen(process.env.PORT, async () => {
            console.log("server start successfully on port 7777")
        })
    })
    .catch((err) => {
        console.log("Database cant be connected", err.message);

    })

