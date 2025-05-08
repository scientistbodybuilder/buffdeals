from flask import Flask, request

app = Flask(__name__)

def scrape(supplement,weight,max_price,min_price,vegan,isolate):
    return []

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