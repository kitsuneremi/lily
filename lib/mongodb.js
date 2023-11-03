import mongoose from "mongoose";


const connect = async () => {
    try {
        await mongoose.connect(process.env.SEC_DATABASE_URL, {});
        console.log("mongo connected")
    } catch (error) {
        console.log(error)
    }
}

export default connect;