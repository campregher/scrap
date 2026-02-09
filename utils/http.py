from __future__ import annotations

import logging
import random
import time
import urllib.robotparser
from dataclasses import dataclass
from typing import Optional
from urllib.parse import urlparse

import requests
from requests import Response

logger = logging.getLogger(__name__)


@dataclass
class HttpConfig:
    timeout_sec: int = 15
    min_delay_sec: float = 1.5
    max_delay_sec: float = 3.5
    max_retries: int = 3
    respect_robots: bool = True
    user_agent: str = "LeadCollectorBot/1.0"


class HttpClient:
    def __init__(self, config: HttpConfig) -> None:
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": config.user_agent})
        self._robots_cache: dict[str, urllib.robotparser.RobotFileParser] = {}

    def _sleep_jitter(self) -> None:
        delay = random.uniform(self.config.min_delay_sec, self.config.max_delay_sec)
        time.sleep(delay)

    def _get_robots_parser(self, base_url: str) -> urllib.robotparser.RobotFileParser:
        if base_url in self._robots_cache:
            return self._robots_cache[base_url]
        parser = urllib.robotparser.RobotFileParser()
        robots_url = f"{base_url}/robots.txt"
        try:
            parser.set_url(robots_url)
            parser.read()
        except Exception as exc:  # noqa: BLE001
            logger.warning("Falha ao ler robots.txt em %s: %s", robots_url, exc)
        self._robots_cache[base_url] = parser
        return parser

    def _allowed_by_robots(self, url: str) -> bool:
        if not self.config.respect_robots:
            return True
        parsed = urlparse(url)
        base_url = f"{parsed.scheme}://{parsed.netloc}"
        parser = self._get_robots_parser(base_url)
        return parser.can_fetch(self.config.user_agent, url)

    def get(self, url: str, *, params: Optional[dict] = None) -> Optional[Response]:
        if not self._allowed_by_robots(url):
            logger.info("Bloqueado por robots.txt: %s", url)
            return None

        for attempt in range(1, self.config.max_retries + 1):
            self._sleep_jitter()
            try:
                response = self.session.get(url, params=params, timeout=self.config.timeout_sec)
                if response.status_code in {429, 403}:
                    backoff = min(10, 2**attempt)
                    logger.warning(
                        "Recebido %s em %s. Backoff %ss (tentativa %s/%s)",
                        response.status_code,
                        url,
                        backoff,
                        attempt,
                        self.config.max_retries,
                    )
                    time.sleep(backoff)
                    continue
                response.raise_for_status()
                return response
            except requests.RequestException as exc:
                logger.warning(
                    "Erro HTTP em %s (tentativa %s/%s): %s",
                    url,
                    attempt,
                    self.config.max_retries,
                    exc,
                )
                time.sleep(min(10, 2**attempt))
        return None
