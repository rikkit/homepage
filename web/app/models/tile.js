import DS from 'ember-data';

var Tile = DS.Model.extend({
    'tile-template': DS.attr('string', {defaultValue: 'tt-01'}),
    'content-template': DS.attr('string', {defaultValue: 'ct-fill'}),
    animation: DS.attr('string', {defaultValue: 'ease-01'}),
    title: DS.attr('string'),
    style: DS.attr('string'),
    href: DS.attr('string'),
    size: DS.attr('string'),
    'tile-data' : DS.hasMany('tile-data', {embedded: 'always'})
});

export default Tile;