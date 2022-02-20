$(document).ready(() => {
    init_contract();
    init_battle();
    let col_menu = $('#col_menu');
    let template = Handlebars.compile($('#menu-template')[0].innerHTML);
    let menu_list = config.menu;
    col_menu.html(template(menu_list));
    feather.replace();
    menu_click("HOME");
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

    return;
}