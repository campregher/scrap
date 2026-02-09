from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable, Optional

EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_REGEX = re.compile(
    r"(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?(?:9?\d{4})[-\s]?\d{4}"
)
WHATSAPP_CONTEXT = re.compile(r"(whatsapp|wpp|zap)", re.IGNORECASE)


@dataclass
class Contacts:
    email: str = ""
    telefone: str = ""
    whatsapp: str = ""


def normalize_phone(number: str) -> str:
    digits = re.sub(r"\D", "", number)
    if len(digits) in {10, 11, 12, 13}:
        return digits
    return number.strip()


def extract_emails(text: str) -> list[str]:
    return list({match.group(0) for match in EMAIL_REGEX.finditer(text)})


def extract_phones(text: str) -> list[str]:
    phones = [normalize_phone(match.group(0)) for match in PHONE_REGEX.finditer(text)]
    return list({phone for phone in phones if phone})


def extract_whatsapp(text: str) -> list[str]:
    whatsapp_numbers: set[str] = set()
    for match in PHONE_REGEX.finditer(text):
        start = max(0, match.start() - 20)
        end = min(len(text), match.end() + 20)
        context = text[start:end]
        if WHATSAPP_CONTEXT.search(context):
            whatsapp_numbers.add(normalize_phone(match.group(0)))
    return list(whatsapp_numbers)


def extract_contacts_from_text(text: str) -> Contacts:
    emails = extract_emails(text)
    phones = extract_phones(text)
    whatsapp_numbers = extract_whatsapp(text)
    return Contacts(
        email=emails[0] if emails else "",
        telefone=phones[0] if phones else "",
        whatsapp=whatsapp_numbers[0] if whatsapp_numbers else "",
    )


def merge_contacts(contacts: Iterable[Contacts]) -> Contacts:
    email = ""
    telefone = ""
    whatsapp = ""
    for contact in contacts:
        if contact.email and not email:
            email = contact.email
        if contact.telefone and not telefone:
            telefone = contact.telefone
        if contact.whatsapp and not whatsapp:
            whatsapp = contact.whatsapp
    return Contacts(email=email, telefone=telefone, whatsapp=whatsapp)


def safe_text(value: Optional[str]) -> str:
    return value.strip() if value else ""
