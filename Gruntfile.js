module.exports = function(grunt) {
	var banner = "/* (c) 2016, jfang @ self.study. <%= pkg.name %> v<%= pkg.version%> <%= grunt.template.today('isoDateTime') %> */";
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		sass: {
			dist: {
				files: {
					"client/bin/app.css" : "client/sass/app.scss"
				}
			}
		},
        // concat
		concat: {
            app: {
                src: [
                    "client/libs/angular/angular.min.js",
                    "client/libs/angular-route/angular-route.min.js",
                    "client/libs/angular-resource/angular-resource.min.js",
    			    "client/libs/jquery/dist/jquery.min.js",
    				"client/libs/bootstrap/dist/js/bootstrap.min.js",
                    "client/js/app.js",
                    "client/js/factory/utilityService.js",
                    "client/js/controllers/blog-controller.js"
                ],
                dest: "client/bin/app.js"
            }
        },
        // Minify and concatenate css files deposited in bin by grunt-less. https://github.com/gruntjs/grunt-contrib-cssmin
        cssmin: {
           options: {
              report: "min",
              banner: banner
           },
           compress: {
              files: {
                 "client/dist/app.min.css": [
                     "client/bin/app.css"
                 ]
              }
           }
        },
        // Uglify js files
		uglify: {
        	options: {
                beautify: false,
                report: "min",
                banner: banner,
                sourceMap: true,
                compress: {
                    drop_console: true
                }
            },
            app: {
                src: "client/bin/app.js",
                dest: "client/dist/app.min.js"
            }
        },
        // watch code change and do various tasks
		watch: {
			clientSass: {
				files: "**/*.scss",
				tasks: ["sass"]
			},
            clientJS: {
                files: ["client/js/*.js"],
                tasks: ["concat", "uglify"],
                options: {
                    debounceDelay: 250
                }
            },
   		    clientCSS: {
                files: ["client/bin/*.css"],
                tasks: ["cssmin"],
                options: {
                    debounceDelay: 250
                }
            }
		}
	});
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.registerTask("default", ["sass", "concat", "uglify", "cssmin"]);
}
