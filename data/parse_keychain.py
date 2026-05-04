"""
Parse keychain product data from made-in-china.com HTML file
Output: keychain_products.json
"""

from bs4 import BeautifulSoup
import json
import re


def parse_keychain_html(html_file: str) -> list[dict]:
    with open(html_file, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    products = []

    for item in soup.select(".prod-item"):
        product = {}

        # Title & product URL
        title_tag = item.select_one(".prod-title a")
        if title_tag:
            product["title"] = title_tag.get("title") or title_tag.get_text(strip=True)
            product["url"] = title_tag.get("href", "")

        # Price
        price_tag = item.select_one(".prod-price .price")
        if price_tag:
            product["price"] = price_tag.get_text(strip=True)

        # Price unit (Piece / pieces / etc.)
        price_div = item.select_one(".prod-price")
        if price_div:
            full_price_text = price_div.get_text(strip=True)
            # Extract unit after price, e.g. "US$ 0.1-0.65 / Piece"
            unit_match = re.search(r"/\s*(.+)$", full_price_text)
            product["price_unit"] = unit_match.group(1).strip() if unit_match else ""

        # Min order quantity
        qty_num = item.select_one(".quantity-num")
        qty_label = item.select_one(".quantity-label")
        if qty_num:
            product["min_order"] = qty_num.get_text(strip=True)
            if qty_label:
                product["min_order"] += " " + qty_label.get_text(strip=True)

        # Supplier / company name & URL
        com_tag = item.select_one(".prod-com .com-link")
        if com_tag:
            product["supplier"] = com_tag.get_text(strip=True)
            supplier_href = com_tag.get("href", "")
            if supplier_href.startswith("//"):
                supplier_href = "https:" + supplier_href
            product["supplier_url"] = supplier_href

        # First product image
        img_tag = item.select_one(".img-wrap.swiper-slide-active img, .img-wrap img")
        if img_tag:
            product["image"] = img_tag.get("src") or img_tag.get("data-original", "")

        # Has video?
        product["has_video"] = bool(item.select_one(".has-video-icon"))

        # Sample available?
        ads_data = item.get("ads-data", "")
        product["is_sample"] = "is_sample:1" in ads_data

        if product.get("title"):
            products.append(product)

    return products


if __name__ == "__main__":
    results = parse_keychain_html("keychain.html")
    output_path = "keychain_products.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"Extracted {len(results)} products → {output_path}")
