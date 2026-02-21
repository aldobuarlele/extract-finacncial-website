import hashlib

async def calculate_hash(file_content: bytes) -> str:
    hash_sha256 = hashlib.sha256()
    hash_sha256.update(file_content)
    return hash_sha256.hexdigest()