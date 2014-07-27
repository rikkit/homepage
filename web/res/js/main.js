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

    console.log('Chose greeting  ' + index );
    return greetings[index];
}

require(['jquery', 'nprogress', 'jquery.cycle', 'jquery-easing'], function (jQuery, NProgress) {
    $(window).bind('beforeunload', function() {
        NProgress.done();
    });

    var burritoSize;
    var animating;
    function rewrapBurrito() {
        if (animating) return;

        const medTileHeight = 140;
        var testHeight = 0.65 * window.outerHeight;
        var newHeight = Math.floor(testHeight / medTileHeight) * medTileHeight;
        newHeight += 47; // account for padding

        if (newHeight > burritoSize) {
            animating = true;
            $('#burrito').animate({
                'height': newHeight + 'px'
            }, 1000, 'easeOutQuint', function() {
                animating = false;
            });
        }
    }
    $(window).resize(rewrapBurrito);

    function countdownProgress(secs) {
        NProgress.start();
        var counter = 0;
        var interval = 750;

        setInterval(function() {
            counter += interval;

            if (counter < secs)
                NProgress.set(counter / secs);
            else NProgress.done();
        }, interval);
    }

    $(document).ready(function() {
        countdownProgress(3500);

        burritoSize = $('#burrito').height();
        rewrapBurrito();

        $('body').css('display', 'block');

        $.get("./api/all", null, function(tiles) {

            var space = $('#burrito');
            space.children().remove();

            for (var index = 0; index < tiles.length; index++) {
                (function (i){
                    var tile = tiles[i];
                    var animation = getAnimation(tile['animation']);

                    getTemplateAsync(tile['tile-template'], function(template){
                        var filled = fillTileTemplate(template.clone(), tile.title, tile.href, tile.style);

                        filled.css("order", i.toString());
                        filled.find('.tile-link').click(NProgress.start);

                        if (tile.size)
                        {
                            filled.addClass(tile.size);
                        }
                        else {
                            filled.addClass('medium');
                        }

                        if (tile['content-template'])
                        {
                            getTemplateAsync(tile['content-template'], function(template){
                                var slides = fillContentTemplates(template.clone(), tile.data);

                                var content = filled.find('.tile-content');
                                content.children().remove();

                                for (var i=0; i < slides.length; i++){
                                    content.append(slides[i]);
                                }

                                space.append(filled);
                                animation(filled, i);
                            });
                        }
                        else {
                            space.append(filled);
                            animation(filled, i);
                        }
                    });
                })(index);
            }
        });

        $('#header-greeting').text(greeting(Math.random()));
    });
});