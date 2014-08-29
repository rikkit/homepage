import DS from 'ember-data';

var Tile = DS.Model.extend({
    'tile-template': DS.attr('string', {defaultValue: 'tt-01'}),
    'content-template': DS.attr('string', {defaultValue: 'ct-fill'}),
    animation: DS.attr('string', {defaultValue: 'ease-01'}),
    title: DS.attr('string', {defaultValue: '<undefined>'}),
    style: DS.attr('string'),
    href: DS.attr('string'),
    size: DS.attr('string'),
    data : null
});


Tile.reopenClass({
    FIXTURES: [
        {
            id: 0,
            "tile-template": "tt-01",
            "content-template": "ct-fill",
            animation: "ease-01",
            title: "Github",
            style: "github",
            href: "http://github.com/rikkit",
            size: "wide",
            data: [
              {
                "name": "4mix-errors",
                "overlay": false
              },
              {
                "name": "banzai",
                "overlay": false
              },
              {
                "name": "bass",
                "overlay": false
              },
              {
                "name": "Cimbalino-Phone-Toolkit",
                "overlay": false
              },
              {
                "name": "discourse-import-phpBB",
                "overlay": false
              }
            ]
        }
    ]
});

export default Tile;