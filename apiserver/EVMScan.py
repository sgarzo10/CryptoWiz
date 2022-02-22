from urllib.request import urlopen, Request
from json import load, loads, dumps

from math import pow

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


def EVM_Scan(wallet,chain,coin,token_list,url_s,url_sToken):
    
    response = {
        'wallet': '',
        'balance': [],
        'chain': ''
    }
    header = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36'
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
