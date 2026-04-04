"""Surveillance type definitions."""
from typing import Any, Dict, List, Optional, TypedDict
from datetime import datetime


class SurveillanceRecord(TypedDict):
    id: str
    name: str
    type: str
    metadata: Dict[str, Any]
    created_at: str
    updated_at: Optional[str]


class SurveillanceQuery(TypedDict, total=False):
    limit: int
    offset: int
    filter: str
    sort_by: str
    order: str


class SurveillanceResponse(TypedDict):
    data: List[SurveillanceRecord]
    total: int
    page: int
    has_more: bool
