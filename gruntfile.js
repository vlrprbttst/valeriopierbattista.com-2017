module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //path variables
        source: '_src',
        dev: '_dev',
        site: '_site',
        scss: 'scss',
        css: 'css',
        js: 'js',
        images: 'images',
        fonts: 'fonts',
        favicons: 'favicons',

        /* ====================================================================================================================================================
         * ====================================================================================================================================================

         Watch

         ====================================================================================================================================================
         ====================================================================================================================================================
         *
         */

        watch: {
            content: {
                files: ['<%= source %>/**/*.html'],
                tasks: ['newer:processhtml:dev']
            },
            images: {
                files: ['<%= source %>/<%= images %>/**/*.{png,jpg,gif,svg}'],
                tasks: ['newer:imagemin', 'copy:unoptimizedImage']
            }, // watch images added to src

            scripts: {
                files: ['<%= source %>/<%= js %>/custom/**/*.js'],
                tasks: ['copy:js'],
                options: {
                    spawn: false,
                }
            },

            scss: {
                files: ['<%= source %>/<%= scss %>/**/*.scss'],
                tasks: ['newer:sass:dist', 'postcss:dev'],
                options: {
                    spawn: false,
                }
            }, //end of sass watch

            partial_scss: {
                files: ['<%= source %>/<%= scss %>/**/_*.scss'],
                tasks: ['sass:partials', 'postcss:dev'],
                options: {
                    spawn: true,
                }
            }, //end of sass partials watch

            grunt: {
                files: ['gruntfile.js']
            }
        }, //end of watch

        /* ====================================================================================================================================================
         * ====================================================================================================================================================

         Tasks

         ====================================================================================================================================================
         ====================================================================================================================================================
         *
         */



        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: '<%= site %>', // Src matches are relative to this path.
                    src: ['**/*.html'], // Actual pattern(s) to match.
                    dest: '<%= site %>', // Destination path prefix.
                    ext: '.html', // Dest filepaths will have this extension.
                    extDot: 'first' // Extensions in filenames begin after the first dot
                }]
            }
        },

        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 7,
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '<%= source %>/<%= images %>/', // source images (not compressed)
                    src: ['**/*.{png,jpg,gif,svg}'], // Actual patterns to match
                    dest: '<%= dev %>/<%= images %>/' // Destination of compressed files
                }]
            }
        }, //end imagemin

        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    '<%= dev %>/<%= js %>/libs/jquery/dist/jquery.js','<%= dev %>/<%= js %>/custom/headroom.js','<%= dev %>/<%= js %>/custom/anim.js','<%= dev %>/<%= js %>/custom/main.js'
                ],
                dest: '<%= site %>/<%= js %>/production.js'
            }
        }, //end concat

        uglify: {
            options: {
                mangle: false
            },
            dist: {
                src: '<%= site %>/<%= js %>/production.js',
                dest: '<%= site %>/<%= js %>/production.min.js'
            }
        }, //end uglify

        sass: {
            dist: {
                options: {
                    require: 'susy',
                    compass: true
                },
                files: {
                    '<%= dev %>/<%= css %>/main.css': '<%= source %>/<%= scss %>/main.scss'
                }
            }, //dist

            partials: {
                options: {
                    require: 'susy',
                    compass: true
                },
                files: {
                    '<%= dev %>/<%= css %>/main.css': '<%= source %>/<%= scss %>/main.scss'
                }
            }
        }, //end of sass

        postcss: {
            dev: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({
                            browsers: 'last 2 version, IE 9'
                        }),

                    ]
                },
                src: '<%= dev %>/<%= css %>/main.css'
            },
            build: {
                options: {
                    map: false,
                    processors: [
                        require('cssnano')({
                            minifyFontValues: {
                                removeQuotes: false
                            },
                            discardUnused: false,
                            discardComments: true,
                            mergeIdents: false,
                            mergeRules: false,
                            reducePositions: false,
                            discardOverridden: false,
                            normalizeUnicode:false,
                            zindex: false
                        })
                    ]
                },
                src: '<%= site %>/<%= css %>/main.css'
            }
        }, //postcss

        browserSync: {
            dev: {
                bsFiles: {
                    src: ['<%= dev %>/**', '<%= source %>/!.sass-cache']
                },
                options: {
                    server: {
                        baseDir: "<%= dev %>/"
                    },
                    ghostMode: false,
                    open: false,
                    watchTask: true
                }
            }
        },

        processhtml: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= source %>/',
                    src: ['**/*.html', '!_includes/**/*.html','!_layouts/**/*.html'],
                    dest: '<%= dev %>/',
                    ext: '.html'
                }, ],
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= dev %>/',
                    src: ['**/*.html'],
                    dest: '<%= site %>/',
                    ext: '.html'
                }, ],
            }
        },

        clean: ["<%= site %>"],

        copy: {
            the_html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>',
                    dest: '<%= dev %>/',
                    src: ['**/*.html']
                }]
            },
            static_files: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>',
                    dest: '<%= dev %>/',
                    src: ['twitterfeed','*.php']
                }]
            },
            static_files_build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= dev %>',
                    dest: '<%= site %>/',
                    src: ['twitterfeed/**/*.*','*.php']
                }]
            },
            js_custom: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= dev %>',
                    dest: '<%= site %>/',
                    src: ['js/custom/**/*.js']
                }]
            },
            the_fonts: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>/<%= fonts %>',
                    dest: '<%= dev %>/<%= fonts %>',
                    src: ['*.*']
                }]
            },
            bower: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'bower_components',
                    dest: '<%= dev %>/<%= js %>/libs/',
                    src: ['jquery/dist/jquery.js']
                }]
            },
            js: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= source %>/<%= js %>',
                    dest: '<%= dev %>/<%= js %>',
                    src: ['**/*.js']
                }]
            },
            unoptimizedImage: {
                expand: true,
                cwd: '<%= source %>/<%= images %>/',
                src: ['**/*.{png,jpg,gif,svg}'],
                dest: '<%= dev %>/<%= images %>/',

                filter: function(filepath) {

                    var path = require('path');
                    var dest = path.join(
                        grunt.config('copy.main.dest'),
                        path.basename(filepath)
                    );
                    return !(grunt.file.exists(dest));
                },
            },
            favicons: {
                // use http://realfavicongenerator.net/ to generate them
                expand: true,
                dot: true,
                cwd: '<%= source %>/<%= images %>/<%= favicons %>',
                src: ['*.ico','*.json','*.xml'],
                dest: '<%= dev %>/<%= images %>/<%= favicons %>',
            },
            images: {
                expand: true,
                dot: true,
                cwd: '<%= dev %>/<%= images %>',
                src: '**',
                dest: '<%= site %>/<%= images %>',
            },
            css_build: {
                expand: true,
                dot: true,
                cwd: '<%= dev %>/<%= css %>',
                src: 'main.css',
                dest: '<%= site %>/<%= css %>',
            },
            fonts_build: {
                expand: true,
                dot: true,
                cwd: '<%= dev %>/<%= fonts %>',
                src: '**',
                dest: '<%= site %>/<%= fonts %>',
            },
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // default for development: type grunt
    grunt.registerTask('default', ['browserSync', 'watch']);
    // rebuild the _site folder: type grunt build
    grunt.registerTask('build', ['clean', 'processhtml:build', 'htmlmin', 'concat', 'uglify', 'copy:css_build', 'postcss:build', 'copy:images','copy:fonts_build','copy:static_files_build','copy:js_custom']);

};
