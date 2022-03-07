#!/usr/bin/env python
#http://127.0.0.1:5000/balance?w=0xc01346c420669cA0a2580Ab3a92c65E295C3F121
#http://127.0.0.1:5000/balance_os_nft?c=0x2953399124F0cBB46d2CbACD8A89cF0599974963&w=0x49b363595ecDB335BEa64E4850472d9eF0609c99
#http://127.0.0.1:5000/os_nft?id=86878125432023963361188205560853538656658503492234669844754453276830568808449

from EVMScan import router_Scan, getOpenSeaNFT, getNFTBalance
from flask import Flask, request, jsonify
from flask_cors import *

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    response={'response': 'Internal API HTTP Server Ver. 0.1'}
    return jsonify(response)

@app.route('/balance_os_nft')
@cross_origin()
def balance_os_nft():
    ret = {}
    if request.args.get('c') != None and request.args.get('w') != None :
        ret = getNFTBalance(request.args.get('c'),request.args.get('w'))
    return ret

@app.route('/os_nft')
@cross_origin()
def os_nft():
    ret = {}
    if request.args.get('id') != None and request.args.get('contract') != None  and request.args.get('chain') != None :
        ret=jsonify(getOpenSeaNFT(request.args.get('contract'),request.args.get('id'),request.args.get('chain')))
    return ret

@app.route('/balance')
def balance():
    ret = {}
    user = request.args.get('w')
    chain = request.args.get('c')
    if user != None:
        if chain != None:
            ret = jsonify(router_Scan(user,chain)) 
        else:
            ret = jsonify(router_Scan(user)) 
    return ret

if __name__ == '__main__':
    app.run(debug=True)    
