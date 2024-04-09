import mongoose from "mongoose";


const dbConnection = () => {
  mongoose
    .connect(process.env.DATA_BASE_URL)
    .then((res) => {
      console.log(`DataBase has connected to the ${res.connection.host}`);
    })
    .catch((error) => {
      console.log(`Error from DB ${error}`);
    });
};

export default dbConnection;
