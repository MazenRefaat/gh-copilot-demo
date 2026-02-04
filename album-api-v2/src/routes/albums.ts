import { Router, Request, Response } from "express";
import { albums, Album, getNextId } from "../models/album.js";

const router = Router();

// GET /albums - Get all albums
router.get("/", (_req: Request, res: Response) => {
  res.json(albums);
});

// GET /albums/:id - Get album by ID
router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid album ID" });
    return;
  }

  const album = albums.find((a) => a.id === id);

  if (!album) {
    res.status(404).json({ error: "Album not found" });
    return;
  }

  res.json(album);
});

// POST /albums - Create a new album
router.post("/", (req: Request, res: Response) => {
  const { title, artist, price, image_url } = req.body;

  // Validation
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "Title is required and must be a string" });
    return;
  }

  if (!artist || typeof artist !== "string") {
    res.status(400).json({ error: "Artist is required and must be a string" });
    return;
  }

  if (price === undefined || typeof price !== "number" || price <= 0) {
    res
      .status(400)
      .json({ error: "Price is required and must be a positive number" });
    return;
  }

  if (!image_url || typeof image_url !== "string") {
    res
      .status(400)
      .json({ error: "Image URL is required and must be a string" });
    return;
  }

  const newAlbum: Album = {
    id: getNextId(),
    title,
    artist,
    price,
    image_url,
  };

  albums.push(newAlbum);
  res.status(201).json(newAlbum);
});

// PUT /albums/:id - Update an album
router.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid album ID" });
    return;
  }

  const index = albums.findIndex((a) => a.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Album not found" });
    return;
  }

  const { title, artist, price, image_url } = req.body;

  // Validation
  if (title !== undefined && (typeof title !== "string" || !title)) {
    res.status(400).json({ error: "Title must be a non-empty string" });
    return;
  }

  if (artist !== undefined && (typeof artist !== "string" || !artist)) {
    res.status(400).json({ error: "Artist must be a non-empty string" });
    return;
  }

  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    res.status(400).json({ error: "Price must be a positive number" });
    return;
  }

  if (
    image_url !== undefined &&
    (typeof image_url !== "string" || !image_url)
  ) {
    res.status(400).json({ error: "Image URL must be a non-empty string" });
    return;
  }

  // Update album with provided fields
  const updatedAlbum: Album = {
    ...albums[index],
    ...(title !== undefined && { title }),
    ...(artist !== undefined && { artist }),
    ...(price !== undefined && { price }),
    ...(image_url !== undefined && { image_url }),
  };

  albums[index] = updatedAlbum;
  res.json(updatedAlbum);
});

// DELETE /albums/:id - Delete an album
router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid album ID" });
    return;
  }

  const index = albums.findIndex((a) => a.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Album not found" });
    return;
  }

  albums.splice(index, 1);
  res.status(204).send();
});

export default router;
