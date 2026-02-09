from __future__ import annotations

import re
from typing import Optional

NAME_KEYWORDS = ["autopeças", "acessórios", "distribuidora", "atacado", "loja"]
KEYWORD_BONUS = ["kit", "atacado", "lote", "combo"]


def score_prob_revendedor(
    nome_da_loja: str,
    keyword: str,
    rating: Optional[float] = None,
    avaliacoes: Optional[int] = None,
) -> int:
    score = 0
    nome_lower = nome_da_loja.lower()
    for term in NAME_KEYWORDS:
        if term in nome_lower:
            score += 20

    keyword_lower = keyword.lower()
    for term in KEYWORD_BONUS:
        if term in keyword_lower:
            score += 10

    if rating is not None and rating >= 4.7:
        score += 10
    if avaliacoes is not None:
        if avaliacoes >= 1000:
            score += 20
        elif avaliacoes >= 200:
            score += 10

    score = max(0, min(100, score))
    return score
