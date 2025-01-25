import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("hello from backend");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
