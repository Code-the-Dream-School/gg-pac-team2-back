require('dotenv').config()
const app = require("./app");
const connectDB = require("./db/conn.js")

const port = process.env.PORT || 8000
const listener = () => console.log(`Listening on Port ${port}!`);

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI) 
        app.listen(port, listener);
    } catch (error) {
        console.log(error)
    }
}

startServer() 