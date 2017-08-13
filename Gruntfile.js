let password = require('./password');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

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
        }
    });
};