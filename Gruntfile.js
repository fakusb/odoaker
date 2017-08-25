let password = require('./password');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-copy');

    // noinspection Annotator
    grunt.initConfig({
        screeps: {
            options: {
                email: 'fkunze@fkunze.de',
                password: password,
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['built/*.js']
            }
        },
        ts: {
            default:{
                tsconfig : true
            },
            watch_ts:{
                tsconfig : true,
                watch: "."
            }
        },
        copy: {
            default:{
                expand: true,
                cwd: 'node_modules/screeps-profiler',
                src: '*.js',
                dest: 'built/',
            }
        }
    });

    grunt.registerTask('default', ['copy','ts:default','screeps']);

};