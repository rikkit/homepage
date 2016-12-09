/// <reference path="../typings/index.d.ts" />

import Utils from "./utils";

export class Tile {
    private tiles :JQuery[];
    private currentIndex :number = 0;
    private maxIndex :number;
    private isAnimating :boolean = true;

    public constructor(tiles :JQuery[]) {
        this.tiles = tiles;
        this.maxIndex = tiles.length;
    }
    
    public toggle = async () => {
        if (!this.isAnimating) {
            this.isAnimating = true;
            await this.animate();
        }
        else {
            this.isAnimating = false;
        }        
    }

    public animate = async () => {
        if (!this.isAnimating) {
            return;
        }

        const averageDelay = 300;
        const tileDelayVariance = 0.2 * averageDelay;

        let tileDelay = averageDelay - tileDelayVariance + (Math.random() * tileDelayVariance);        
        await Utils.delay(tileDelay);
        
        let tile = this.tiles[this.currentIndex];
        if (!(tile.data("initialised") as boolean || false))
        {
            this.initialiseTileAnimate(tile);
            tile.data("initialised", true);
        }
        else {
            this.faceAnimate(tile);
        }
            
        this.currentIndex++;
        if (this.currentIndex >= this.maxIndex) {
            this.currentIndex = 0;
        }

        // increases the delay before animation can be toggled before the next animation starts
        await Utils.delay(3900);
        if (this.isAnimating) {
            setTimeout(this.animate, 100);
        }
    }

    private initialiseTileAnimate(tile :JQuery) {
        var faces = tile.find('> .faces');
        var content = faces.find('.tile-content');
        
        faces.cycle({
            timeout: 0,
            speed: 1200,
            easing: 'easeOutQuint',
            fx: 'scrollUp'
        });

        content.cycle({
            timeout: 0, // disable autoadvance
            speed: 1200,
            easing: 'easeOutQuint',
            fx: 'scrollUp'
        });

        faces.cycle('next');
    }

    private faceAnimate(tile :JQuery) {
        var content = tile.find('> .faces .tile-content');

        if (content.children().length > 1)
        {
            content.cycle("next")
        }
    }

    static metroTileAnimation(tile :JQuery, offset, name){
        if (tile.length){
            var faces = tile.find('> .faces');
            if (faces.length)
            {
                var content = faces.find('.tile-content');
                
                faces.cycle({
                    timeout: 0,
                    speed: 1200,
                    easing: 'easeOutQuint',
                    fx: 'scrollUp'
                });

                if (content.children().length > 1)
                {
                    content.cycle({
                        delay: offset,
                        timeout: 0, // disable autoadvance
                        speed: 1200,
                        easing: 'easeOutQuint',
                        fx: 'scrollUp'
                    });
                }

                setTimeout(function () {
                    console.log("Flipped tile " + name);
                    faces.cycle('next');
                }, offset);
            }
        }
    }
}