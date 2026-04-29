"""ATS-oriented normalization helpers for parsed and tailored resumes."""

from __future__ import annotations

import copy
import re
from typing import Any

from app.schemas.models import DEFAULT_SECTION_META

_MONTHS: dict[str, str] = {
    "jan": "01",
    "january": "01",
    "janvier": "01",
    "feb": "02",
    "february": "02",
    "fevrier": "02",
    "février": "02",
    "mar": "03",
    "march": "03",
    "mars": "03",
    "apr": "04",
    "april": "04",
    "avril": "04",
    "may": "05",
    "mai": "05",
    "jun": "06",
    "june": "06",
    "juin": "06",
    "jul": "07",
    "july": "07",
    "juillet": "07",
    "aug": "08",
    "august": "08",
    "aout": "08",
    "août": "08",
    "sep": "09",
    "sept": "09",
    "september": "09",
    "septembre": "09",
    "oct": "10",
    "october": "10",
    "octobre": "10",
    "nov": "11",
    "november": "11",
    "novembre": "11",
    "dec": "12",
    "december": "12",
    "decembre": "12",
    "décembre": "12",
}

_MONTH_YEAR_RE = re.compile(
    r"\b("
    + "|".join(re.escape(month) for month in sorted(_MONTHS, key=len, reverse=True))
    + r")\.?\s+(\d{4})\b",
    re.IGNORECASE,
)
_ISO_MONTH_RE = re.compile(r"\b(\d{4})[-/](0?[1-9]|1[0-2])\b")
_PRESENT_RE = re.compile(r"\b(present|current|now|ongoing|aujourd'hui|actuel)\b", re.I)

_ATS_SECTION_ORDER = {
    "personalInfo": 0,
    "additional": 1,
    "workExperience": 2,
    "education": 3,
    "personalProjects": 4,
    "summary": 5,
}


def _normalize_date_token(value: str) -> str:
    value = value.strip()
    if not value:
        return value
    if _PRESENT_RE.fullmatch(value):
        return "Present"

    iso_match = _ISO_MONTH_RE.fullmatch(value)
    if iso_match:
        year, month = iso_match.groups()
        return f"{year}-{int(month):02d}"

    month_match = _MONTH_YEAR_RE.fullmatch(value)
    if month_match:
        month, year = month_match.groups()
        return f"{year}-{_MONTHS[month.casefold()]}"

    return value


def normalize_ats_date_range(value: str) -> str:
    """Normalize dates to short ATS-friendly ranges without inventing precision."""
    if not isinstance(value, str) or not value.strip():
        return value

    normalized = re.sub(r"\s*[–—]\s*", " - ", value.strip())
    parts = [part.strip() for part in normalized.split(" - ")]
    if len(parts) == 2:
        return " - ".join(_normalize_date_token(part) for part in parts)

    normalized = _MONTH_YEAR_RE.sub(
        lambda match: f"{match.group(2)}-{_MONTHS[match.group(1).casefold()]}",
        normalized,
    )
    normalized = _ISO_MONTH_RE.sub(
        lambda match: f"{match.group(1)}-{int(match.group(2)):02d}",
        normalized,
    )
    normalized = _PRESENT_RE.sub("Present", normalized)
    return normalized


def _iter_dated_entries(data: dict[str, Any]):
    for section_key in ("workExperience", "education", "personalProjects"):
        entries = data.get(section_key, [])
        if isinstance(entries, list):
            for entry in entries:
                if isinstance(entry, dict):
                    yield entry

    custom = data.get("customSections", {})
    if isinstance(custom, dict):
        for section in custom.values():
            if not isinstance(section, dict):
                continue
            for item in section.get("items", []) or []:
                if isinstance(item, dict):
                    yield item


def _normalize_dates(data: dict[str, Any]) -> None:
    for entry in _iter_dated_entries(data):
        years = entry.get("years")
        if isinstance(years, str):
            entry["years"] = normalize_ats_date_range(years)


def _apply_ats_section_order(data: dict[str, Any]) -> None:
    section_meta = data.get("sectionMeta") or copy.deepcopy(DEFAULT_SECTION_META)
    if not isinstance(section_meta, list):
        section_meta = copy.deepcopy(DEFAULT_SECTION_META)

    for section in section_meta:
        if not isinstance(section, dict):
            continue
        key = section.get("key") or section.get("id")
        if key in _ATS_SECTION_ORDER:
            section["order"] = _ATS_SECTION_ORDER[key]
        if key == "additional":
            section["displayName"] = "Compétences"

    default_keys = {section.get("key") for section in section_meta if isinstance(section, dict)}
    for default_section in copy.deepcopy(DEFAULT_SECTION_META):
        key = default_section.get("key")
        if key not in default_keys:
            if key in _ATS_SECTION_ORDER:
                default_section["order"] = _ATS_SECTION_ORDER[key]
            if key == "additional":
                default_section["displayName"] = "Compétences"
            section_meta.append(default_section)

    custom_order = max(_ATS_SECTION_ORDER.values()) + 1
    for section in section_meta:
        if not isinstance(section, dict):
            continue
        key = section.get("key") or section.get("id")
        if key not in _ATS_SECTION_ORDER:
            section["order"] = max(int(section.get("order", custom_order)), custom_order)

    data["sectionMeta"] = sorted(
        section_meta,
        key=lambda section: int(section.get("order", custom_order))
        if isinstance(section, dict)
        else custom_order,
    )


def normalize_for_ats(data: dict[str, Any]) -> dict[str, Any]:
    """Return a resume dict normalized for an ATS-first one-column output."""
    result = copy.deepcopy(data)
    _normalize_dates(result)
    _apply_ats_section_order(result)
    if "customSections" not in result:
        result["customSections"] = {}
    return result
