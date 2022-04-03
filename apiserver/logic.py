from utility import make_request, Config
from logging import exception, info
from WorkPixil.src import gen_img
from copy import deepcopy


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


def be_generate_nft(source_file, template_file, destination_file):
    work_pixil_path = Config.settings['endpoint']['work_pixil']
    source = f"{work_pixil_path}source/{source_file}"
    template = f"{work_pixil_path}template/{template_file}"
    destination = f"{Config.settings['endpoint']['work_pixil_gen']}{destination_file}"
    metadata = deepcopy(Config.settings["template_metadata"])
    metadata["description"] = "The CryptoWiz number x"
    metadata["name"] = metadata["name"].replace("{name}", "x")
    metadata["custom_data"] = gen_img(source, template, False, destination, f"{work_pixil_path}src/")["json"]
    traits = []
    for k, v in metadata["custom_data"]["total"].items():
        traits.append({
            "trait_type": k.title(),
            "display_type": None,
            "value": v,
            "max_value": 50
        })
    for i in metadata["custom_data"]["items"]:
        traits.append({
            "trait_type": i['display_type'].title(),
            "display_type": None,
            "value": i['value_type'].title()
        })
    metadata["traits"] = traits
    return metadata
