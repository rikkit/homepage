/**
 * TODO support other kinds of template
 * @param template
 * @param primary
 * @param secondary
 * @param image
 */
function fillTemplate(template, lead, sub, image){

    var imagediv = template.find('.template-image');
    if (template.hasClass('template-image'))
    {
        imagediv = template;
    }

    imagediv.css({
        'background-image' : 'url("' + image + '")'
    });
    template.find('.template-lead').text(lead);

    console.log("Template filled: " + lead + '; ' + sub + '; ' + image);
    return template;
}

function populateLastfmTile(animation, div)
{
    var cache = new LastFMCache();
    var lastfm = new LastFM({
        apiKey    : '4823457a7472a620207cf21ad7663f57',
        apiSecret : '7f26392d49ddd3251532c75ab4e0dc7f',
        cache     : cache
    });

    lastfm.user.getTopArtists({
        user: 'tehrikkit',
        limit: 3,
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

        animation(div);
    }}, {error: function(code, message){
        console.log('Lastfm Tile Error:' + code + message);
    }});
}

function metroTileAnimation(div){
    if (div.length){
        div.cycle({
            delay: 0,
            autostop: 1,
            speed: 1050,
            easing: 'easeOutQuint',
            fx: 'scrollUp'
        });

        div.find('.tile-content').cycle({
            delay: 4000,
            timeout: 5000,
            speed: 1050,
            easing: 'easeOutQuint',
            fx: 'scrollUp'
        });
    }
}