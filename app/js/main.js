//Variabili Globali
let PgSelIndex = 0;

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

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

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

function btn_text_click(id){
    id ='#'+id;
    if ( $(id).hasClass('d-none') == true)
        $(id).removeClass('d-none');
    else
        $(id).addClass('d-none');
}

function pg_click(index)
{
    $('#img_pg_'+PgSelIndex).removeClass('active');
    $('#img_pg_'+index).addClass('active');
    PgSelIndex = index;
    let div_pg = $('#pg-t');
    let template = Handlebars.compile($("#pg-template")[0].innerHTML);
    let p_struct = {
        "name": Object.values(nft_list)[PgSelIndex]["name"],
        "image": Object.values(nft_list)[PgSelIndex]["image"],
        "description": Object.values(nft_list)[PgSelIndex]["description"],
        "pg": nft_list[PgSelIndex],
        "nav": config["nav"]
    };
    div_pg.html(template(p_struct));
    nav_click('Bio');;
    pg_img = Object.values(nft_list)[PgSelIndex]["image"];
    return;
}

function item_click(index)
{
    let equip_vw_container = $('#equip-vw-container');
    let template = Handlebars.compile($("#equip-vw-template")[0].innerHTML);

    let item_vw = {
        "item-act":{"stats":[]},
        "item-sel":{"stats":[]}
    }

    item_vw["item-sel"]["name"] = config["items"][index]["name"]
    item_vw["item-sel"]["description"] = config["items"][index]["description"]
    item_vw["item-sel"]["image"] = config["items"][index]["image"]
    item_vw["item-sel"]["display_type"] = config["items"][index]["custom_data"]["items"][0]["display_type"]
    item_vw["item-sel"]["value_type"] = config["items"][index]["custom_data"]["items"][0]["value_type"]


    for (const [key, value] of Object.entries(config["items"][index]["custom_data"]["items"][0])) {
        let stat = {
            "name": key,
            "val": value,
            "max_value": config["max_stat_value"]
        };
        //if (key !== "max_value" && isNumeric(value))
        if (isNumeric(value))
            item_vw["item-sel"]["stats"].push(stat)
    }
    
    for (let val of Object.values(nft_list[PgSelIndex]["custom_data"]["items"]))
    {
        if (val["display_type"] === item_vw["item-sel"]["display_type"])
        {
            item_vw["item-act"]["display_type"] = val["display_type"];
            item_vw["item-act"]["value_type"] = val["value_type"];

            for (const [key, value] of Object.entries(val)) {
                let stat = {
                    "name": key,
                    "val": value,
                    "max_value": config["max_stat_value"]
                };
                if (isNumeric(value) )
                    item_vw["item-act"]["stats"].push(stat)
            }
        }
    }

    //insertAdjacentHTML("afterend",template(item_vw));
    equip_vw_container.html(template(item_vw));
}

function nav_click(nav_name)
{
    let edit_container = $('#edit-container');
    let template = Handlebars.compile($("#".concat(nav_name.toLowerCase()).concat("-template"))[0].innerHTML);
    if (nav_name == "Equip")
        edit_container.html(template(config["items"]));
        if (config["items"].length > 0) item_click(0);
    if (nav_name == "Bio")
    {
        nft_list[PgSelIndex]["nick"] = nft_list[PgSelIndex]["name"].split(" - ")[1];
        edit_container.html(template(nft_list[PgSelIndex]));
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

function test_up(){
    var body = {
    'file_path': "a"
    }

    $.ajax({
    url: "http://127.0.0.1:5000/nft_up",
    type: 'POST',
    contentType: "application/json",
    data : JSON.stringify(body),
    success: function(response){
        if (response["state"] === true)
            mint(response["metadata_hash"]);
    },
    error: function(xhr){}
    });
    return;
}
