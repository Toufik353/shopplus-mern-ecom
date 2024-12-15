const mongoose = require("mongoose")
// 
console.log(process.env.MONGODB_URL)
const connectDB = async () => {
    try {   
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
        
    }
}

module.exports = connectDB

