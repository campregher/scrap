from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from bs4 import BeautifulSoup

from utils.extract import extract_contacts_from_text, merge_contacts, safe_text
from utils.http import HttpClient
from utils.scoring import score_prob_revendedor
from utils.storage import Lead

logger = logging.getLogger(__name__)


@dataclass
class ShopeeConfig:
    seed_list_path: str = "data/shopee_seed_urls.txt"
    enable_search: bool = False


class ShopeeSafeScraper:
    def __init__(self, http: HttpClient, config: ShopeeConfig) -> None:
        self.http = http
        self.config = config

    def read_seed_urls(self) -> list[str]:
        path = Path(self.config.seed_list_path)
        if not path.exists():
            logger.warning("Seed list nao encontrada: %s", path)
            return []
        urls = []
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            urls.append(line)
        return urls

    def fetch_html(self, url: str) -> str:
        response = self.http.get(url)
        return response.text if response else ""

    def parse_shop_name(self, soup: BeautifulSoup) -> str:
        title = soup.title.string if soup.title else ""
        if title:
            return safe_text(title.split("|")[0])
        h1 = soup.find("h1")
        return safe_text(h1.get_text(strip=True)) if h1 else ""

    def build_lead(self, url: str, keyword: str, nicho: str, subnicho: str) -> Lead:
        html = self.fetch_html(url)
        soup = BeautifulSoup(html, "html.parser")
        nome = self.parse_shop_name(soup)
        contacts = [extract_contacts_from_text(html)]
        merged = merge_contacts(contacts)
        prob = score_prob_revendedor(nome, keyword)

        return Lead(
            marketplace="Shopee",
            nicho=nicho,
            subnicho=subnicho,
            keyword=keyword,
            nome_da_loja=nome,
            url_da_loja=url,
            telefone=merged.telefone,
            whatsapp=merged.whatsapp,
            email=merged.email,
            localizacao="",
            rating=None,
            avaliacoes=None,
            data_coleta=Lead.now_iso(),
            prob_revendedor=prob,
        )

    def search_keyword(self, keyword: str) -> list[str]:
        search_url = "https://shopee.com.br/search"
        response = self.http.get(search_url, params={"keyword": keyword})
        if not response:
            return []
        if response.status_code in {403, 429} or "captcha" in response.text.lower():
            logger.warning("Possivel bloqueio na Shopee. Abortando busca.")
            return []
        soup = BeautifulSoup(response.text, "html.parser")
        urls = []
        for anchor in soup.find_all("a", href=True):
            href = anchor["href"]
            if "/shop/" in href:
                if href.startswith("/"):
                    urls.append(f"https://shopee.com.br{href}")
                else:
                    urls.append(href)
        return list(dict.fromkeys(urls))

    def run(self, keyword_map: dict[str, list[str]], nicho: str) -> list[Lead]:
        leads: list[Lead] = []
        seed_urls = self.read_seed_urls()
        if seed_urls:
            for url in seed_urls:
                lead = self.build_lead(url, keyword="seed", nicho=nicho, subnicho="")
                if lead.nome_da_loja and lead.url_da_loja:
                    leads.append(lead)

        if self.config.enable_search:
            for subnicho, keywords in keyword_map.items():
                for keyword in keywords:
                    urls = self.search_keyword(keyword)
                    if not urls:
                        logger.warning("Busca Shopee bloqueada. Use seed list.")
                        return leads
                    for url in urls:
                        lead = self.build_lead(url, keyword=keyword, nicho=nicho, subnicho=subnicho)
                        if lead.nome_da_loja and lead.url_da_loja:
                            leads.append(lead)
        return leads
