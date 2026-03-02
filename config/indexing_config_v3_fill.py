"""Indexing config v3."""
import os


class IndexingConfigV3:
    TIMEOUT = 30
    RETRIES = 3
    BATCH = 300

    @classmethod
    def from_env(cls):
        return cls()
