from pathlib import Path
from time import monotonic
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:8082"
ROOT = Path(__file__).resolve().parents[1]
SKIP_TITLES = {
    "Nhịn thiệt luôn hả",
    "+1 khách quen của bệnh viện",
    "Thôi ăn đi mà",
    "Sắp có bao tử hầm tiêu ăn rồi",
    "Nhịn được nhịn luôn đi nghe",
    "Ai cũng như mày chắc quán xá dẹp hết quá",
}


def goto_app(page, timeout=90000):
    deadline = monotonic() + timeout / 1000
    last_error = None
    while monotonic() < deadline:
        try:
            page.goto(BASE_URL, wait_until="domcontentloaded", timeout=30000)
            return
        except Exception as error:
            last_error = error
            page.wait_for_timeout(1000)
    raise AssertionError(f"Could not open app: {last_error}")


def click_first_quiz_option(page):
    buttons = page.get_by_role("button").all()
    for button in buttons:
        text = button.inner_text(timeout=1000).strip()
        if text and "Quay lại" not in text and "Làm lại" not in text:
            button.click()
            return text
    raise AssertionError("No quiz option button found")


def wait_for_text(page, text, timeout=90000):
    deadline = monotonic() + timeout / 1000
    last_text = ""
    reloaded = False
    while monotonic() < deadline:
        try:
            last_text = page.locator("body").inner_text(timeout=1000)
            if text in last_text:
                return
        except Exception:
            pass
        if not reloaded and not last_text and monotonic() < deadline - 5:
            page.wait_for_timeout(5000)
            try:
                page.reload(wait_until="domcontentloaded", timeout=30000)
            except Exception:
                goto_app(page)
            reloaded = True
        page.wait_for_timeout(250)
    raise AssertionError(f"Text not found: {text}. Body was: {last_text[:500]}")


def click_button(page, label):
    buttons = page.get_by_role("button").all()
    for button in buttons:
        text = button.inner_text(timeout=1000).strip()
        if label in text:
            button.click()
            return
    raise AssertionError(f"Button not found: {label}")


def assert_removed_quiz_ui(text):
    lower = text.lower()
    assert "đang chọn món hợp gu" not in lower
    assert "câu gu vị" not in lower
    assert "đang ưu tiên:" not in lower
    assert "1/10" not in lower


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    console_errors = []
    page.on(
        "console",
        lambda msg: console_errors.append(msg.text)
        if msg.type == "error" and "ERR_CONNECTION_REFUSED" not in msg.text and "ERR_CONNECTION_RESET" not in msg.text
        else None,
    )

    goto_app(page)
    wait_for_text(page, "Ăn hay nhịn?")
    body = page.locator("body").inner_text(timeout=5000)
    assert "Món local" not in body
    assert "Lịch sử" not in body
    page.screenshot(path=str(ROOT / "web-smoke-home.png"), full_page=True)

    click_button(page, "Bắt đầu")
    first_question_body = page.locator("body").inner_text(timeout=5000)
    assert "Câu 1 trong 10" not in first_question_body
    assert_removed_quiz_ui(first_question_body)
    click_button(page, "Nhịn")
    wait_for_text(page, "Chọn lại", timeout=10000)
    skip_body = page.locator("body").inner_text(timeout=5000)
    assert any(title in skip_body for title in SKIP_TITLES)
    assert "Món khác" not in skip_body
    assert "Lưu yêu thích" not in skip_body
    assert "Độ no" not in skip_body
    click_button(page, "Chọn lại")

    click_button(page, "Ăn")
    click_button(page, "Ăn nhà")
    click_button(page, "Món khô")

    locked_craving = False
    for _ in range(24):
        quiz_body = page.locator("body").inner_text(timeout=5000)
        assert "Câu 1 trong 10" not in quiz_body
        assert_removed_quiz_ui(quiz_body)
        if "Món khác" in quiz_body:
            break
        if "Bạn có thèm" in quiz_body and not locked_craving:
            click_button(page, "Có")
            locked_craving = True
        else:
            click_first_quiz_option(page)

    wait_for_text(page, "Món khác", timeout=30000)
    result_body = page.locator("body").inner_text(timeout=5000)
    assert "Giá" not in result_body
    assert "Thời gian" not in result_body
    assert "Tags" not in result_body
    assert "khớp với gu" not in result_body
    click_button(page, "Món khác")
    click_button(page, "Lưu yêu thích")
    wait_for_text(page, "Bỏ lưu", timeout=10000)
    page.screenshot(path=str(ROOT / "web-smoke-result.png"), full_page=True)

    page.reload()
    wait_for_text(page, "Ăn hay nhịn?")
    click_button(page, "Yêu thích")
    wait_for_text(page, "Yêu thích", timeout=10000)

    if console_errors:
        raise AssertionError("\\n".join(console_errors[:5]))

    browser.close()
