from __future__ import annotations

import json
import time

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:8082"

SKIP_MESSAGES = {
    "Nhịn thiệt luôn hả": "😳",
    "+1 khách quen của bệnh viện": "🏥",
    "Thôi ăn đi mà": "🥺",
    "Sắp có bao tử hầm tiêu ăn rồi": "🍲",
    "Nhịn được nhịn luôn đi nghe": "😤",
    "Ai cũng như mày chắc quán xá dẹp hết quá": "😂",
    "Cố lên sắp ung thư bao tử gòi": "😵‍💫",
    "Bao tử chắc như tổ ong gòi": "🐝",
    "Cứ vậy hoài Bác Sĩ mau giàu lắm": "🩺",
    "Tính sống tới năm nhiêu tuổi?": "🤨",
    "Rầu hết sức": "😮‍💨",
}

FORBIDDEN_SKIP_TEXT = [
    "Giá",
    "Thời gian",
    "Tags",
    "Độ no",
    "Món khác",
    "Lưu yêu thích",
    "Bỏ lưu",
]


def goto_app(page, timeout: int = 90000) -> None:
    deadline = time.time() + timeout / 1000
    last_error = None

    while time.time() < deadline:
        try:
            page.goto(BASE_URL, wait_until="domcontentloaded", timeout=30000)
            return
        except Exception as error:
            last_error = error
            page.wait_for_timeout(1000)

    raise AssertionError(f"Could not open app: {last_error}")


def wait_for_body_text(page, text: str, timeout: int = 90000) -> str:
    deadline = time.time() + timeout / 1000
    body = ""
    reloaded = False

    while time.time() < deadline:
        try:
            body = page.locator("body").inner_text(timeout=1000)
        except Exception:
            body = ""

        if text in body:
            return body

        if not reloaded and not body and time.time() < deadline - 10:
            page.wait_for_timeout(5000)
            try:
                page.reload(wait_until="domcontentloaded", timeout=30000)
            except Exception:
                goto_app(page)
            reloaded = True

        page.wait_for_timeout(250)

    raise AssertionError(f"Text not found: {text}. Body was: {body[:500]}")


def click_button(page, label: str) -> None:
    for button in page.get_by_role("button").all():
        text = button.inner_text(timeout=1000)

        if label in text:
            button.click()
            return

    raise AssertionError(f"Button not found: {label}")


def matched_skip_title(body: str) -> str:
    for title in SKIP_MESSAGES:
        if title in body:
            return title

    raise AssertionError(f"No skip title found. Body was: {body[:500]}")


def assert_no_mobile_overflow(page) -> None:
    overflow = page.evaluate(
        """() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth"""
    )
    if overflow > 2:
        raise AssertionError(f"Mobile horizontal overflow: {overflow}")


def open_q1(page) -> str:
    goto_app(page)
    wait_for_body_text(page, "Bắt đầu")
    click_button(page, "Bắt đầu")
    body = wait_for_body_text(page, "Ăn hay nhịn?")
    assert "😋" in body and "Ăn" in body
    assert "😭" in body and "Nhịn" in body
    return body


def choose_skip_and_validate(page, *, open_first: bool = True) -> str:
    if open_first:
        open_q1(page)
    click_button(page, "Nhịn")
    body = wait_for_body_text(page, "Chọn lại", timeout=30000)
    title = matched_skip_title(body)
    expected_icon = SKIP_MESSAGES[title]

    assert expected_icon in body
    assert "Ăn nhà hay ăn ngoài?" not in body

    for text in FORBIDDEN_SKIP_TEXT:
        assert text not in body

    assert_no_mobile_overflow(page)
    return title


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    console_messages: list[str] = []

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.on(
        "console",
        lambda msg: console_messages.append(f"{msg.type}: {msg.text}")
        if msg.type in ("warning", "error")
        and "Download the React DevTools" not in msg.text
        and "ERR_CONNECTION_REFUSED" not in msg.text
        and "ERR_CONNECTION_RESET" not in msg.text
        else None,
    )

    seen_titles: list[str] = []
    open_q1(mobile)
    for _ in range(len(SKIP_MESSAGES)):
        title = choose_skip_and_validate(mobile, open_first=False)
        if title in seen_titles[-5:]:
            raise AssertionError(
                f"Skip message repeated inside the last 5 selections: {title}. Seen: {seen_titles}"
            )
        seen_titles.append(title)
        click_button(mobile, "Chọn lại")
        wait_for_body_text(mobile, "Ăn hay nhịn?", timeout=30000)

    assert len(set(seen_titles)) >= min(len(SKIP_MESSAGES), 6)

    click_button(mobile, "Ăn")
    wait_for_body_text(mobile, "Ăn nhà hay ăn ngoài?", timeout=30000)

    desktop = browser.new_page(viewport={"width": 1280, "height": 900})
    desktop_title = choose_skip_and_validate(desktop)

    reset_page = browser.new_page(viewport={"width": 390, "height": 844})
    reset_page.add_init_script("Math.random = () => 0;")
    open_q1(reset_page)
    first_after_load = choose_skip_and_validate(reset_page, open_first=False)
    click_button(reset_page, "Chọn lại")
    wait_for_body_text(reset_page, "Ăn hay nhịn?", timeout=30000)
    second_same_session = choose_skip_and_validate(reset_page, open_first=False)
    assert second_same_session != first_after_load

    reset_page.reload(wait_until="domcontentloaded", timeout=30000)
    open_q1(reset_page)
    first_after_refresh = choose_skip_and_validate(reset_page, open_first=False)
    assert first_after_refresh == first_after_load

    if console_messages:
        raise AssertionError("\n".join(console_messages[:5]))

    print(
        json.dumps(
            {
                "mobile_seen_titles": seen_titles,
                "desktop_title": desktop_title,
                "distinct_mobile_titles": len(set(seen_titles)),
            },
            ensure_ascii=True,
        )
    )

    browser.close()
