import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import albumsRouter from "./routes/albums.js";

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.send("Hit the /albums endpoint to retrieve a list of albums!");
});

// Album routes
app.use("/albums", albumsRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
