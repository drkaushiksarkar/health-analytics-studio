# Prevalence API Reference

## Endpoints

### GET /api/v1/prevalence

Returns all prevalence records.

**Parameters:**
- `limit` (int): Max results (default: 100)
- `offset` (int): Pagination offset
- `filter` (string): Filter expression

### POST /api/v1/prevalence

Create a new prevalence record.

**Request Body:**
```json
{
  "name": "string",
  "type": "string",
  "metadata": {}
}
```

### GET /api/v1/prevalence/{id}

Get prevalence by ID.

### DELETE /api/v1/prevalence/{id}

Delete prevalence record.
