from utility import make_request, Config
from logging import exception


def get_nft_detail(payload):
    return make_request(Config.settings["chains"][payload["chain"]]["nft_detail_url"].replace("[contract]", payload["contract"]).replace("[id]", payload["id"]))


def get_nft_ids(payload):
    res = make_request(Config.settings["chains"][payload["chain"]]['nft_id_url'].replace("[contract]", payload["contract"]).replace("[wallet]", payload["wallet"]))
    if res['state']:
        try:
            token_ids = []
            for o in str(res['response']).split("tbody")[1].split("?a="):
                if o.split("target=")[0][0] != ">":
                    token_ids.append(o.split("target=")[0][:-2])
            res['response'] = {"token_ids": token_ids}
        except Exception as e:
            exception(e)
            res['response'] = str(e)
    return res
