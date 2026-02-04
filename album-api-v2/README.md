# Album API v2

Node.js/TypeScript rewrite of the albums-api with in-memory storage.

## Features

- Full CRUD operations for albums
- In-memory storage (no database required)
- TypeScript for type safety
- Express.js framework
- CORS enabled
- Comprehensive unit tests with Vitest

## API Endpoints

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | `/`           | Welcome message  |
| GET    | `/albums`     | Get all albums   |
| GET    | `/albums/:id` | Get album by ID  |
| POST   | `/albums`     | Create new album |
| PUT    | `/albums/:id` | Update album     |
| DELETE | `/albums/:id` | Delete album     |

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Start (Production)

```bash
npm start
```

## Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Album Schema

```typescript
{
  id: number;
  title: string;
  artist: string;
  price: number;
  image_url: string;
}
```
