from datetime import datetime, timezone
from flask import Flask, request, jsonify
from selenium import webdriver
import re, io
from PIL import Image
import requests

# db
# from flask_sqlalchemy import SQLAlchemy
from supabase import create_client
# scrap
from flask_cors import CORS
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time as tm, os, subprocess
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException, NoSuchElementException, ElementNotInteractableException

# app = Flask(__name__)
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

# CORS(app, origins=["http://localhost:5173"], resources={r'/get-supplement': {'origins':'*'}})

def num_products(products):
    count = 0
    for product in products:
        count += len(product['sizes'])
    return count

def extract_num(text):
    value =  ''.join([x for x in text if (x.isdigit() or x == '.')])
    if value:
        return float(value)
    return 1.0

def getImg(url,file_path):
    try:
        print(f'getting image from {url}')
        im = Image.open(requests.get(url, stream=True).raw)
        im.resize((160,300))
        buffer = io.BytesIO()

        im.save(buffer, 
            format='WebP',  # ← This converts it to WebP
            quality=85,
            optimize=True)
        
        buffer.seek(0)
        
        # Upload buffer content directly
        result = supabase.storage.from_('product-images').upload(
            path=file_path,
            file=buffer.getvalue(),  # Get bytes from buffer
            file_options={
                'content-type': 'image/webp',
                'cache-control': '3600',
                'upsert': 'true'
            }
        )
        print('success', result)
    except Exception as e:
        print(f'Exception uploading img to Storage\n Exception: {e}\n Path: {file_path}')


