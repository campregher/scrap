# Coletor Ético de Leads - Mercado Livre e Shopee

Projeto em Python 3.11+ para coleta ética de leads de revendedores de acessórios automotivos, com foco em dados públicos e conformidade.

## Requisitos

- Python 3.11+

## Instalação

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Configuração

- Edite `config.json` para ajustar subnichos, keywords e termos de revenda.
- Para Shopee em modo seed, preencha `data/shopee_seed_urls.txt` com URLs públicas de lojas.
- O `enable_search` da Shopee é conservador e pode ser bloqueado. Use apenas quando permitido.

## Execução

```bash
python run_all.py
```

Saídas:
- `leads.csv` (UTF-8-SIG)
- `leads.xlsx`

## Compliance (obrigatório)

- Coleta apenas de dados públicos visíveis em páginas públicas ou APIs oficiais.
- Não usa login, não burla captcha/antibot, não contorna bloqueios.
- Respeita robots.txt e aplica rate limit com delays aleatórios e backoff em 429/403.
- Se telefone/WhatsApp/e-mail não estiverem publicamente visíveis, ficam em branco.

## Estrutura

- `scrapers/mercadolivre.py`: via API oficial do Mercado Livre.
- `scrapers/shopee_safe.py`: modo seguro com seed list e busca opcional (conservadora).
- `utils/http.py`: HTTP client com rate limit, retries e robots.
- `utils/extract.py`: regex e normalização de contatos.
- `utils/storage.py`: dedupe e export incremental.
- `utils/scoring.py`: score simples de probabilidade de revendedor.
