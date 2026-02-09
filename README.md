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

## Como rodar no VS Code

1. Abra a pasta do projeto no VS Code (`Arquivo > Abrir Pasta`).
2. Instale a extensão **Python** (Microsoft) se ainda não tiver.
3. Abra um terminal integrado (`Terminal > Novo Terminal`) e crie o ambiente virtual:

```bash
python -m venv .venv
```

4. Ative o ambiente virtual:

```bash
source .venv/bin/activate
```

No Windows (PowerShell):

```powershell
.venv\\Scripts\\Activate.ps1
```

5. Selecione o interpretador Python do projeto:
   - Pressione `Ctrl+Shift+P` → **Python: Select Interpreter** → escolha o `.venv`.
6. Instale as dependências:

```bash
pip install -r requirements.txt
```

7. Execute o projeto pelo terminal:

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
