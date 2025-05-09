from flask import Flask, request
from selenium import webdriver
import re
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time as tm, os, subprocess
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException

app = Flask(__name__)

def scrape(supplement,weight,max_price,min_price,vegan,isolate):
    service = Service(ChromeDriverManager().install())
    options = Options()
    #options.add_argument(f'--proxy-server=={}')
    # options.add_argument(r'--user-data-dir=C:\Users\ser\AppData\Local\Google\Chrome\User Data\Default')
    options.add_argument("--window-size=2560,1600")
    options.add_argument('--log-level=1')
    driver = webdriver.Chrome(service=service, options=options)
    urls = ['https://ca.myprotein.com/','https://revolution-nutrition.com/','https://www.costco.ca/','https://canadianprotein.com/search']
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
                    price_element = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//div[@id='product-price']/div[@id='price-wrapper']/div/div/span")))
                    product_price = price_element.text
                except StaleElementReferenceException as e:
                    print('Stale Element Exception Occured: Retrying')
                    tm.sleep(2)
                    price_element = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//div[@id='product-price']/div[@id='price-wrapper']/div/div/span")))
                    product_price = price_element.text

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
                    price_element = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@id='variation-sale-price']")))
                    product_price = price_element.text
                except StaleElementReferenceException as e:
                    print('Stale Element Exception Occured: Retrying')
                    tm.sleep(2)
                    price_element = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@id='variation-sale-price']")))
                    product_price = price_element.text
                if not product_price:
                    try:
                        price_element = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@id='variation-price']")))
                        product_price = price_element.text
                    except StaleElementReferenceException as e:
                        print('Stale Element Exception Occured: Retrying')
                        tm.sleep(2)
                        price_element = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@id='variation-price']")))
                        product_price = price_element.text
                
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




    print('\nCANADIAN PROTEIN\n')
    driver.get(urls[3])
    #set language
    print('searching')
    search_bar  = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Search']")))
    search_bar.clear()
    search_bar.send_keys('whey protein')
    search_bar.send_keys(Keys.RETURN)
    #page iteration
    page_num = 1
    while True:
        print(f'page: {page_num}')
        print('beginning iteration')
        try:
            container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//div[@class='hdt-shop-content']/hdt-reval-items/hdt-card-product")))
            print(f'There are {len(container)} products')
        except TimeoutException as e:
            print('Page has no products')
            break

        for i in range(len(container)):
            container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//div[@class='hdt-shop-content']/hdt-reval-items/hdt-card-product")))
            
            # get the product name and url to it's page
            try:
                product = container[i].find_element(By.XPATH, ".//div[@class='hdt-card-product__wrapper']/div[contains(concat(' ', @class, ' '), ' hdt-card-product__info ')]")
                product_href = product.find_element(By.XPATH, ".//a").get_attribute("href")
                html = product.find_element(By.XPATH, ".//a").get_attribute("outerHTML")
                product_title = html.split('>')[1][:-3]
            except StaleElementReferenceException as e:
                print(f'Stale Element Exception Occured: Retrying')
                tm.sleep(2)
                product = container[i].find_element(By.XPATH, ".//div[@class='hdt-card-product__wrapper']/div[contains(concat(' ', @class, ' '), ' hdt-card-product__info ')]")
                product_href = product.find_element(By.XPATH, ".//a").get_attribute("href")
                html = product.find_element(By.XPATH, ".//a").get_attribute("outerHTML")
                product_title = html.split('>')[1][:-3]
            print(f'product href: {product_href}')
            print(f'product title: {product_title}')

            if re.search(r'.*whey.*(protein)*.*',product_title.lower()):
                driver.get(product_href)
                find = {'name':product_title}
                product_sizes=[]

                try:
                    inputs = driver.find_elements(By.XPATH, "//fieldset[@data-index='0']/div[@class='hdt-product-form__values']/input")
                    if inputs and inputs[0].get_attribute('name') == 'Protein Size':
                        sizes = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//fieldset[@data-index='0']/div[@class='hdt-product-form__values']/label")))
                        # check whether the input elements contained in the container have an attribute name='Protein Size'. If it is 'Protein Flavour', that is incorrect
                        print(f'There are {len(sizes)} sizes')
                        for i in range(len(sizes)):
                            try:
                                size_btn = WebDriverWait(driver,timeout).until(EC.element_to_be_clickable((By.XPATH, f"(//fieldset[@data-index='0']/div[@class='hdt-product-form__values']/label)[{i+1}]")))
                                size_btn.click()
                                product_size = size_btn.text
                            except StaleElementReferenceException as e:
                                print('Stale Element Exception Occured: Retrying')
                                tm.sleep(2)
                                size_btn = WebDriverWait(driver,timeout).until(EC.element_to_be_clickable((By.XPATH, f"(//fieldset[@data-index='0']/div[@class='hdt-product-form__values']/label)[{i+1}]")))
                                size_btn.click()
                                product_size = size_btn.text

                            try:
                                product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//span[@class='money']"))).text
                            except StaleElementReferenceException as e:
                                print('Stale Element Exception Occured: Retrying')
                                tm.sleep(2)
                                product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//span[@class='money']"))).text


                            print(f'size: {product_size}')
                            print(f'price: {product_price}')
                            product_sizes.append({
                                'size':product_size,
                                'price':product_price
                            })
                        find['sizes'] = product_sizes
                        find['href'] = product_href
                    else:
                        #raise my own Exception
                        raise TimeoutException
                     
                except TimeoutException as e:
                    # There are no sizes (a different type of product)
                    print('There are no sizes for this product')
                    product_size = ''
                    try:
                        product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//span[@class='money']"))).text
                    except StaleElementReferenceException as e:
                        print('Stale Element Exception Occured: Retrying')
                        tm.sleep(2)
                        product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//span[@class='money']"))).text
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

        #check whether there is another page
        #scroll to bottom

        #get li
        page_list = WebDriverWait(driver,timeout).until(EC.visibility_of_all_elements_located((By.XPATH, "//nav[@class='hdt-pagination']/ul[@role='list']/li")))
        #check whether the last li is a 'Next Page' button
        last_btn = WebDriverWait(driver,timeout).until(EC.element_to_be_clickable((By.XPATH, f"(//nav[@class='hdt-pagination']/ul[@role='list']/li)[{len(page_list)}]")))
        next = last_btn.find_element(By.XPATH, ".//a")
        if next.get_attribute('aria-label') == 'Next page':
            print('\nNext Page\n')
            page_num+=1
            driver.get(next.get_attribute('href'))
        else:
            print('We have reached the end of the last page')
            break


    print('\n\n\n')
    print(f'scraped {len(finds)} products')
    print(f'finds: {finds}')
    
    # with open('output.txt') as file:
    #     file.write()
    #end driver
    print('quit driver')
    driver.quit()

    return finds


@app.route('/')
def main():
    pass

@app.route('/get-supplement',methods=['POST'])
def get_supplements():
    if request.method=="POST":
        print('beginning scraping')
     
        
        search_supplement = request.form['supplement']
        search_weight = request.form['weight']
        max_price = request.form['max-price']
        min_price = request.form['min-price']
        vegan = request.form['vegan']
        isolate = request.form['isolate']


        result = scrape(search_supplement,search_weight,max_price,min_price,vegan,isolate)
        return result

if __name__ == '__main__':
    app.run(debug=True)
    print('server is running')