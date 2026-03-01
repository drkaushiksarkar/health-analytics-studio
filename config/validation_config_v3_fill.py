"""Validation config v3."""
import os


class ValidationConfigV3:
    TIMEOUT = 30
    RETRIES = 3
    BATCH = 300

    @classmethod
    def from_env(cls):
        return cls()
