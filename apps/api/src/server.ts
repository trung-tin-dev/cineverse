import express from "express";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "cineverse-api",
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
