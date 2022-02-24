#!/usr/bin/env python
#http://127.0.0.1:5000/balance?w=0xc01346c420669cA0a2580Ab3a92c65E295C3F121
#0xc01346c420669cA0a2580Ab3a92c65E295C3F121
from EVMScan import router_Scan, getOpenSeaNFT, getNFTBalance
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    response={'response': 'Internal API HTTP Server Ver. 0.1'}
    return jsonify(response)

@app.route('/balance_os_nft')
def balance_os_nft():
    ret = {}
    if request.args.get('c') != None and request.args.get('w') != None :
        ret = getNFTBalance(request.args.get('c'),request.args.get('w'))
    return ret

@app.route('/os_nft')
def os_nft():
    ret = {}
    if request.args.get('id') != None:
        ret=jsonify(getOpenSeaNFT(request.args.get('id')))
    else:        
        ret=jsonify(getOpenSeaNFT())
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
