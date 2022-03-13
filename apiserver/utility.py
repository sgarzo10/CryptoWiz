from json import load, dumps, loads
from logging import info, exception
from urllib.request import urlopen, Request


def make_request(url, body=None):
    info("MAKE REQUEST: %s", url)
    header = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36'
    }
    if body is not None:
        header['Content-Type'] = 'application/json'
    to_return = {}
    try:
        if body is not None:
            to_return['response'] = urlopen(Request(url, data=bytes(dumps(body), encoding="utf-8"), headers=header)).read().decode()
        else:
            to_return['response'] = urlopen(Request(url, headers=header)).read().decode()
            if validate_format(to_return['response']):
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


def validate_format(request_validate):
    try:
        loads(request_validate)
    except ValueError:
        return False
    return True


class Config:

    settings = {}

    @staticmethod
    def reload():
        Config.settings = read_file("config.json")
