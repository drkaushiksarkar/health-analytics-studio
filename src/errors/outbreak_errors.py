"""Outbreak error definitions."""


class OutbreakError(Exception):
    """Base error for outbreak operations."""
    code = "OUTBREAK_ERROR"


class OutbreakNotFoundError(OutbreakError):
    code = "OUTBREAK_NOT_FOUND"


class OutbreakValidationError(OutbreakError):
    code = "OUTBREAK_VALIDATION"


class OutbreakTimeoutError(OutbreakError):
    code = "OUTBREAK_TIMEOUT"


ERROR_CODES = {
    OutbreakError.code: "General outbreak error",
    OutbreakNotFoundError.code: "Outbreak resource not found",
    OutbreakValidationError.code: "Outbreak validation failed",
    OutbreakTimeoutError.code: "Outbreak operation timed out",
}
