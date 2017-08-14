let password = require('./password');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks("grunt-ts");

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
            }
        }
    });
    grunt.registerTask('full', ['ts', 'screeps']);

};