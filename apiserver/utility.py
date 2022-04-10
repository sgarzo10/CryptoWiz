from json import load, dumps, loads ,dump
from logging import info, exception
from urllib.request import urlopen, Request
import ipfshttpclient
import random

def make_request(url, body=None, proxy=False):
    info("MAKE REQUEST: %s", url)
    req = None

    header = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36'
    }
    if body is not None:
        header['Content-Type'] = 'application/json'
        req = Request(url, data=bytes(dumps(body), encoding="utf-8"), headers=header)
    else:
        req = Request(url, headers=header)

    if proxy is not False:
        proxy_host = random.choice(Config.settings['proxylist'])
        info(f"Proxy:{proxy_host}")
        req.set_proxy(proxy_host, 'https')
        req.set_proxy(proxy_host, 'http')

    to_return = {}
    try:
        to_return['response'] = urlopen(Request(url, headers=header)).read().decode()
        if body is None and validate_format(to_return['response']):
                to_return['response'] = loads(to_return['response'])
        info("RESPONSE: %s", to_return['response'])
        to_return['state'] = True
    except Exception as e:
        exception(e)
        to_return['state'] = False
        to_return['response'] = f"Si è verificato un errore nella chiamata a {url}"
        to_return['error_detail'] = str(e)
    return to_return

def read_file(file_path, json=True):
    f = open(file_path)
    if json:
        ctx = load(f)
    else:
        ctx = f.read()
    f.close()
    return ctx


def write_file(file_path, ctx, json=True):
    f = open(file_path, 'w')
    if json:
        dump(ctx, f)
    else:
        f.write(ctx)
    f.close()
    return True


def validate_format(request_validate):
    try:
        loads(request_validate)
    except ValueError:
        return False
    return True


def ipfs_upload(ipfs_url, path_file):
    info(f"MAKE REQUEST: {ipfs_url} - FILE {path_file}")
    to_return = {}
    try:
        res = ipfshttpclient.connect(ipfs_url).add(path_file)
        # ipfs_ist.files.cp(f"/ipfs/{str(res['Hash'])}", "/name.png")
        info(f"RESPONSE: {res}")
        to_return['response'] = 'https://ipfs.io/ipfs/' + str(res['Hash'])
        to_return['hash'] = str(res['Hash'])
        to_return['state'] = True        
    except Exception as e:
        exception(e)
        to_return['state'] = False
        to_return['response'] = f"Si è verificato un errore nella chiamata a {ipfs_url}"
    return to_return


class Config:

    settings = {}

    @staticmethod
    def reload():
        Config.settings = read_file("config.json")