def scrape(supplement):
    search_supplement = supplement.strip().split()
    pattern = r'.*' + r'.*'.join(search_supplement) + r'.*'
    print(f'search pattern: {pattern}')

    service = Service(ChromeDriverManager().install())
    options = Options()
    #options.add_argument(f'--proxy-server=={}')
    # options.add_argument(r'--user-data-dir=C:\Users\ser\AppData\Local\Google\Chrome\User Data\Default')
    options.add_argument("--window-size=2560,1600")
    options.add_argument('--log-level=1')
    options.add_argument("--headerless=new")
    options.add_argument("--disable-background-networking")
    options.add_argument("--disable-background-timer-throttling")
    options.add_argument("--disable-backgrounding-occluded-windows")
    options.add_argument("--disable-sync")
    options.add_argument("--disable-features=TranslateUI")
    options.add_argument("--disable-ipc-flooding-protection")
    options.add_argument("--no-first-run")
    options.add_argument("--no-service-autorun")
    driver = webdriver.Chrome(service=service, options=options)
    urls = ['https://ca.myprotein.com/','https://revolution-nutrition.com/','https://www.costco.ca/','https://canadianprotein.com/search']
    finds = []
    timeout = 30
    errors = 0
    print('\nREVOLUTION NUTRITION\n')
    driver.get(urls[1])
    search_bar  = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[id='search-input-desktop']")))
    search_bar.clear()
    search_bar.send_keys(supplement)
    search_btn = WebDriverWait(driver,timeout).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='search button']"))).click()


    print('beginning iteration')
    tm.sleep(2)
    try:
        WebDriverWait(driver,timeout=15).until(EC.element_to_be_clickable((By.XPATH, "//div[@id='overlayContainer']/div/div/button[@id='closeIconContainer']"))).click()
        print('pop-up closed')
    except (NoSuchElementException, ElementNotInteractableException,TimeoutException):
        print('no pop-up detected')
        pass

    container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//ul[@id='product-blocks']/li")))
    len_container = len(container)
    print(f'There are {len_container} products')
    for i in range(len_container):
        container = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//ul[@id='product-blocks']/li")))
        # get the product name and url to it's page
        try:
            product_href = container[i].find_element(By.XPATH, './/a').get_attribute("href")
            # product_title = container[i].find_element(By.XPATH, ".//a/div/h2/span").text
            product_h2 = container[i].find_element(By.XPATH, ".//a/div/h2")
            inner_spans = product_h2.find_elements(By.XPATH, './span')
            product_title = ''
            for span in inner_spans:
                product_title += span.text + ' '
            product_title = product_title.strip()

            # get img
            img_url = container[i].find_element(By.XPATH, './/a/img').get_attribute("src")
            getImg(img_url, f'revolution_nutrition/{product_title[:30].strip().replace(" ","_")}.webp')

        except StaleElementReferenceException as e:
            print('Stale Element Exception Occured: Retrying')
            tm.sleep(2)
            product_href = container[i].find_element(By.XPATH, './/a').get_attribute("href")
            # product_title = container[i].find_element(By.XPATH, ".//a/div/h2/span").text
            product_h2 = container[i].find_element(By.XPATH, ".//a/div/h2")
            inner_spans = product_h2.find_elements(By.XPATH, './span')
            product_title = ''
            for span in inner_spans:
                product_title += span.text + ' '
            product_title = product_title.strip()

            img_url = container[i].find_element(By.XPATH, './/a/img').get_attribute("src")
            getImg(img_url, f'revolution_nutrition/{product_title[:30].strip().replace(" ","_")}.webp')


        
        print('checking if product name matches')
        if re.search(rf'{pattern}',product_title.lower()):
            driver.get(product_href)
            print(f'title: {product_title}')
            find = {'name':product_title}
            find['brand'] = 'Revolution Nutrition'
            # get the size and price, for all possible sizes
            try:
                sizes = WebDriverWait(driver,timeout).until(EC.presence_of_all_elements_located((By.XPATH, "//ul[@class='flex items-center variable-items']/li")))
            except Exception as e:
                sizes = None
            if sizes:
                len_sizes = len(sizes)
                print(f'There are {len_sizes} sizes')
                # add logic to check whether there is more than one size. If there is more than one flavour, always click chocolate click, so that all sizes are available
                product_sizes = []
                

                for i in range(len_sizes):
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
                    except Exception as e:
                        print('Exception Occured')
                        print(e)
                        errors+=1
                        continue
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
                    except Exception as e:
                        print('Exception Occured')
                        print(e)
                        errors+=1
                        continue
                    if not product_price:
                        try:
                            price_element = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@id='variation-price']")))
                            product_price = price_element.text
                        except StaleElementReferenceException as e:
                            print('Stale Element Exception Occured: Retrying')
                            tm.sleep(2)
                            price_element = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@id='variation-price']")))
                            product_price = price_element.text
                        except Exception as e:
                            print('Exception Occured')
                            print(e)
                            errors+=1
                            continue
                        
                    
                    print(f'size: {product_size}')
                    print(f'price: {product_price}')
                    product_sizes.append({
                        'size':product_size,
                        'price':product_price,
                        'value': extract_num(product_size) / extract_num(product_price),
                        'vegan': True if product_title.lower().find('vegan') != -1 else False,
                    })
            else:
                size = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, ".//span[@class='capitalize inline']"))).text
                product_sizes = [{'size': size, 'price': product_price, 'value': ''}]

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
    search_bar.send_keys(supplement)
    search_bar.send_keys(Keys.RETURN)

    #pop up
    
    #page iteration
    page_num = 1
    while True:
        print(f'page: {page_num}')
        print('beginning iteration')
        tm.sleep(2)
        

        
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
                media = container[i].find_element(By.XPATH, ".//div[@class='hdt-card-product__wrapper']/div[contains(concat(' ', @class, ' '), ' hdt-card-product__media ')]")
                product_href = product.find_element(By.XPATH, ".//a").get_attribute("href")
                html = product.find_element(By.XPATH, ".//a").get_attribute("outerHTML")
                product_title = html.split('>')[1][:-3]
                img_ref = media.find_element(By.XPATH, ".//a/img").get_attribute("src")
                getImg(img_ref, f'canadian_protein/{product_title[:30].strip().replace(" ","_")}.webp')
            except StaleElementReferenceException as e:
                print(f'Stale Element Exception Occured: Retrying')
                tm.sleep(2)
                product = container[i].find_element(By.XPATH, ".//div[@class='hdt-card-product__wrapper']/div[contains(concat(' ', @class, ' '), ' hdt-card-product__info ')]")
                media = container[i].find_element(By.XPATH, ".//div[@class='hdt-card-product__wrapper']/div[contains(concat(' ', @class, ' '), ' hdt-card-product__media ')]")
                product_href = product.find_element(By.XPATH, ".//a").get_attribute("href")
                html = product.find_element(By.XPATH, ".//a").get_attribute("outerHTML")
                product_title = html.split('>')[1][:-3]
                img_ref = media.find_element(By.XPATH, ".//a/img").get_attribute("src")
                getImg(img_ref, f'canadian_protein/{product_title[:30].strip().replace(" ","_")}.webp')
            except Exception as e:
                print('Exception Occured')
                print(e)
                errors+=1
                continue
            
