import requests, os, io
from PIL import Image
from supabase import create_client
print(os.getenv('SUPABASE_URL'))
print(os.getenv('SUPABASE_KEY'))
supabase = create_client('https://lyireeykafgrjhqovsha.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aXJlZXlrYWZncmpocW92c2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NDUyMjQsImV4cCI6MjA2MzAyMTIyNH0.gGoWNobntbN0Jukpvh0X1Faf-utqtOwHOrHp7e7FERg')



def getImg(url,file_path):
    try:
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
        print(f'Exception in retrieving image from url\n Exception: {e}\n Url: {file_path}')

url1='https://revolution-production.s3.amazonaws.com/storage/uploads/2023/8/NC%20-%20CREATINE%20HCL.webp'
url2='https://revolution-production.s3.amazonaws.com/storage/uploads/2024/10/Creatine%20HCL%20-%20500g.webp'
url3='https://canadianprotein.com/cdn/shop/products/Whey-Concentrate-1kg-Chocolate-Milkshake_6919ecc5-4c78-4d82-9416-1e75e86e028a.jpg?v=1715986668&width=940'

l = [url1,url2,url3]
for i, url in enumerate(l):
    file_path = 'test/' + f'test{i}.webp'
    getImg(url,file_path)