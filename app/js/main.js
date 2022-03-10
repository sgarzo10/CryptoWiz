Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('if_null', function(a, opts) {
    if (a == null) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

$(document).ready(() => {
    init_contract();
    init_battle();
    let col_menu = $('#col_menu');
    let template = Handlebars.compile($('#menu-template')[0].innerHTML);
    let menu_list = config.menu;
    col_menu.html(template(menu_list));
    feather.replace();
    menu_click('HOME')
    return;
});

function set_pg (pg_index)
{
    let img_pg = $('#img_pg')[0];
    pg_img = img_pg.src;
}

function menu_click(menu_name)
{
    let col_main = $('#main');
    let template = Handlebars.compile($("#".concat(menu_name.toLowerCase()).concat("-template"))[0].innerHTML);
    let links = [];
    let p_struct = {
        "title": config["page_".concat(menu_name.toLowerCase())]["title"],
        "text": config["page_".concat(menu_name.toLowerCase())]["text"]
    }
    if (menu_name === "NFT"){
        for (let val of Object.values(nft_list))
        {
            if (val["name"].indexOf("Wiz") > 0)
                links.push(val["image"]);
        }            
        p_struct["links"] = links;
        col_main.html(template(p_struct));
        if (links.length > 0) pg_click(0);    
    }
    else if (menu_name === "BATTLE"){
        col_main.html(template(p_struct));
        init_battle();
    }
    else
        col_main.html(template(p_struct));

    return;
}

function pg_click(index)
{
    let div_pg = $('#pg-t');
    let template = Handlebars.compile($("#pg-template")[0].innerHTML);
    let pg_traits = [];
    let pg_boosts = [];

    for (let trait of Object.values(nft_list)[index]["traits"])
    {
        let boost = {
            "name": null,
            "value": "",
            "display_type": null
        };

        for (let [key, value] of Object.entries(trait))
        {
            if ( key == "trait_type")
            {
                if (value.indexOf("-") > 0)
                {
                    boost["name"]=value.split("-")[0];
                    boost["value"]=value.split("-")[1]+" ";
                }
                else
                    boost["name"]=value;
            }
            if ( key == "value") boost["value"] = boost["value"] + value;
            if ( key == "display_type") boost["display_type"] = value;
        }

        if (boost["name"] !== null)
        {
            if (key == "display_type") and (value == null)
                pg_traits.push(boost);
            if (key == "display_type") and (value == "boost_number")
                pg_boosts.push(boost);                
        } 
    }

    let p_struct = {
        "name": Object.values(nft_list)[index]["name"],
        "image": Object.values(nft_list)[index]["image"],
        "description": Object.values(nft_list)[index]["description"],
        "traits": pg_traits,
        "boosts": pg_boosts,
        "nav": config["nav"]
    };
    div_pg.html(template(p_struct));
    pg_img = Object.values(nft_list)[index]["image"];
    return;
}

function nav_click(nav_name)
{
    let item_container = $('#item-container');
    let template = Handlebars.compile($("#".concat(nav_name.toLowerCase()).concat("-template"))[0].innerHTML);
    item_container.html(template());
    return;
}


  