# and (not vegan or (vegan and product_title.lower().find('vegan') != -1)) and (not isolate or (isolate and product_title.lower().find('isolate') != -1)
            if re.search(rf'{pattern}',product_title.lower()):
                driver.get(product_href)
                print(f'product href: {product_href}')
                print(f'product title: {product_title}')
                find = {'name':product_title}
                find['brand'] = 'Canadian Protein'
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
                            except Exception as e:
                                print('Exception Occured')
                                print(e)
                                errors+=1
                                continue

                            try:
                                product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//span[@class='money']"))).text
                            except StaleElementReferenceException as e:
                                print('Stale Element Exception Occured: Retrying')
                                tm.sleep(2)
                                product_price = WebDriverWait(driver,timeout).until(EC.presence_of_element_located((By.XPATH, "//span[@class='money']"))).text
                            except Exception as e:
                                print('Exception Occured')
                                print(e)
                                errors+=1
                                continue


                            print(f'size: {product_size}')
                            print(f'price: {product_price}')
                            product_sizes.append({
                                'size':product_size,
                                'price':product_price,
                                'value': extract_num(product_size) / extract_num(product_price),
                                'vegan': True if product_title.lower().find('vegan') != -1 else False,
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
                        'price':product_price,
                        'value': extract_num(product_size) / extract_num(product_price)
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
        try:
            next = last_btn.find_element(By.XPATH, ".//a")
            if next.get_attribute('aria-label') == 'Next page':
                print('\nNext Page\n')
                page_num+=1
                driver.get(next.get_attribute('href'))
            else:
                print('We have reached the end of the last page')
                break
        except NoSuchElementException as e:
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
    print(f'There were {errors} errors')
    return finds


def get_supplements(supplement):
    print('beginning scraping')
    
    # data = request.get_json()
    # print(data)
    # supplement = data['supplement']
    # weight = data['weight']
    # max_price = data['max_price']
    # min_price = data['min_price']
    # vegan = data['vegan']  
    # isolate = data['isolate']
    
    # if min_price:
    #     min_price = float(min_price)
    # if max_price:
    #     max_price = float(max_price)
    # if weight:
    #     weight = float(weight)

    # print(f'supplement: {supplement}')
    # print(f'weight: {weight}')
    # print(f'max price: {max_price}')
    # print(f'min price: {min_price}')
    # print(f'vegan: {vegan}')
    # print(f'isolate: {isolate}')



    results = scrape(supplement)

    #Post Filtering
    print(f'We have {num_products(results)} before filtering')
    #Pre processing
    # #MAX PRICE
    # if max_price:
    #     for i in range(len(results)):
    #         product = results[i]
    #         product['sizes'] = [x for x in product['sizes'] if float(''.join([c for c in x['price'] if (c.isdigit() or c=='.')])) <= max_price]
    #         if product['sizes'] == []:
    #             product['keep'] = False
    #         else:
    #             product['keep'] = True
    #     results = [x for x in results if x['keep']]

    # #MIN PRICE
    # if min_price:
    #     for i in range(len(results)):
    #         product = results[i]
    #         product['sizes'] = [x for x in product['sizes'] if float(''.join([c for c in x['price'] if (c.isdigit() or c=='.')])) >= min_price]
    #         if product['sizes'] == []:
    #             product['keep'] = False
    #         else:
    #             product['keep'] = True
    #     results = [x for x in results if x['keep']]

    # #WEIGHT
    # if weight:
    #     for i in range(len(results)):
    #         product = results[i]
    #         product['sizes'] = [x for x in product['sizes'] if abs(float(''.join([c for c in x['size'] if (c.isdigit() or c=='.')])) - float(weight)) <= 1]
    #         if product['sizes'] == []:
    #             product['keep'] = False
    #         else:
    #             product['keep'] = True
    #     results = [x for x in results if x['keep']]

    print(f'We have {num_products(results)} after filtering')

    
    #Truncate names
    trunc_len = 40
    print('Truncating')
    for i in range(len(results)):
        name = results[i]['name']
        if len(name) >= trunc_len:
            trunc = name[:trunc_len]
            new_name = trunc.strip() + '...'
            results[i]['trunc_name'] = new_name
        else:
            results[i]['trunc_name'] = name

        #add date
        results[i]['date_scraped'] = datetime.now(timezone.utc).isoformat()
        results[i]['key'] = f"{results[i]['brand'].lower()}_{results[i]['name'].lower()}"

    print(results)

    #expand results

    # upload to supabase
    try:
        response = supabase.table('scraped_data').upsert(results, on_conflict='key').execute()
    except Exception as e:
        print(f"Error uploading to Supabase: {e}")
    # response = jsonify(results)
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response

# if __name__ == '__main__':
#     app.run(debug=True)
#     print('server is running')

sups = ['protein','creatine']
for sup in sups:
    get_supplements(sup)
    
print('success')
with open('log.txt', 'a') as f:
    f.write(f'Successfully ran at {datetime.now(timezone.utc).isoformat()}\n')