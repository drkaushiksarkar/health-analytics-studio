"""Ingestion middleware v7."""
import time
from typing import Any, Callable


class IngestionMiddlewareV7:
    def __init__(self):
        self._count = 0

    def __call__(self, handler: Callable) -> Callable:
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            self._count += 1
            start = time.monotonic()
            result = handler(*args, **kwargs)
            return result
        return wrapper
