/**
 * Fill the provided TILE template with provided data
 * @param tileTemplate
 * @param title
 * @param href
 * @param cssStyle
 */
function fillTileTemplate(tileTemplate, title, href, cssStyle) {
    "use strict";

    var titleElement = tileTemplate.find('.title');
    if (titleElement) {
        titleElement.text(title);
    }

    var tileLink = tileTemplate.find('.tile-link');
    if (tileLink) {
        tileLink.attr('href', href);
    }

    if (!tileTemplate.hasClass(cssStyle))
    {
        tileTemplate.toggleClass(cssStyle);
    }

    return tileTemplate;
}

/**
 * Fill content-templates with data.
 * @param ul
 * @param id
 * @param data
 */
function fillContentTemplates(original, data){
    "use strict";

    var filled = [];

    for (var i = 0; i < data.length; i++){
        var d = data[i];
        var template = original.clone();

        if (d.image){
            // look for .template-image, if not default to main template for image
            var imagediv = template.find('.template-image');
            if (!imagediv.length)
            {
                imagediv = template;
            }

            imagediv.css({
                'background-image' : 'url("' + d.image + '")'
            });
        }

        if (d.name)
        {
            template.find('.template-lead').text(d.name);
        }

        if (d.overlay == false){
            template.find('.template-overlay').remove();
        }

        filled.push(template);
        console.log("Template filled: " + d.name + '; ' + d.image);
    }

    return filled;
}

function metroTileAnimation(tile, offset){
    if (tile.length){
        var faces = tile.find('> .faces');
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

/**
 * TODO make metroTileAnimation configurable
 * @param id
 * @returns {metroTileAnimation}
 */
function getAnimation(id){
    switch (id){
        case 'ease-01':
            return metroTileAnimation;
        default:
            return metroTileAnimation;
    }
}

var loadedTemplates = [];

function loadTemplateAsync(id, post) {
    var filename = './res/html/' + id + '.html';

    $.get(filename, null, function(html) {
        var template = $($.parseHTML(html));

        loadedTemplates.push({id: id, template: template});

        post(template);
    })
}

function getTemplateAsync(id, post) {
    if (!id) {
        id = '01';
    }

    var matchId = function(x) {
        return x.id == id;
    }

    if (trueForAny(loadedTemplates, matchId)) {
        var to = firstInList(loadedTemplates, matchId);
        if (to) {
            post(to.template);
        }
    }

    loadTemplateAsync(id, post);
}

function trueForAny(list, predicate){
    "use strict";

    for (var i = 0; i < list.length; i++) {
        if (predicate(list[i])){
            return true;
        }
    }

    return false;
}

function firstInList(list, predicate) {
    "use strict";

    for (var i = 0; i < list.length; i++) {
        if (predicate(list[i])){
            return list[i];
        }
    }
}