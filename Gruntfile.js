
module.exports = function (grunt) {
    
    grunt.initConfig({
        serverCredentials: grunt.file.readJSON('serverCredential.json'),

        //watch for any change in .scss files in scss folder,
        //and if change detected then perform sass task to compile scss into css
        watch: {
            files: 'app/scss/*.scss',
            tasks: ['sass']
        },

        //compiling scss into css
        sass: {
            dev: {
                files: {
                    'app/css/main.css': 'app/scss/main.scss'
                }
            }
        },
        //for browser reload on change of any .html, .css, .js file in app folder
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'app/css/*.css',
                        'app/*.html',
                        'app/js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './app'
                }
            }
        },
        //minifying html files
        htmlmin: {
            options: {
                removeComments: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    src: ['src/**/*.html', '*.html'],
                    dest: 'build'
                }]
            }
        },
        //minifying css all css files
        cssmin:{
            my_target:{
                files:[{
                    expand: true,
                    cwd: 'app/css/',
                    src: ['*.css'],
                    dest: 'build/css/',
                    ext: '.min.css'
                }]
            }
        },
        //minify/uglify js files
        uglify: {
            minify_js: {
                files: [{
                    expand: 'true',
                    cwd: 'app/js',
                    src: '*js',
                    dest: 'build/js',
                    // ext: '.min.js',
                    flatten: 'false'
                }]
            }
        },
        //to compress images using tinypng
        tinypng: {
            options: {
                apiKey: "yA2fsBv5SvSzUnkWcVmOj1oMYEOJltKu",
                checkSigs: "true",
                sigFile: "app/file_sigs.json",
                sigFileSpace: 1,
                summarize: true,
                summarizeOnError: true,
                showProgress: true,
            },
            compress: {
                expand: true, 
                cwd: 'app/images/',
                src: ['*.png'], 
                dest: 'build/images',
                // ext: '.min.png'
            }
        },
        // deploy on the server
        'sftp-deploy': {
            build: {
              auth: {
                host: 'your server name',
                port: 22,
                authKey: {
                    "username": "your username",
                    "password": "your password"
                },
              },
              cache: false,
              src: 'build',
              dest: 'destination folder name',
            //   exclusions: ['/path/to/source/folder/**/.DS_Store', '/path/to/source/folder/**/Thumbs.db', 'dist/tmp'],
              serverSep: '/',
              localSep: '/',
              concurrency: 4,
              progress: true
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-tinypng');
    grunt.loadNpmTasks('grunt-sftp-deploy');

    // define default task
    grunt.registerTask('default', ['browserSync', 'watch']);
    // custom task to create prod-build
    grunt.registerTask('build', ['htmlmin' ,'cssmin', 'uglify', 'tinypng']);

    // custom task to deploy project on server
    grunt.registerTask('deploy', ['sftp-deploy']);
};