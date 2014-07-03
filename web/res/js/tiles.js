/**
 * TODO support other kinds of template
 * @param template
 * @param primary
 * @param secondary
 * @param image
 */
function fillTemplate(template, lead, sub, image){

    if (image != null){
        var imagediv = template.find('.template-image');
        if (template.hasClass('template-image'))
        {
            imagediv = template;
        }

        imagediv.css({
            'background-image' : 'url("' + image + '")'
        });
    }

    if (lead != null)
    {
        template.find('.template-lead').text(lead);
    }

    console.log("Template filled: " + lead + '; ' + sub + '; ' + image);
    return template;
}

function metroTileAnimation(div, offset){
    if (div.length){
        var faces = div.find('> .faces');
        if (faces.length)
        {
            var content = faces.find('.tile-content');

            faces.cycle({
                delay: -24000 + (offset * 2500),
                timeout: 25000,
                speed: 1050,
                easing: 'easeOutQuint',
                fx: 'scrollUp',
                beforeEach: function() {
                    "use strict";
                    if (content.children().length > 1)
                    {
                        content.cycle('toggle');
                    }
                }
            });

            if (content.children().length > 1)
            {
                content.cycle({
                    delay: 2000 + (offset * 750),
                    timeout: 4000,
                    speed: 1050,
                    easing: 'easeOutQuint',
                    fx: 'scrollUp'
                });
            }
        }
    }
}

function setupGithubTile(animation, div, offset){
    "use strict";

    var user = new Gh3.User('rikkit');

    var repos = new Gh3.Repositories(user);
    repos.fetch({
        'page' : 1,
        'per_page' : 5,
        'sort' : 'updated'
    }, {paginationInfo : 'first'},
    function(){
        var content = div.find('.tile-content');
        var template = content.children('li').clone();

        content.children().remove();

        for (var i=0; i<repos.repositories.length; i++){

            var repo = repos.repositories[i];
            console.log('GitHub Tile: ' + repo.name + ' loaded');
            var filled = fillTemplate(template.clone(), repo.name, null, null);
            content.append(filled);
        }

        animation(div, offset);
    });
}

function setupLastfmTile(animation, div, offset) {
    "use strict";

    var cache = new LastFMCache();
    var lastfm = new LastFM({
        apiKey    : '4823457a7472a620207cf21ad7663f57',
        apiSecret : '7f26392d49ddd3251532c75ab4e0dc7f',
        cache     : cache
    });

    lastfm.user.getTopArtists({
        user: 'tehrikkit',
        limit: 5,
        period: '7day'
    }, {success: function(data){
        var content = div.find('.tile-content');
        var template = content.children('li').clone();

        content.children().remove();

        for (var i=0; i<data.topartists.artist.length; i++){
            var artist = data.topartists.artist[i];
            console.log('Lastfm Tile: ' + artist.name + ' loaded');

            var filled = fillTemplate(template.clone(), artist.name, null, artist.image[3]['#text'])
            content.append(filled);
        }

        animation(div, offset);
    }}, {error: function(code, message){
        console.log('Lastfm Tile Error:' + code + message);
    }});
}

function setupMapTile(animation, div, offset) {
    "use strict";

    var content = div.find('.tile-content');
    var template = content.children('li').first().clone();

    content.children().remove();

    for (var i=1; i<=9; i++)
    {
        var filled = fillTemplate(template.clone(), null, null, '/res/img/bath_' + i + '.jpg');
        content.append(filled);
    }

    console.log('Photo tiles filled')


    animation(div, offset);
}