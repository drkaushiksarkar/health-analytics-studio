"""Indexing config v8."""
import os


class IndexingConfigV8:
    TIMEOUT = 80
    RETRIES = 8
    BATCH = 800

    @classmethod
    def from_env(cls):
        return cls()
