from fastapi import HTTPException, status

class ExpenseBaseException(HTTPException):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)

class ExtractionError(ExpenseBaseException):
    def __init__(self, detail: str = "Failed to extract data from document"):
        super().__init__(detail=detail, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

class DuplicateDocumentError(ExpenseBaseException):
    def __init__(self, detail: str = "This document has already been processed"):
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)