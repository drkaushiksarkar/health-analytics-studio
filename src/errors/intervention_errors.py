"""Intervention error definitions."""


class InterventionError(Exception):
    """Base error for intervention operations."""
    code = "INTERVENTION_ERROR"


class InterventionNotFoundError(InterventionError):
    code = "INTERVENTION_NOT_FOUND"


class InterventionValidationError(InterventionError):
    code = "INTERVENTION_VALIDATION"


class InterventionTimeoutError(InterventionError):
    code = "INTERVENTION_TIMEOUT"


ERROR_CODES = {
    InterventionError.code: "General intervention error",
    InterventionNotFoundError.code: "Intervention resource not found",
    InterventionValidationError.code: "Intervention validation failed",
    InterventionTimeoutError.code: "Intervention operation timed out",
}
