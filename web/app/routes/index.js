import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
    model: function() {        
        //Ember.$.getJSON('http://localhost:8080/api/all', function(tiles) {
        //    tiles.forEach(function(tile){
        //        DS.Store.push('tile', tile);
        //    });
        //});
        
        return this.store.find('tile');
    }
});
