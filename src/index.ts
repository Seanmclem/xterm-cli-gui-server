import express from "express";
// import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:3030"];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
// };
// app.use(cors(options));
app.use(express.json());

app.listen(3030, () => {
  console.log("Server running on port 3030 ~~~");
});
