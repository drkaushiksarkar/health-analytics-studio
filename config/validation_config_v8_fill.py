"""Validation config v8."""
import os


class ValidationConfigV8:
    TIMEOUT = 80
    RETRIES = 8
    BATCH = 800

    @classmethod
    def from_env(cls):
        return cls()
