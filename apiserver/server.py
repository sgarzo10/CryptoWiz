#!/usr/bin/env python
#http://127.0.0.1:5000/balance?w=0xc01346c420669cA0a2580Ab3a92c65E295C3F121
#0xc01346c420669cA0a2580Ab3a92c65E295C3F121
from EVMScan import router_Scan
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/')
def hello():
    response={'response': 'Internal API HTTP Server Ver. 0.1'}
    return jsonify(response)

@app.route('/balance')
def balance():
    ret = ""
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
