from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Iterable

from utils.extract import extract_contacts_from_text, merge_contacts, safe_text
from utils.http import HttpClient
from utils.scoring import score_prob_revendedor
from utils.storage import Lead

logger = logging.getLogger(__name__)


@dataclass
class MercadoLivreConfig:
    site_id: str = "MLB"
    results_limit: int = 50


class MercadoLivreScraper:
    def __init__(self, http: HttpClient, config: MercadoLivreConfig) -> None:
        self.http = http
        self.config = config

    def search_sellers(self, keyword: str) -> list[int]:
        url = f"https://api.mercadolibre.com/sites/{self.config.site_id}/search"
        response = self.http.get(url, params={"q": keyword, "limit": self.config.results_limit})
        if not response:
            return []
        payload = response.json()
        seller_ids = []
        for item in payload.get("results", []):
            seller = item.get("seller") or {}
            seller_id = seller.get("id")
            if seller_id:
                seller_ids.append(seller_id)
        return list(set(seller_ids))

    def fetch_seller_info(self, seller_id: int) -> dict:
        url = f"https://api.mercadolibre.com/users/{seller_id}"
        response = self.http.get(url)
        return response.json() if response else {}

    def fetch_public_html(self, url: str) -> str:
        response = self.http.get(url)
        return response.text if response else ""

    def build_lead(
        self,
        seller_info: dict,
        keyword: str,
        nicho: str,
        subnicho: str,
    ) -> Lead:
        nickname = safe_text(seller_info.get("nickname"))
        permalink = safe_text(seller_info.get("permalink"))
        location = safe_text(
            (seller_info.get("address") or {}).get("city") or ""
        )
        rating = seller_info.get("seller_reputation", {}).get("transactions", {}).get("rating")
        transactions = seller_info.get("seller_reputation", {}).get("transactions", {}).get("total")

        json_text = json.dumps(seller_info, ensure_ascii=False)
        contacts = [extract_contacts_from_text(json_text)]
        if permalink:
            html_text = self.fetch_public_html(permalink)
            if html_text:
                contacts.append(extract_contacts_from_text(html_text))
        merged = merge_contacts(contacts)
        prob = score_prob_revendedor(nickname, keyword, None, transactions)

        return Lead(
            marketplace="Mercado Livre",
            nicho=nicho,
            subnicho=subnicho,
            keyword=keyword,
            nome_da_loja=nickname,
            url_da_loja=permalink,
            telefone=merged.telefone,
            whatsapp=merged.whatsapp,
            email=merged.email,
            localizacao=location,
            rating=None,
            avaliacoes=transactions,
            data_coleta=Lead.now_iso(),
            prob_revendedor=prob,
        )

    def run(self, keyword_map: dict[str, list[str]], nicho: str) -> list[Lead]:
        leads: list[Lead] = []
        for subnicho, keywords in keyword_map.items():
            for keyword in keywords:
                logger.info("Buscando Mercado Livre por '%s' (%s)", keyword, subnicho)
                seller_ids = self.search_sellers(keyword)
                for seller_id in seller_ids:
                    seller_info = self.fetch_seller_info(seller_id)
                    if not seller_info:
                        continue
                    lead = self.build_lead(seller_info, keyword, nicho, subnicho)
                    if lead.nome_da_loja and lead.url_da_loja:
                        leads.append(lead)
        return leads
