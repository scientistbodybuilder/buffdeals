from selenium import webdriver
import re
# import undetected_chromedriver as uc
# from webdriver_manager.firefox import GeckoDriverManager
# from selenium.webdriver.firefox.service import Service
# from selenium.webdriver.firefox.options import Options

from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time as tm, os, subprocess
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import StaleElementReferenceException

if __name__ == "__main__":
    # BEGIN SCRAPPING
    service = Service(ChromeDriverManager().install())
    options = Options()
    #options.add_argument(f'--proxy-server=={}')
    # options.add_argument(r'--user-data-dir=C:\Users\ser\AppData\Local\Google\Chrome\User Data\Default')
    options.add_argument("--window-size=2560,1600")
    driver = webdriver.Chrome(service=service, options=options)
    urls = ['https://ca.myprotein.com/','https://revolution-nutrition.com/','https://www.costco.ca/']
    finds = []
    timeout = 30
    print('MY PROTEIN\n')
    driver.get(urls[0])
    search_bar = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[id='search-input']")))
    search_bar.clear()
    search_bar.send_keys('whey protein')
    search_btn = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.search-container.relative.flex-grow button[type='submit']"))).click()

    print('beginning iteration')
    #need to iterate over search results that match a pattern. Then repeat a process
    container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH,"//product-list[@id='product-list-wrapper']/product-card-wrapper")))
    print(f'There are {len(container)} products')
    

    for i in range(len(container)):
        container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH,"//product-list[@id='product-list-wrapper']/product-card-wrapper")))
        try:
            product = container[i].find_element(By.XPATH,'.//a')
        except StaleElementReferenceException as e:
            print("Stale Element Exception Occured: Retrying")
            tm.sleep(2)
            product = container[i].find_element(By.XPATH,'.//a')

        product_url = product.get_attribute("href")
        print(f'product_url: {product_url}')

        product_title = product.get_attribute('data-title')
        print(f'product name: {product_title}')

        if re.search(r'.*whey.*(protein)*.*',product_title.lower()):
            driver.get(product_url)
            find = {'name':product_title}
            sizes = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//ul[@class='elements-variations-buttons-wrapper']/li")))
            print(f'There are {len(sizes)} sizes')
            # add logic to check whether there is more than one size. If there is more than one flavour, always click chocolate click, so that all sizes are available
            product_sizes = []

            for i in range(len(sizes)):
                # click that size
                try:
                    size_btn = WebDriverWait(driver,timeout).until(EC.element_to_be_clickable((By.XPATH, f"(//ul[@class='elements-variations-buttons-wrapper']/li)[{i+1}]")))
                    driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", size_btn )
                    print('attemp click')
                    size_btn.click()
                    product_size = size_btn.text
                except StaleElementReferenceException as e:
                    print('Stale Element Exception Occured: Retrying')
                    tm.sleep(2)
                    size_btn = WebDriverWait(driver,timeout).until(EC.element_to_be_clickable((By.XPATH, f"(//ul[@class='elements-variations-buttons-wrapper']/li)[{i+1}]")))
                    driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", size_btn)
                    size_btn.click()
                    product_size = size_btn.text

                try:
                    product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//div[@id='price-wrapper']/div/div/span"))).text
                except StaleElementReferenceException as e:
                    print('Stale Element Exception Occured: Retrying')
                    tm.sleep(2)
                    product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//div[@id='price-wrapper']/div/div/span"))).text

                print(f'size: {product_size}')
                print(f'price: {product_price}')
                product_sizes.append({
                    'size':product_size,
                    'price':product_price
                })
            find['sizes'] = product_sizes
            find['href'] = product_url
            finds.append(find)
            driver.back()

    print('\nREVOLUTION NUTRITION\n')
    driver.get(urls[1])
    search_bar  = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[id='search-input-desktop']")))
    search_bar.clear()
    search_bar.send_keys('whey protein')
    search_btn = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[aria-label='search button']"))).click()

    print('beginning iteration')

    container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, ".//ul[@id='product-blocks']/li")))
    print(f'There are {len(container)} products')
    for i in range(len(container)):
        container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, ".//ul[@id='product-blocks']/li")))
        # get the product name and url to it's page
        try:
            product_href = container[i].find_element(By.XPATH, './/a').get_attribute("href")
            product_title = container[i].find_element(By.XPATH, ".//a/div/h2/span").text
        except StaleElementReferenceException as e:
            print('Stale Element Exception Occured: Retrying')
            tm.sleep(2)
            product_href = container[i].find_element(By.XPATH, './/a').get_attribute("href")
            product_title = container[i].find_element(By.XPATH, ".//a/div/h2/span").text

        print(f'title: {product_title}')

        if re.search(r'.*whey.*(protein)*.*',product_title.lower()):
            driver.get(product_href)
            find = {'name':product_title}
            # get the size and price, for all possible sizes
            sizes = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//ul[@class='flex items-center variable-items']/li")))
            print(f'There are {len(sizes)} sizes')
            # add logic to check whether there is more than one size. If there is more than one flavour, always click chocolate click, so that all sizes are available
            product_sizes = []
            

            for i in range(len(sizes)):
                # click that size
                try:
                    size_btn = WebDriverWait(driver,timeout).until(EC.element_to_be_clickable((By.XPATH, f"(//ul[@class='flex items-center variable-items']/li)[{i+1}]")))
                    driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", size_btn )
                    print('attemp click')
                    size_btn.click()
                    product_size = size_btn.text
                except StaleElementReferenceException as e:
                    print('Stale Element Exception Occured: Retrying')
                    tm.sleep(2)
                    size_btn = WebDriverWait(driver,timeout).until(EC.element_to_be_clickable((By.XPATH, f"(//ul[@class='flex items-center variable-items']/li)[{i+1}]")))
                    driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", size_btn)

                    size_btn.click()
                    product_size = size_btn.text
                
                # there is variation price (regular price), and sometimes variation sale price, which is discounted. check whether discounted price exists, if it does take
                # that instead
                try:
                    product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@id='variation-sale-price']"))).text
                except:
                    product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@id='variation-price']"))).text
                
                print(f'size: {product_size}')
                print(f'price: {product_price}')
                product_sizes.append({
                    'size':product_size,
                    'price':product_price
                })
            find['sizes'] = product_sizes
            find['href'] = product_href
            finds.append(find)
            driver.back()

      

    print('\nCOSTCO\n')
    driver.get(urls[2])
    #set language
    print('searching')
    search_bar  = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Search Costco']")))
    search_bar.clear()
    search_bar.send_keys('whey protein')
    search_btn = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[aria-label='Search']"))).click()

    print('beginning iteration')

    container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//div[@id='productList']/div/div/a")))
    print(f'There are {len(container)} products')
    
    for i in range(len(container)):
        print(i)
        container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//div[@id='productList']/div/div/a")))
        
        # get the product name and url to it's page
        try:
            product_href = container[i].get_attribute("href")
            product_title = container[i].find_element(By.XPATH, ".//span").text
        except StaleElementReferenceException as e:
            print(f'Stale Element Exception Occured: Retrying')
            tm.sleep(2)
            product_href = container[i].get_attribute("href")
            product_title = container[i].find_element(By.XPATH, ".//span").text

        print(f'title: {product_title}')

        if re.search(r'.*whey.*(protein)*.*',product_title.lower()):
            driver.get(product_href)
            tm.sleep(1)
            find = {'name':product_title}
            product_sizes=[]
            wait2 = WebDriverWait(driver,timeout)
            # get the size and price, for all possible sizes
            product_price = wait2.until(EC.presence_of_element_located((By.XPATH, "//span[@class='value canada-currency-size']"))).text
            product_size = wait2.until(EC.presence_of_all_elements_located((By.XPATH, "//ul[@class='pdp-features']/li")))
            product_size = product_size[0].text

            print(f'size: {product_size}')
            print(f'price: {product_price}')
            product_sizes.append({
                'size':product_size,
                'price':product_price
            })
            find['sizes'] = product_sizes
            find['href'] = product_href
            finds.append(find)
            driver.back()

            

    print(f'finds: {finds}')
    # with open('output.txt') as file:
    #     file.write()
    #end driver
    print('quit driver')
    driver.quit()