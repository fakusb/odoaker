let password = require('./password');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'fkunze@fkunze.de',
                password: password,
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['simTest/*.js']
            }
        }
    });
};