"""Resistance type definitions."""
from typing import Any, Dict, List, Optional, TypedDict
from datetime import datetime


class ResistanceRecord(TypedDict):
    id: str
    name: str
    type: str
    metadata: Dict[str, Any]
    created_at: str
    updated_at: Optional[str]


class ResistanceQuery(TypedDict, total=False):
    limit: int
    offset: int
    filter: str
    sort_by: str
    order: str


class ResistanceResponse(TypedDict):
    data: List[ResistanceRecord]
    total: int
    page: int
    has_more: bool
