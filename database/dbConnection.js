import mongoose from 'mongoose';

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "PORTFOLIO-MERN"
    }).then(() => {
        console.log("Connected to database");
    }).catch((error) => {
        console.log(`Some error occured while connecting to database: ${error}`)
    })
}

export default dbConnection;