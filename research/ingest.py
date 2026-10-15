#!/usr/bin/env python3
"""Minimal dependency-free public-source research collector. No autonomous publishing."""
import argparse
import datetime as dt
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.hidden = 0
    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "nav", "footer"):
            self.hidden += 1
    def handle_endtag(self, tag):
        if tag in ("script", "style", "nav", "footer"):
            self.hidden = max(0, self.hidden - 1)
    def handle_data(self, text):
        if not self.hidden:
            self.parts.append(text)

def get(url):
    request = urllib.request.Request(url, headers={"User-Agent": "JapanHealthResearch/0.1 (+public information research; low rate)"})
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read(1_500_000), response.headers.get_content_type()

def main():
    parser = argparse.ArgumentParser()
    choices = parser.add_mutually_exclusive_group(required=True)
    choices.add_argument("--source", help="ID in sources.json")
    choices.add_argument("--pubmed", help="PubMed literature search query")
    parser.add_argument("--out", required=True, help="Local JSON output file")
    args = parser.parse_args()
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    if args.source:
        registry = json.loads((Path(__file__).parent / "sources.json").read_text())
        if args.source not in registry:
            parser.error("Unknown source ID")
        record = registry[args.source]
        content, content_type = get(record["url"])
        if content_type != "text/html":
            parser.error("Only HTML sources supported in prototype; use official downloadable data for others")
        parser_html = VisibleText()
        parser_html.feed(content.decode("utf-8", "replace"))
        text = re.sub(r"\s+", " ", html.unescape(" ".join(parser_html.parts))).strip()[:12000]
        output = {"type": "source-snapshot", "registry_id": args.source, "source": record, "retrieved_at": now, "published_at": None, "effective_from": None, "effective_to": None, "text_excerpt": text, "review_status": "unreviewed"}
    else:
        endpoint = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        query = urllib.parse.urlencode({"db":"pubmed","term": args.pubmed,"retmax": 12,"sort":"pub_date","tool":"japan_health_research"})
        content, _ = get(endpoint + "?" + query)
        root = ET.fromstring(content)
        pmids = [element.text for element in root.findall(".//IdList/Id")]
        output = {"type":"pubmed-search","query":args.pubmed,"retrieved_at":now,"pmids":pmids,"url":endpoint+"?"+query,"review_status":"unreviewed"}
    dest = Path(args.out)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(output,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Wrote",dest,"(unreviewed, not for direct publication)")

if __name__ == "__main__":
    main()
