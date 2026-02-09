from __future__ import annotations

import json
import logging
from pathlib import Path

from scrapers.mercadolivre import MercadoLivreConfig, MercadoLivreScraper
from scrapers.shopee_safe import ShopeeConfig, ShopeeSafeScraper
from utils.http import HttpClient, HttpConfig
from utils.storage import append_and_save

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)


def load_config(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def build_keyword_map(config: dict) -> dict[str, list[str]]:
    keyword_map: dict[str, list[str]] = {}
    revenda_terms = config.get("revenda_termos", [])
    for subnicho, keywords in config.get("subnichos", {}).items():
        expanded = list(keywords)
        for keyword in keywords:
            for term in revenda_terms:
                expanded.append(f"{keyword} {term}")
        keyword_map[subnicho] = expanded
    return keyword_map


def main() -> None:
    config_path = Path("config.json")
    config = load_config(config_path)
    keyword_map = build_keyword_map(config)
    nicho = config.get("nicho", "acessorios_automotivos")

    http_config = HttpConfig(**config.get("http", {}))
    http_client = HttpClient(http_config)

    ml_config = MercadoLivreConfig(**config.get("mercado_livre", {}))
    ml_scraper = MercadoLivreScraper(http_client, ml_config)
    ml_leads = ml_scraper.run(keyword_map, nicho)

    shopee_config = ShopeeConfig(**config.get("shopee", {}))
    shopee_scraper = ShopeeSafeScraper(http_client, shopee_config)
    shopee_leads = shopee_scraper.run(keyword_map, nicho)

    output_csv = Path("leads.csv")
    output_xlsx = Path("leads.xlsx")
    append_and_save(ml_leads + shopee_leads, output_csv, output_xlsx)


if __name__ == "__main__":
    main()
