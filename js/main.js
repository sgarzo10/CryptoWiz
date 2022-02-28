$(document).ready(() => {
    init_contract();
    init_battle();
    let col_menu = $('#col_menu');
    let template = Handlebars.compile($('#menu-template')[0].innerHTML);
    let menu_list = config.menu;
    col_menu.html(template(menu_list));
    feather.replace();
    return;
});    

function menu_click(menu_name)
{
    let col_main = $('#main');
    let template = Handlebars.compile($("#".concat(menu_name.toLowerCase()).concat("-template"))[0].innerHTML);
    let p_struct={
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
    return;
}



  