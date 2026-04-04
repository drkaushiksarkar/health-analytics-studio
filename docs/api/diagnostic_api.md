# Diagnostic API Reference

## Endpoints

### GET /api/v1/diagnostic

Returns all diagnostic records.

**Parameters:**
- `limit` (int): Max results (default: 100)
- `offset` (int): Pagination offset
- `filter` (string): Filter expression

### POST /api/v1/diagnostic

Create a new diagnostic record.

**Request Body:**
```json
{
  "name": "string",
  "type": "string",
  "metadata": {}
}
```

### GET /api/v1/diagnostic/{id}

Get diagnostic by ID.

### DELETE /api/v1/diagnostic/{id}

Delete diagnostic record.
