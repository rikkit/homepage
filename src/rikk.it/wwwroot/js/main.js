require.config({
    "packages": [
        {
            "name": "jquery",
            "location": "../lib/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-easing",
            "location": "../lib/jquery-easing",
            "main": "jquery.easing.js"
        },
        {
            "name": "jquery.cycle",
            "location": "../lib/jquery-cycle",
            "main": "jquery.cycle.all.js"
        },
        {
            "name": "nprogress",
            "location": "../lib/nprogress",
            "main": "nprogress.js"
        }
    ],
    "shim": {
        "nprogress": {
            "exports": "NProgress"
        }
    }
});

define('jquery', [], function () {
    return jQuery;
});

function greeting(random){
    var dt = new Date();
    var hours = dt.getHours();

    var morning = ['Mornin\''];
    var day = ['Alright?', 'Hi there!'];
    var evening = ['Evenin\''];

    console.log('it is at least ' + hours + ':00');
    var greetings;
    if (hours > 3 && hours < 12) {
        greetings = morning;
    }
    else if (hours > 16 && hours < 21) {
        greetings = evening;
    }
    else {
        greetings = day;
    }
    var index = parseInt(random * greetings.length);

    return greetings[index];
}

require(['jquery', 'nprogress', 'jquery.cycle', 'jquery-easing'], function (jQuery, NProgress) {
    $(window).bind('beforeunload', function() {
        NProgress.done();
    });

    var burritoSize;
    var animating;
    //function rewrapBurrito() {
    //    if (animating) return;

    //    var medTileHeight = 140;
    //    var testHeight = 0.65 * window.outerHeight;
    //    var newHeight = Math.floor(testHeight / medTileHeight) * medTileHeight;
    //    newHeight += 47; // account for padding

    //    if (newHeight > burritoSize) {
    //        animating = true;
    //        $("#burrito").animate({
    //            'height': newHeight + "px"
    //        }, 1000, "easeOutQuint", function() {
    //            animating = false;
    //        });
    //    }
    //}
    //$(window).resize(rewrapBurrito);

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

    $(document).ready(function() {
        countdownProgress(2500);
        
        $("body").css("display", "block");

        var space = $(".tiles");
        var tiles = space.children(".tile");
        for (var i = 0; i < tiles.length; i++) {
            var tile = $(tiles[i]);

            tile.find(".tile-link").click(NProgress.start);
            tile.css("order", i.toString());

            var animFunc = getAnimation();
            animFunc(tile, i, i);
        }
        
        $("#header-greeting").text(greeting(Math.random()));
    });
});