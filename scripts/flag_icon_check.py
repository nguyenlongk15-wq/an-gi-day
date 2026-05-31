from __future__ import annotations

import json
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:8082/"
ROOT = Path(__file__).resolve().parents[1]


def click_button(page, label: str) -> None:
  for button in page.get_by_role("button").all():
    try:
      text = button.inner_text(timeout=1000)
    except Exception:
      continue

    if label in text:
      button.click()
      return

  raise AssertionError(f"button not found: {label}")


def wait_body(page, needle: str, timeout: int = 30000) -> str:
  end = time.time() + timeout / 1000
  body = ""
  reloaded = False

  while time.time() < end:
    try:
      body = page.locator("body").inner_text(timeout=1000)
    except Exception:
      body = ""

    if needle in body:
      return body

    if not reloaded and not body and time.time() < end - 10:
      page.wait_for_timeout(5000)
      page.reload(wait_until="domcontentloaded", timeout=30000)
      reloaded = True

    page.wait_for_timeout(300)

  raise AssertionError(f"text not found {needle}: {body[:200]}")


def click_first_quiz_option(page) -> None:
  for button in page.get_by_role("button").all():
    text = button.inner_text(timeout=1000).strip()

    if text and "Quay lại" not in text and "Làm lại" not in text:
      button.click()
      return

  raise AssertionError("no quiz option")


def reach_vietnam_question(page, viewport_name: str) -> dict[str, object]:
  for attempt in range(12):
    page.goto(BASE_URL, wait_until="domcontentloaded", timeout=60000)
    wait_body(page, "Bắt đầu", 90000)
    click_button(page, "Bắt đầu")
    click_button(page, "Ăn")
    click_button(page, "Ăn ngoài")
    click_button(page, "Món khô")

    for _ in range(10):
      body = page.locator("body").inner_text(timeout=5000)

      if "Muốn món Việt hay nước ngoài?" in body:
        page.wait_for_timeout(800)
        page.screenshot(path=str(ROOT / f"flag-check-{viewport_name}.png"), full_page=True)
        img_count = page.locator('img[src*="vietnam-flag-icon"]').count()

        return {
          "attempt": attempt + 1,
          "img_count": img_count,
          "vn_text": "VN" in body,
          "body": body[:500],
        }

      click_first_quiz_option(page)

  raise AssertionError("Vietnam question not reached after retries")


with sync_playwright() as p:
  browser = p.chromium.launch(headless=True)
  results = []

  for name, viewport in [
    ("mobile", {"width": 390, "height": 844}),
    ("desktop", {"width": 1280, "height": 900}),
  ]:
    page = browser.new_page(viewport=viewport)
    logs: list[tuple[str, str]] = []
    page.on("console", lambda msg: logs.append((msg.type, msg.text)))
    result = reach_vietnam_question(page, name)
    result["warnings"] = [
      text
      for kind, text in logs
      if kind in ("warning", "error")
      and "Download the React DevTools" not in text
      and "ERR_CONNECTION_REFUSED" not in text
    ]
    results.append((name, result))
    page.close()

  (ROOT / "flag-check-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
  print(json.dumps(results, ensure_ascii=True))
  browser.close()
