import mongoose from "mongoose";

const dbConnection = (app) => {
  const PORT = process.env.PORT || 5000;
  mongoose
    .connect(process.env.CONNECTION_URL, { useNewUrlParser: true })
    .then(() =>
      app.listen(PORT, () =>
        console.log(`Server Running on Port: http://localhost:${PORT}`)
      )
    )
    .catch((error) => console.log(`${error} did not connect`));
};
export default dbConnection;
