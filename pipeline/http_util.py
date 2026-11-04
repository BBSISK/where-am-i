"""Robust HTTP for the pipeline: retries dropped connections and server errors with backoff."""
import time
import requests

RETRYABLE = (requests.exceptions.ChunkedEncodingError, requests.exceptions.ConnectionError,
             requests.exceptions.Timeout)


def get_json(url, params=None, headers=None, timeout=120, attempts=5):
    last = None
    for i in range(attempts):
        try:
            r = requests.get(url, params=params, headers=headers, timeout=timeout)
            if r.status_code in (429, 500, 502, 503, 504):
                last = RuntimeError(f"HTTP {r.status_code} from {url}")
            else:
                r.raise_for_status()
                return r.json()
        except RETRYABLE as e:
            last = e
        time.sleep(2 ** i)
    raise last
