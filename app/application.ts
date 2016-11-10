/// <reference path="../typings/index.d.ts" />
import {Tile} from "./tile";

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

$(document).ready(function() {
    countdownProgress(2500);
    
    $("body").css("display", "block");

    var space = $(".tiles");
    var tiles = space.children(".tile");
    for (var i = 0; i < tiles.length; i++) {
        var tile = $(tiles[i]);

        tile.find(".tile-link").click(NProgress.start);
        tile.css("order", i.toString());

        let tileHelper = new Tile();
        tileHelper.metroTileAnimation(tile, i, i);
    }
});
