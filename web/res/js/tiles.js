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

        if (d.overlay != true){
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
            var delayMs = offset * 1750;

            faces.cycle({
                timeout: 0,
                speed: 1050,
                easing: 'easeOutQuint',
                fx: 'scrollUp'
            });

            if (content.children().length > 1)
            {
                content.cycle({
                    delay: 4250 + delayMs,
                    timeout: 4500,
                    speed: 1050,
                    easing: 'easeOutQuint',
                    fx: 'scrollUp'
                });
            }

            setTimeout(function(){
                faces.cycle('next');
            }, delayMs);
        }
    }
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