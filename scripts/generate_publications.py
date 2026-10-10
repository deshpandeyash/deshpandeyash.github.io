#!/usr/bin/env python3

from __future__ import annotations

import re
import unicodedata
from pathlib import Path

import bibtexparser
import yaml
from pylatexenc.latex2text import LatexNodes2Text


ROOT = Path(__file__).resolve().parents[1]
BIB_PATH = ROOT / "publications.bib"
OVERRIDES_PATH = ROOT / "_data" / "publication_overrides.yml"
RESEARCH_PATH = ROOT / "_data" / "research_directions.yml"
OUTPUT_PATH = ROOT / "_data" / "publications.yml"

latex_to_text = LatexNodes2Text().latex_to_text


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    text = latex_to_text(value)
    return re.sub(r"\s+", " ", text).strip()


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")
    return slug or "publication"


def split_authors(raw_authors: str | None) -> list[str]:
    if not raw_authors:
        return []
    authors = []
    for author in raw_authors.split(" and "):
        text = clean_text(author)
        if "," in text:
            last, first = [part.strip() for part in text.split(",", 1)]
            text = f"{first} {last}".strip()
        authors.append(text)
    return authors


def build_venue(entry: dict[str, str]) -> str:
    base = clean_text(entry.get("booktitle") or entry.get("journal") or entry.get("publisher"))
    parts = [base] if base else []
    volume = clean_text(entry.get("volume"))
    number = clean_text(entry.get("number"))
    pages = clean_text(entry.get("pages"))
    if volume and number:
        parts.append(f"{volume}({number})")
    elif volume:
        parts.append(volume)
    elif number:
        parts.append(number)
    if pages:
        parts.append(f"pp. {pages}" if "-" in pages else pages)
    return ", ".join(part for part in parts if part)


def normalize_name(value: str) -> str:
    return re.sub(r"[^a-z]", "", value.lower())


def generic_summary(title: str, tags: list[str], authorship: str) -> str:
    topic_map = {
        "deterministic-networking": "deterministic networking and latency-aware network behavior",
        "clock-synchronization": "clock synchronization and network timing uncertainty",
        "digital-twins": "digital-twin-driven system modeling and evaluation",
        "tree-splitting-algorithms": "tree-splitting algorithms and scalable contention resolution",
    }
    topics = [topic_map[tag] for tag in tags if tag in topic_map]
    if not topics:
        topics = ["networked systems research"]
    primary_topic = topics[0]
    prefix = "First-authored work on" if authorship == "first-author" else "Co-authored work on"
    return f"{prefix} {primary_topic}."


def main() -> None:
    overrides = yaml.safe_load(OVERRIDES_PATH.read_text()) or {}
    entry_overrides = overrides.get("entries", {})
    directions = yaml.safe_load(RESEARCH_PATH.read_text()) or []
    direction_titles = {direction["id"]: direction["title"] for direction in directions}

    parser = bibtexparser.bparser.BibTexParser(common_strings=True)
    with BIB_PATH.open() as bib_file:
      bibliography = bibtexparser.load(bib_file, parser=parser)

    publications = []
    for entry in bibliography.entries:
        key = entry["ID"]
        override = entry_overrides.get(key, {})
        if override.get("hidden"):
            continue

        title = clean_text(entry.get("title"))
        authors = split_authors(entry.get("author"))
        year = int(clean_text(entry.get("year")) or 0)
        venue = build_venue(entry)
        authorship = "first-author" if authors and normalize_name(authors[0]) == "yashdeshpande" else "co-authored"
        tags = override.get("tags", [])
        links = override.get("links", [])

        publication = {
            "key": key,
            "slug": override.get("slug", slugify(key)),
            "title": title,
            "authors": authors,
            "authors_display": ", ".join(authors),
            "year": year,
            "venue": venue,
            "tags": tags,
            "tag_titles": [direction_titles[tag] for tag in tags if tag in direction_titles],
            "authorship": authorship,
            "authorship_label": "First-authored" if authorship == "first-author" else "Co-authored",
            "summary": override.get("summary", generic_summary(title, tags, authorship)),
            "links": links or [{"label": "Google Scholar", "url": overrides["scholar_profile_url"]}],
        }
        search_text_parts = [
            publication["title"],
            publication["authors_display"],
            publication["venue"],
            " ".join(publication["tag_titles"]),
            publication["authorship_label"],
            publication["summary"],
        ]
        publication["search_text"] = " ".join(part for part in search_text_parts if part)
        publications.append(publication)

    publications.sort(
        key=lambda publication: (
            -publication["year"],
            0 if publication["authorship"] == "first-author" else 1,
            publication["title"].lower(),
        )
    )

    OUTPUT_PATH.write_text(
        yaml.safe_dump(publications, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
