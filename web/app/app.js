import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import DS from 'ember-data';

Ember.MODEL_FACTORY_INJECTIONS = true;
Ember.Inflector.inflector.uncountable('data');

var App = Ember.Application.extend({
  modulePrefix: 'web', // TODO: loaded via config
  Resolver: Resolver
});

loadInitializers(App, 'web');

export default App;
