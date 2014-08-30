import DS from 'ember-data';

var TileData = DS.Model.extend({
	name: DS.attr('string'),
	image: DS.attr('string'),
	overlay: DS.attr('boolean')
});

export default TileData;