import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Server Express (TypeScript) trong Turborepo đang chạy tốt!",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tại: http://localhost:${PORT}`);
});
