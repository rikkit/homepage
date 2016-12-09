/// <reference path="../typings/index.d.ts" />
import {Tile} from "./tile";

declare function require(name:string);
require('jquery');
require('jquery-cycle');
require('jquery-easing');
require('nprogress');

function countdownProgress(secs) {
    NProgress.start();
    var counter = 0;
    var interval = 500;

    setInterval(function() {
        counter += interval;

        if (counter < secs)
            NProgress.set(counter / secs);
        else NProgress.done();
    }, interval);
}

$(window).bind('beforeunload', function() {
    NProgress.done();
});

$(document).ready(async () => {
    countdownProgress(2500);
    
    $("body").css("display", "block");

    let tiles :JQuery[] = $(".tiles .tile").toArray()
        .map((element => $(element)));
    
    let tileCount = 0;
    for (let tile of tiles) {
        let jq = $(tile);
        jq.find(".tile-link").click(NProgress.start);
        jq.css("order", tileCount.toString());
    } 

    let tileHelper = new Tile(tiles);

    await setTimeout(tileHelper.animate, 3000);
});
