import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🎵 Albums API v2 is running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   GET    /albums       - Get all albums`);
  console.log(`   GET    /albums/:id   - Get album by ID`);
  console.log(`   POST   /albums       - Create new album`);
  console.log(`   PUT    /albums/:id   - Update album`);
  console.log(`   DELETE /albums/:id   - Delete album`);
});
