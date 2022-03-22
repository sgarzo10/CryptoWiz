Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('if_int', function(a, opts) {
    if (a > 0) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('perc', function(a, b, opts) {
    return a * 100 / b;
});

$(document).ready(() => {
    init_contract();
    init_battle();
    let col_menu = $('#col_menu');
    let template = Handlebars.compile($('#menu-template')[0].innerHTML);
    //let menu_list = config.menu;
    //let menu_list = Object.values(config["pages"])
    let menu_list = Object(config["pages"])
    col_menu.html(template(menu_list));
    feather.replace();
    $("#modal-mint").on('hide.bs.modal', function(){
        $("#modal-mint-detail").html("");
    });
    $("#modal-battle").on('hide.bs.modal', function(){
        var d_dett = document.getElementById("modal-battle-detail");
        d_dett.classList.remove("d-none"); 
        var d_battle = document.getElementById("modal-battle-play");
        d_battle.classList.add("d-none");
    });    
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
        "title": config["pages"][menu_name]["title"],
        "text": config["pages"][menu_name]["text"]
    }

    if (menu_name === "PARTY"){
        for (let val of Object.values(nft_list))
            links.push(val["image"]);
        p_struct["links"] = links;
        col_main.html(template(p_struct));
        if (links.length > 0) pg_click(0);    
    }
    else if (menu_name === "BATTLE"){
        p_struct["battles"] = config["battles"];
        col_main.html(template(p_struct));
    }
    else if (menu_name === "MINT"){
        p_struct["mints"] = config["mints"];
        col_main.html(template(p_struct));

    }    
    else
        col_main.html(template(p_struct));

    return;
}

function pg_click(index)
{
    let div_pg = $('#pg-t');
    let template = Handlebars.compile($("#pg-template")[0].innerHTML);
    let p_struct = {
        "name": Object.values(nft_list)[index]["name"],
        "image": Object.values(nft_list)[index]["image"],
        "description": Object.values(nft_list)[index]["description"],
        "pg": config["test_pg"],
        "nav": config["nav"]
    };
    div_pg.html(template(p_struct));
    nav_click('Bio');;
    pg_img = Object.values(nft_list)[index]["image"];
    return;
}

function nav_click(nav_name)
{
    let edit_container = $('#edit-container');
    let template = Handlebars.compile($("#".concat(nav_name.toLowerCase()).concat("-template"))[0].innerHTML);
    if (nav_name == "Equip")
        edit_container.html(template(config["test_item"]));
    if (nav_name == "Bio")
    {
        config["test_pg"]["nick"] = config["test_pg"]["name"].split(" - ")[1];
        edit_container.html(template(config["test_pg"]));
    }        
    return;
}

function pre_modal_mint(){
    $("#modal-mint-detail").html("<img src=\"/img/mint.gif\" alt=\"banner\" class=\"col-md-12 gif\">");
    $("#modal-mint").modal();
    setTimeout(modal_mint, 2950);
}

function modal_mint(){

    let modal_f = $('#modal-mint-detail');
    let template = Handlebars.compile($("#modal-mint-template")[0].innerHTML);
    let i = 0;
    modal_f.html=modal_f.html(template(config["test_pg"]));
    return;
}

function modal_battle(){
    $("#modal-battle").modal();
    let modal_f = $('#modal-battle-detail');
    let template = Handlebars.compile($("#modal-battle-template")[0].innerHTML);
    let i = 0;

    let battle_info = {
        "cpu": config["pg_test"],
        "pg": config["pg_test"]
    };

    modal_f.html=modal_f.html(template(battle_info));
    return;
}

function show_battle()
{
    var d_dett = document.getElementById("modal-battle-detail");
    d_dett.classList.add("d-none");
    var d_battle = document.getElementById("modal-battle-play");
    d_battle.classList.remove("d-none"); 
}
 