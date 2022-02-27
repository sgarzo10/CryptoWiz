$(document).ready(() => {
    init_contract();
    init_battle();
    let col_menu = $('#col_menu');
    let template = Handlebars.compile($('#menu-template')[0].innerHTML);
    let menu_list = config.menu;
    col_menu.html(template(menu_list));
    feather.replace();
    menu_click("NFT");
    return;
});    

function menu_click(menu_name)
{
    //let template_name="#".concat(menu_name.toLowerCase().concat("-template"))
    //$(template_name).removeClass("d-none");
    //$('#mint-t').addClass('d-none');
    //if(menu_name === 'BATTLE') {
    let col_main = $('#main');
    let template = Handlebars.compile($("#".concat(menu_name.toLowerCase()).concat("-template"))[0].innerHTML);
    col_main.html(template(config["page_".concat(menu_name.toLowerCase())]));
    
    if(menu_name === 'xNFT') {
        setNFTImage("86878125432023963361188205560853538656658503492234669844754453270233499041793");
    }

    return;
}


function getNFTImages(){
    let ids = getNFTTokenIDs();
    console.log(ids);
    console.log('ids');
    for (const element of ids) {
        console.log('ids');
    }
}

async function getNFTTokenIDs(){
    let c = "0x2953399124F0cBB46d2CbACD8A89cF0599974963"
    let ret = {};
    if (currentAddress !== ''){
        var settings = {
            'cache': false,
            'dataType': "json",
            "async": true,
            "crossDomain": true,
            "responseType": "application/json",
            "url": "http://127.0.0.1:5000/balance_os_nft?c="+c+"&w="+currentAddress,
            "method": "GET",
            "headers": {
                "accept": "application/json",
                'Access-Control-Allow-Methods':'GET',
                'Access-Control-Allow-Headers':'Origin, Content-Type, X-Auth-Token'
            }
        }
        ret = await $.ajax(settings).done( function (response) {
            //console.log(response);
            return response["TokenIDs"];
            //img_nft.src = "https://lh3.googleusercontent.com/3y1ABTAnFsehd-Ol-9KjRXBB1Vd_nH4yaQotL4BuusqMO2rguAfHqPoymOO4UPF6ckKWRFINSNrNk0Au8oNDzOIb6kAYqyNSIj56gQ" 
        });
        return ret;
    }        
}

function setNFTImage(TokenID){
    if (currentAddress !== ''){
        var settings = {
            'cache': false,
            'dataType': "json",
            "async": true,
            "crossDomain": true,
            "responseType": "application/json",
            "url": "http://127.0.0.1:5000/os_nft?id="+TokenID,
            "method": "GET",
            "headers": {
                "accept": "application/json",
                'Access-Control-Allow-Methods':'GET',
                'Access-Control-Allow-Headers':'Origin, Content-Type, X-Auth-Token'
            }
        }
        $.ajax(settings).done( function (response) {
            console.log(response);
            //let img_nft = $('#img-nft')[0];
            //img_nft.src = response["image"]
            //img_nft.src = "https://lh3.googleusercontent.com/3y1ABTAnFsehd-Ol-9KjRXBB1Vd_nH4yaQotL4BuusqMO2rguAfHqPoymOO4UPF6ckKWRFINSNrNk0Au8oNDzOIb6kAYqyNSIj56gQ" 
        });
    }
}  