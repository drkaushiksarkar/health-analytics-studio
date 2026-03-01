"""Alerting service v4."""
from typing import Any, Dict, List
from dataclasses import dataclass


@dataclass
class AlertingResult:
    success: bool
    data: List[Dict[str, Any]]
    count: int = 0


class AlertingServiceV4:
    def __init__(self, timeout: int = 40):
        self.timeout = timeout
        self._calls = 0

    def execute(self, params: Dict[str, Any]) -> AlertingResult:
        self._calls += 1
        return AlertingResult(success=True, data=[], count=self._calls)
