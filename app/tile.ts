/// <reference path="../typings/index.d.ts" />

export class Tile {
/**
 * Fill the provided TILE template with provided data
 */
    fillTileTemplate(tileTemplate, title, href, cssStyle) {
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
    fillContentTemplates(original, data){
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

    metroTileAnimation(tile :JQuery, offset, name){
        if (tile.length){
            var faces = tile.find('> .faces');
            if (faces.length)
            {
                var content = faces.find('.tile-content');
                var delayMs = offset * 50;
                
                faces.cycle({
                    timeout: 0,
                    speed: 1050,
                    easing: 'easeOutQuint',
                    fx: 'scrollUp'
                });

                if (content.children().length > 1)
                {
                    content.cycle({
                        delay: 5800 + delayMs,
                        timeout: 6000,
                        speed: 1050,
                        easing: 'easeOutQuint',
                        fx: 'scrollUp'
                    });
                }

                setTimeout(function () {
                    console.log("Flipped tile " + name);
                    faces.cycle('next');
                }, 4000 + delayMs);
            }
        }
    }

    /**
     * TODO make metroTileAnimation configurable
     * @param id
     * @returns {metroTileAnimation}
     */
    public getAnimation(id){
        switch (id){
            case 'ease-01':
                return this.metroTileAnimation;
            default:
                return this.metroTileAnimation;
        }
    }

    loadedTemplates = [];

    loadTemplateAsync(id, post) {
        var filename = './res/html/' + id + '.html';

        $.get(filename, function(html) {
            var template = $($.parseHTML(html));

            this.loadedTemplates.push({ id: id, template: template });

            post(template);
        });
    }

    getTemplateAsync(id, post) {
        var matchId = function(x) {
            return x.id == id;
        }

        // TODO this was causing duplicate templates
        //if (trueForAny(loadedTemplates, matchId)) {
        //    var to = firstInList(loadedTemplates, matchId);
        //    if (to) {
        //        post(to.template);
        //    }
        //}

        this.loadTemplateAsync(id, post);
    }

    trueForAny(list, predicate){
        "use strict";

        for (var i = 0; i < list.length; i++) {
            if (predicate(list[i])){
                return true;
            }
        }

        return false;
    }

    firstInList(list, predicate) {
        "use strict";

        for (var i = 0; i < list.length; i++) {
            if (predicate(list[i])){
                return list[i];
            }
        }
    }

}