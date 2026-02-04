import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { albums } from "../src/models/album.js";

describe("Albums API", () => {
  // Reset albums to initial state before each test
  beforeEach(() => {
    albums.length = 0;
    albums.push(
      {
        id: 1,
        title: "You, Me and an App Id",
        artist: "Daprize",
        price: 10.99,
        image_url: "https://aka.ms/albums-daprlogo",
      },
      {
        id: 2,
        title: "Seven Revision Army",
        artist: "The Blue-Green Stripes",
        price: 13.99,
        image_url: "https://aka.ms/albums-containerappslogo",
      },
      {
        id: 3,
        title: "Scale It Up",
        artist: "KEDA Club",
        price: 13.99,
        image_url: "https://aka.ms/albums-kedalogo",
      },
      {
        id: 4,
        title: "Lost in Translation",
        artist: "MegaDNS",
        price: 12.99,
        image_url: "https://aka.ms/albums-envoylogo",
      },
      {
        id: 5,
        title: "Lock Down Your Love",
        artist: "V is for VNET",
        price: 12.99,
        image_url: "https://aka.ms/albums-vnetlogo",
      },
      {
        id: 6,
        title: "Sweet Container O' Mine",
        artist: "Guns N Probeses",
        price: 14.99,
        image_url: "https://aka.ms/albums-containerappslogo",
      },
    );
  });

  describe("GET /", () => {
    it("should return welcome message", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.text).toBe(
        "Hit the /albums endpoint to retrieve a list of albums!",
      );
    });
  });

  describe("GET /albums", () => {
    it("should return all albums", async () => {
      const response = await request(app).get("/albums");
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(6);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("title");
      expect(response.body[0]).toHaveProperty("artist");
      expect(response.body[0]).toHaveProperty("price");
      expect(response.body[0]).toHaveProperty("image_url");
    });

    it("should return albums with correct data structure", async () => {
      const response = await request(app).get("/albums");
      expect(response.body[0]).toEqual({
        id: 1,
        title: "You, Me and an App Id",
        artist: "Daprize",
        price: 10.99,
        image_url: "https://aka.ms/albums-daprlogo",
      });
    });
  });

  describe("GET /albums/:id", () => {
    it("should return a single album by ID", async () => {
      const response = await request(app).get("/albums/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        title: "You, Me and an App Id",
        artist: "Daprize",
        price: 10.99,
        image_url: "https://aka.ms/albums-daprlogo",
      });
    });

    it("should return 404 for non-existent album", async () => {
      const response = await request(app).get("/albums/999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Album not found");
    });

    it("should return 400 for invalid ID", async () => {
      const response = await request(app).get("/albums/invalid");
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid album ID");
    });
  });

  describe("POST /albums", () => {
    it("should create a new album", async () => {
      const newAlbum = {
        title: "Test Album",
        artist: "Test Artist",
        price: 9.99,
        image_url: "https://example.com/test.jpg",
      };

      const response = await request(app).post("/albums").send(newAlbum);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newAlbum);
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(7);
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app).post("/albums").send({
        artist: "Test Artist",
        price: 9.99,
        image_url: "https://example.com/test.jpg",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 if price is not a positive number", async () => {
      const response = await request(app).post("/albums").send({
        title: "Test Album",
        artist: "Test Artist",
        price: -5,
        image_url: "https://example.com/test.jpg",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /albums/:id", () => {
    it("should update an existing album", async () => {
      const response = await request(app).put("/albums/1").send({
        title: "Updated Title",
        price: 15.99,
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: 1,
        title: "Updated Title",
        artist: "Daprize",
        price: 15.99,
        image_url: "https://aka.ms/albums-daprlogo",
      });
    });

    it("should return 404 for non-existent album", async () => {
      const response = await request(app)
        .put("/albums/999")
        .send({ title: "Updated Title" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Album not found");
    });

    it("should return 400 for invalid price", async () => {
      const response = await request(app).put("/albums/1").send({ price: -10 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /albums/:id", () => {
    it("should delete an album", async () => {
      const response = await request(app).delete("/albums/1");
      expect(response.status).toBe(204);

      // Verify album is deleted
      const getResponse = await request(app).get("/albums/1");
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 for non-existent album", async () => {
      const response = await request(app).delete("/albums/999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Album not found");
    });

    it("should return 400 for invalid ID", async () => {
      const response = await request(app).delete("/albums/invalid");
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid album ID");
    });
  });

  describe("404 handler", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await request(app).get("/unknown");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Not found");
    });
  });
});
