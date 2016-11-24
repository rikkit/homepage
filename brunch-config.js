module.exports = {
   npm: {
     globals: {
      $: 'jquery',
      jQuery: 'jquery',
      NProgress: 'nprogress'
  }},
  // See http://brunch.io for documentation.
  files: {
    javascripts: {
      joinTo: {
        'js/app.js': /^app/,
        'js/vendor.js': /(^node_modules|^vendor)/ 
      },
      order: {
        before: /.*jquery.js*/
      }
    },
    stylesheets: { joinTo: 'app.css' },
    templates: { joinTo: 'app.js' }
  },
  plugins: {
    sass: {
      options: {
        includePaths: [
          'node_modules/bootstrap-sass/assets/stylesheets/',
          'vendor/'
        ]
      }
    },
    brunchTypescript: {
      removeComments: true,
      target: "ES6"
    }
  }
}
