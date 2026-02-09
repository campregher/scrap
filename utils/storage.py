from __future__ import annotations

import logging
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, Optional

import pandas as pd

logger = logging.getLogger(__name__)


@dataclass
class Lead:
    marketplace: str
    nicho: str
    subnicho: str
    keyword: str
    nome_da_loja: str
    url_da_loja: str
    telefone: str
    whatsapp: str
    email: str
    localizacao: str
    rating: Optional[float]
    avaliacoes: Optional[int]
    data_coleta: str
    prob_revendedor: int

    @staticmethod
    def now_iso() -> str:
        return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

    def to_dict(self) -> dict:
        return asdict(self)


def dedupe_leads(df: pd.DataFrame) -> pd.DataFrame:
    if "url_da_loja" in df.columns:
        df = df.drop_duplicates(subset=["url_da_loja"], keep="first")
    df = df.drop_duplicates(subset=["marketplace", "nome_da_loja"], keep="first")
    return df


def append_and_save(
    leads: Iterable[Lead],
    csv_path: Path,
    xlsx_path: Path,
) -> None:
    new_df = pd.DataFrame([lead.to_dict() for lead in leads])
    if new_df.empty:
        logger.info("Nenhum lead novo para salvar.")
        return

    if csv_path.exists():
        existing_df = pd.read_csv(csv_path, encoding="utf-8-sig")
        combined_df = pd.concat([existing_df, new_df], ignore_index=True)
    else:
        combined_df = new_df

    combined_df = dedupe_leads(combined_df)
    combined_df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    combined_df.to_excel(xlsx_path, index=False)
    logger.info("Salvo %s leads em %s e %s", len(combined_df), csv_path, xlsx_path)
