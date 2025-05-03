from selenium import webdriver
import re
# import undetected_chromedriver as uc
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
import time as tm, os, subprocess
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

if __name__ == "__main__":
    # BEGIN SCRAPPING
    service = Service(GeckoDriverManager().install())
    options = Options()
    #options.add_argument(f'--proxy-server=={}')
    # options.add_argument(r'--user-data-dir=C:\Users\ser\AppData\Local\Google\Chrome\User Data\Default')

    driver = webdriver.Firefox(service=service, options=options)
    urls = ['https://ca.myprotein.com/','https://revolution-nutrition.com/','https://www.costco.ca/']
    finds = []

    print('MY PROTEIN')
    # driver.get(urls[0])
    # tm.sleep(1)
    # search_bar = driver.find_element(By.CSS_SELECTOR, "input[id='search-input']")
    # search_bar.clear()
    # search_bar.send_keys('whey protein')
    # search_btn = driver.find_element(By.CSS_SELECTOR, "div.search-container.relative.flex-grow button[type='submit']").click()

    # tm.sleep(1)

    # print('beginning iteration')
    # #need to iterate over search results that match a pattern. Then repeat a process
    # container = driver.find_elements(By.XPATH,"//product-list[@id='product-list-wrapper']")
    # print(f'container: {container}')
    # container = driver.find_elements(By.XPATH,"//div[@id='product-list']")
    # print(f'container: {container}')


    # for item in container:
    #     product = item.find_element(By.XPATH,'.//a')
    #     html = product.get_attribute("outerHTML")
    #     href = html.split()
    #     print(f'href: {href}')
    #     product_url_pattern = r'/p/.*/.*/.*/'
    #     product_url = re.findall(product_url_pattern,href[1])[0]
    #     print(f'product_url: {product_url}')

    #     product_name = html.split('data')[3].strip('-title="').strip()[:-1]
    #     print(f'product name: {product_name}')

    print('REVOLUTION NUTRITION')
    # driver.get(urls[1])
    # tm.sleep(1)
    # search_bar  = driver.find_element(By.CSS_SELECTOR, "input[id='search-input-desktop']")
    # search_bar.clear()
    # search_bar.send_keys('whey protein')
    # search_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label='search button']").click()

    # tm.sleep(1)
    # print('beginning iteration')

    # container = driver.find_elements(By.XPATH, ".//ul[@id='product-blocks']/li")
    # # print(f'container: {container}')
    # for i in range(len(container)):
    #     container = driver.find_elements(By.XPATH, ".//ul[@id='product-blocks']/li")
    #     # get the product name and url to it's page
    #     product_href = container[i].find_element(By.XPATH, './/a').get_attribute("href")
    #     product_title = container[i].find_element(By.XPATH, ".//a/div/h2/span").text
    #     print(f'title: {product_title}')

    #     if re.search(r'.*whey.*(protein)*.*',product_title.lower()):
    #         driver.get(product_href)
    #         tm.sleep(1)
    #         find = {'name':product_title}
    #         # get the size and price, for all possible sizes
    #         sizes = driver.find_elements(By.XPATH, "//ul[@class='flex items-center variable-items']")
    #         product_sizes = []
    #         for size in sizes:
    #             # click that size
    #             size.click()
    #             tm.sleep(0.3)
    #             # get the information
    #             product_size = size.text
    #             # there is variation price (regular price), and sometimes variation sale price, which is discounted. check whether discounted price exists, if it does take
    #             # that instead
    #             try:
    #                 product_price = driver.find_element(By.XPATH, ".//span[@id='variation-sale-price']").text
    #             except Exception as e:
    #                 product_price = driver.find_element(By.XPATH, ".//span[@id='variation-price']").text
                
    #             print(f'size: {product_size}')
    #             print(f'price: {product_price}')
    #             product_sizes.append({
    #                 'size':product_size,
    #                 'price':product_price
    #             })
    #         find['sizes'] = product_sizes
    #         find['href'] = product_href
    #         finds.append(find)
    #         driver.back()
                
    print('COSTCO')
    driver.get(urls[2])
    tm.sleep(1)
    
    tm.sleep(0.5)
    print('searching')
    search_bar  = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Search Costco']")
    search_bar.clear()
    search_bar.send_keys('whey protein')
    search_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Search']").click()

    tm.sleep(1)
    print('beginning iteration')

    container = driver.find_elements(By.XPATH, ".//div[@id='productList']/div")
    print(container)
    for i in range(len(container)):
        container = driver.find_elements(By.XPATH, ".//div[@id='productList']/div")
        tm.sleep(1)
        # get the product name and url to it's page
        product_href = container[i].find_element(By.XPATH, './/a').get_attribute("href")
        product_title = container[i].find_element(By.XPATH, ".//a/span").text
        print(f'title: {product_title}')

        if re.search(r'.*whey.*(protein)*.*',product_title.lower()):
            driver.get(product_href)
            tm.sleep(1)
            find = {'name':product_title}
            product_sizes=[]
            # get the size and price, for all possible sizes
            product_price = driver.find_element(By.XPATH, ".//span[@class='value canada-currency-size']").text
            product_info = driver.find_elements(By.XPATH, ".//ul[@class='pdp-features']/li")
            product_size = product_info[0]

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
    #end driver
    print('quit driver')
    driver.quit()