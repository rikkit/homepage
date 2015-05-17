module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        replace: {
            prod: {
                options: {
                    patterns: [{
                        match: 'API_ROOT',
                        replacement: 'var API_ROOT = "api.rikk.it";'
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['res/js/main.js'],
                    dest: 'built/res/js'
                }]
            },
            dev: {
                options: {
                    patterns: [{
                        match: 'API_ROOT',
                        replacement: 'var API_ROOT = "localhost:4420";'
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['res/js/main.js'],
                    dest: 'res/js'
                }]
            }
        },
        less: {
            dev: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "res/css/style.css": "res/css/style.less"
                }
            }
        },
        watch: {
            styles: {
                files: ['res/css/style.less'], // which files to watch
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            },
            env: {
                files: ['res/js/main.js'],
                tasks: ['replace'],
            }
        }
    });

    // TODO copy built to diff directory w/ replace
    grunt.registerTask('default', ['less:dev', 'watch']);
    grunt.registerTask('buildProd', ['less:dev'])
};
