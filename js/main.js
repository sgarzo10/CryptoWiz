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

function menu_click(menu_name)
{
    let col_main = $('#main');
    let template = Handlebars.compile($("#".concat(menu_name.toLowerCase()).concat("-template"))[0].innerHTML);
    let p_struct = {
        "title": config["page_".concat(menu_name.toLowerCase())]["title"],
        "text": config["page_".concat(menu_name.toLowerCase())]["title"]
    }
    if (menu_name === "NFT"){
        let links = [];
        for (let val of Object.values(nft_list))
            links.push(val["image"]);
        p_struct["links"] = links;
    }
    col_main.html(template(p_struct));
    if (p_struct["links"].length > 0) pg_click(0);
    return;
}

function pg_click(index)
{
    let div_pg = $('#pg-t');
    let template = Handlebars.compile($("#pg-template")[0].innerHTML);
    let pg_traits = [];
    //
    for (let trait of Object.values(nft_list)[index]["traits"])
    {
        let pg_text = "";
        for (let [key, value] of Object.entries(trait))
        {
            if ( key === "trait_type") pg_text = value+": ";
            if ( key === "value") pg_text = pg_text+value;
        }
        pg_traits.push(pg_text);
    }
    //
    let p_struct = {
        "name": Object.values(nft_list)[index]["name"],
        "image": Object.values(nft_list)[index]["image"],
        "description": Object.values(nft_list)[index]["description"],
        "traits": pg_traits
    };
    div_pg.html(template(p_struct));
    return;
}


  