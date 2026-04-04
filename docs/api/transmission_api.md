# Transmission API Reference

## Endpoints

### GET /api/v1/transmission

Returns all transmission records.

**Parameters:**
- `limit` (int): Max results (default: 100)
- `offset` (int): Pagination offset
- `filter` (string): Filter expression

### POST /api/v1/transmission

Create a new transmission record.

**Request Body:**
```json
{
  "name": "string",
  "type": "string",
  "metadata": {}
}
```

### GET /api/v1/transmission/{id}

Get transmission by ID.

### DELETE /api/v1/transmission/{id}

Delete transmission record.
