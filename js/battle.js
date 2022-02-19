let context = null;
let canvas = null;
let dict_image_canvas = {};
let dict_players = {};
let prec_move = 0;
let time_sleep = 100;
let move_incr = 0.02;

function init_battle(){
    canvas = $('#viewport')[0];
    canvas.width = screen.width * 0.6;
    canvas.height = screen.height * 0.4;
    context = canvas.getContext('2d');
    init_image_for_canvas("background", "img\\base.png", canvas.width, canvas.height, 0, 0);
    sleep(100).then(() => {
        init_image_for_canvas('player', 'img\\pg.png', canvas.width * 0.1, canvas.height * 0.24, canvas.width * 0.75, canvas.height * 0.65, true);
        init_image_for_canvas('enemy', 'img\\cpu.png', canvas.width * 0.1, canvas.height * 0.24, canvas.width * 0.15, canvas.height * 0.65, true);
        init_image_for_canvas('hit', 'img\\hit.png', canvas.width * 0.05, canvas.height * 0.12, canvas.width * 0.50, canvas.height * 0.70, false, false);
        init_image_for_canvas('fail', 'img\\fail.png', canvas.width * 0.085, canvas.height * 0.045, canvas.width * 0.30, canvas.height * 0.60, false, false);
        init_image_for_canvas('ok', 'img\\ok.png', canvas.width * 0.085, canvas.height * 0.045, canvas.width * 0.60, canvas.height * 0.60, false, false);
        init_image_for_canvas('win', 'img\\win.png', canvas.width * 0.40, canvas.height * 0.12, canvas.width * 0.30, canvas.height * 0.50, false, false);
        init_image_for_canvas('lose', 'img\\lose.png', canvas.width * 0.40, canvas.height * 0.12, canvas.width * 0.30, canvas.height * 0.50, false, false);
        draw_canvas();
    });
    return;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function init_image_for_canvas(id, file_path, width, height, position_x, position_y, is_player=false, visible=true){
    let image = new Image();
    image.src = file_path;
    dict_image_canvas[id] = {
        "file_path": file_path,
        "width": width,
        "height": height,
        "position_x": position_x,
        "position_y": position_y,
        "visible": visible
    };
    if (is_player){
        dict_players[id] = {
            "vita": 0,
            "attacco": 0,
            "difesa": 0,
            "precisione": 0,
            "velocita": 0
        };
    }
    return;
}

function draw_image_canvas(image_to_draw){
    let image = new Image();
    image.onload = () => {
        context.drawImage(image, image_to_draw.position_x, image_to_draw.position_y, image_to_draw.width, image_to_draw.height);
    };
    image.src = image_to_draw.file_path;
    return;
}

function draw_canvas(){
    draw_image_canvas(dict_image_canvas['background']);
    for([key, val] of Object.entries(dict_image_canvas).slice(1)){
        if (val.visible)
            draw_image_canvas(dict_image_canvas[key]);
    }
    return;
}

function move_items(num_move, list_dict_moves){
    num_move = num_move / move_incr / 100
    for (i = 0; i < num_move; i++){
        sleep(time_sleep * (i + prec_move)).then(() => {
            for(j = 0; j < list_dict_moves.length; j++){
                let id_image = list_dict_moves[j].id
                if (Object.keys(dict_image_canvas).includes(id_image)){
                    let incr = 0;
                    if (list_dict_moves[j].where_move == "l")
                        incr = -canvas.width;
                    else
                        incr = canvas.width;
                    dict_image_canvas[id_image].position_x = dict_image_canvas[id_image].position_x + (incr * move_incr); 
                }
            }
            requestAnimationFrame(draw_canvas);
            return;
        });
    }
    prec_move += num_move;
    return;
}

function update_item(id_image, visible, position_x, num_move=1){
    sleep(time_sleep * prec_move).then(() => {
        dict_image_canvas[id_image].visible = visible;
        dict_image_canvas[id_image].position_x = eval(position_x);
        requestAnimationFrame(draw_canvas);
    });
    prec_move += num_move;
    return;
}

function await_item(time_await){
    prec_move += time_await;
    sleep(time_sleep * prec_move).then(() => {});
    return;
}

function test(){
    update_item("hit", true, "dict_image_canvas['player'].position_x-dict_image_canvas['hit'].width");
    move_items(40, [
        {"id": "hit", "where_move":"l"}
    ]);
    move_items(10, [
        {"id": "hit", "where_move":"l"},
        {"id": "enemy", "where_move":"l"}
    ]);  
    update_item("hit", false, 0);
    move_items(30, [
        {"id": "enemy", "where_move":"r"}
    ]);    
    update_item("hit", true, "dict_image_canvas['enemy'].position_x + dict_image_canvas['enemy'].width");
    move_items(27, [
        {"id": "hit", "where_move":"r"}
    ]);
    update_item("hit", false, 0);
    move_items(45, [
        {"id": "player", "where_move":"l"}
    ]); 
    prec_move = 0;
    return;
}

function battle(){
    let turn=1;
    let atc_img="";
    let match_img="";
    let cpu_hp=1;
    let pg_hp=3;

    while (cpu_hp > 0 && pg_hp > 0)
    {
        //PLAYER
        //PICK IMAGE(struct) RESULT
        if (Math.floor(Math.random() * 2) != 0) atc_img="fail"; else atc_img="ok";
        if (atc_img=="ok") cpu_hp=cpu_hp-1;
        //PLAYER-ATTACK ANIMATION
        update_item("hit", true, dict_image_canvas['player'].position_x-dict_image_canvas["hit"].width);
        move_items(50, [
            {"id": "hit", "where_move":"l"}
        ]);
        update_item("hit", false, 0);
        move_items(5, [
            {"id": "enemy", "where_move":"l"}
        ]);    
        update_item(atc_img, true, dict_image_canvas['enemy'].position_x-dict_image_canvas["ok"].width);
        move_items(50, [
            {"id": "enemy", "where_move":"r"}
        ]);
        await_item(5);
        update_item(atc_img, false, 0);
        //CPU
        //PICK IMAGE(struct) RESULT
        if (Math.floor(Math.random() * 2) != 0) atc_img="fail"; else atc_img="ok";
        if (atc_img=="ok") pg_hp=pg_hp-1;
        //POSIZIONO HIT e RESULT ATTACK
        update_item("hit", true, dict_image_canvas['enemy'].position_x+dict_image_canvas["hit"].width);
        move_items(40, [
            {"id": "hit", "where_move":"r"}
        ]);
        move_items(10, [
            {"id": "hit", "where_move":"r"}
        ]);
        update_item("hit", false, 0);
        move_items(5, [
            {"id": "player", "where_move":"r"}
        ]);    
        update_item(atc_img, true, dict_image_canvas['player'].position_x+dict_image_canvas["ok"].width);
        move_items(5, [
            {"id": "player", "where_move":"l"}
        ]);
        update_item(atc_img, false, 0);        
    }
    //RESULT
    if (pg_hp > 0) 
        match_img="win";
    else
        match_img="lose";
    update_item(match_img, true, canvas.width * 0.50);        
    //$("#result").html(match_img);
    //FINE
    prec_move = 0;
    return;
}