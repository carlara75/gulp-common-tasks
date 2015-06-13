'use strict';
var argv = require('yargs').argv;

var config = {
    watch: [
        {glob: ['app/**/*.html'], tasks: ['ng-templates'], reload: true},
        {glob: ['app/styles/**/*.{scss,css}'], tasks: ['styles'], reload: true},
        {glob: ['app/elements/**/*.{scss,css}'], tasks: ['styles:elements'], reload: true},
        {glob: ['app/**/*.ts'], tasks: ['scripts'], reload: true},
        {glob: ['app/**/*.js'], tasks: ['jshint'], reload: true},
        {glob: ['app/images/**/*'], reload: true}
    ],
    paths: {
        dest: argv.production ? 'dist' : '.tmp'
    },
    styles: {
        src: [
            'app/styles/**/*.scss',
            'app/styles/**/*.css'
        ],
        elements: [
            'app/elements/**/*.scss',
            'app/elements/**/*.css'
        ]
    },
    typescript: {
        src: [
            'app/app*.ts',
            'app/components/**/*.ts'
        ]
    },
    ngTemplates: {
        src: [
            'app/app.html',
            'app/components/**/*.html'
        ],
        options: {
            //module: 'templates',
            //standalone: false,
            //moduleSystem: 'RequireJS'
        }
    }
};

module.exports = config;