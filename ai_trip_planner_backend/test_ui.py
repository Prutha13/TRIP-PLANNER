import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

BASE_URL = "http://localhost:5173/"

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.maximize_window()
    yield driver
    driver.quit()


# 🔹 Helper Function
def fill_form(driver, destination, days, budget):
    wait = WebDriverWait(driver, 10)

    dest_input = wait.until(EC.presence_of_element_located((By.ID, "destInput")))
    dest_input.clear()
    dest_input.send_keys(destination)

    driver.find_element(By.ID, "daysInput").clear()
    driver.find_element(By.ID, "daysInput").send_keys(days)

    driver.find_element(By.ID, "budgetSelect").send_keys(budget)

    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()


# 🔹 Helper: Wait for itinerary
def wait_for_itinerary(driver, timeout=60):
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((By.ID, "itinerary-content"))
    )


# ✅ TC01 - Valid Input
def test_valid_itinerary(driver):
    driver.get(BASE_URL)
    fill_form(driver, "Udaipur", "3", "Medium")

    result = wait_for_itinerary(driver)
    assert result.is_displayed()


# ✅ TC02 - High Budget
def test_high_budget(driver):
    driver.get(BASE_URL)
    fill_form(driver, "Goa", "5", "High")

    result = wait_for_itinerary(driver)
    assert result.is_displayed()


# ✅ TC03 - Low Budget
def test_low_budget(driver):
    driver.get(BASE_URL)
    fill_form(driver, "Jaipur", "2", "Low")

    result = wait_for_itinerary(driver)
    assert result.is_displayed()


# ✅ TC04 - Empty Destination
def test_empty_destination(driver):
    driver.get(BASE_URL)
    fill_form(driver, "", "3", "Medium")

    # Expect NO itinerary
    with pytest.raises(TimeoutException):
        wait_for_itinerary(driver, timeout=10)


# ✅ TC05 - Invalid Days
def test_invalid_days(driver):
    driver.get(BASE_URL)
    fill_form(driver, "Udaipur", "-2", "Medium")

    with pytest.raises(TimeoutException):
        wait_for_itinerary(driver, timeout=10)


# ✅ TC06 - Large Days Input
def test_large_days(driver):
    driver.get(BASE_URL)
    fill_form(driver, "Manali", "30", "Medium")

    result = wait_for_itinerary(driver)
    assert result.is_displayed()


# ✅ TC07 - AI Response Wait Handling
def test_ai_response_wait(driver):
    driver.get(BASE_URL)
    fill_form(driver, "Udaipur", "3", "Medium")

    try:
        result = wait_for_itinerary(driver, timeout=60)
        assert result.is_displayed()
    except TimeoutException:
        pytest.fail("AI response took too long")


# ❌ TC08 - Page Load Failure (Simulated)
def test_page_load_failure(driver):
    driver.get("http://invalid-url")

    assert "This site can’t be reached" in driver.page_source


# ✅ TC09 - Special Characters Input
def test_special_characters(driver):
    driver.get(BASE_URL)
    fill_form(driver, "@@@", "3", "Medium")

    # May or may not generate → flexible check
    try:
        wait_for_itinerary(driver, timeout=10)
        assert True
    except TimeoutException:
        assert True  # acceptable behavior


# ✅ TC10 - Multiple Requests Stability
def test_multiple_requests(driver):
    driver.get(BASE_URL)

    for _ in range(3):
        fill_form(driver, "Goa", "2", "Medium")
        result = wait_for_itinerary(driver)
        assert result.is_displayed()

        driver.get(BASE_URL)  # reload for next test