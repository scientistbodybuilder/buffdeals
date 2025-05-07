from flask import Flask
import request

app = Flask(__name__)

def scrape(supplement=str):
    pass

@app.route('/get-supplement')
def get_supplements(methods=['POST']):
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