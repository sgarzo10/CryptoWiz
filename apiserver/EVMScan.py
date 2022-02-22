from urllib.request import urlopen, Request
from json import load, loads, dumps
from math import pow

header = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36'
}

def router_Scan(wallet,chain=''):
    conf_file = open('config.json')
    router_EVM=load(conf_file)
    msg = {'response':[]}
    if wallet[:2] == '0x':
        for k in router_EVM:
            if (chain == '') or (chain != '' and k == chain): 
                url_s = router_EVM[k]['url_s'].replace('{wallet}', wallet).replace('{apy_key}', router_EVM[k]['apy_key'])
                url_sToken = router_EVM[k]['url_sToken'].replace('{wallet}', wallet).replace('{apy_key}', router_EVM[k]['apy_key'])
                msg['response'].append(EVM_Scan(wallet, k, router_EVM[k]['coin'], router_EVM[k]['token_list'], url_s, url_sToken))
    return msg

def getOpenSeaNFT(TokenID='86878125432023963361188205560853538656658503492234669844754453271333010669569'):
    #https://api.opensea.io/api/v2/metadata/matic/0x2953399124F0cBB46d2CbACD8A89cF0599974963/{id}
    url = f"https://api.opensea.io/api/v2/metadata/matic/0x2953399124F0cBB46d2CbACD8A89cF0599974963/{TokenID}"
    res = urlopen(Request(url, headers=header)).read()
    return loads(res)

def EVM_Scan(wallet,chain,coin,token_list,url_s,url_sToken):
    
    response = {
        'wallet': '',
        'balance': [],
        'chain': ''
    }

    response['wallet'] = wallet
    response['chain'] = chain
    html = urlopen(Request(url_s, headers=header)).read()
    r = loads(html)
    response['balance'].append({'key':coin,'value':str(float(r['result']) / pow(10, 18))})
    # print(f"{coin};{float(r['result']) / pow(10, 18)}")
    for key, value in token_list.items():
        # print(f"{key}:{value}")
        html = urlopen(Request(url_sToken + value, headers=header)).read()
        r = loads(html)
        response['balance'].append({'key':key,'value':str(float(r['result']) / pow(10, 18))})
    return response
