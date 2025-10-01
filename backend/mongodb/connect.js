import mongoose from "mongoose";
const connectDB =  (url) => {
    mongoose.set('strictQuery', true);//to avoid deprecation warning 
    mongoose.connect(url)// returns a promise
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
}
export default connectDB;
