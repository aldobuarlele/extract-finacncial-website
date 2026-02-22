import time
from enum import Enum
from functools import wraps

class CircuitState(Enum):
    CLOSED = "CLOSED" 
    OPEN = "OPEN" 
    HALF_OPEN = "HALF_OPEN" 

class CircuitBreaker:
    def __init__(self, failure_threshold=3, recovery_timeout=60):
        self.failure_threshold = failure_threshold 
        self.recovery_timeout = recovery_timeout 
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED

    def __call__(self, func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if self.state == CircuitState.OPEN:
                if time.time() - self.last_failure_time > self.recovery_timeout:
                    self.state = CircuitState.HALF_OPEN
                else:
                    print("⚠️ Circuit Breaker is OPEN. Skipping AI Call.")
                    return None, None

            try:
                result = await func(*args, **kwargs)
                self._on_success()
                return result
            except Exception as e:
                self._on_failure()
                raise e
        return wrapper

    def _on_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
            print(f"🚨 Circuit Breaker switched to OPEN state!")

gemini_breaker = CircuitBreaker(failure_threshold=3, recovery_timeout=30)