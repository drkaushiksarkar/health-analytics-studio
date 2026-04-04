"""Vector error definitions."""


class VectorError(Exception):
    """Base error for vector operations."""
    code = "VECTOR_ERROR"


class VectorNotFoundError(VectorError):
    code = "VECTOR_NOT_FOUND"


class VectorValidationError(VectorError):
    code = "VECTOR_VALIDATION"


class VectorTimeoutError(VectorError):
    code = "VECTOR_TIMEOUT"


ERROR_CODES = {
    VectorError.code: "General vector error",
    VectorNotFoundError.code: "Vector resource not found",
    VectorValidationError.code: "Vector validation failed",
    VectorTimeoutError.code: "Vector operation timed out",
}
