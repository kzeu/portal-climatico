const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());



app.get("/news", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM test"
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});



app.get("/news/highlight", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM test"
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});



app.post("/news", async (req, res) => {
  const { title, content, image, highlight } = req.body;

  try {
    await pool.query(
      "INSERT INTO news (title, content, image, highlight) VALUES ($1,$2,$3,$4)",
      [title, content, image, highlight]
    );

    res.send("saved");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});


app.listen(3000, () => {
  console.log("Server running");
});