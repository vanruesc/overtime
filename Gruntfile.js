"use strict";

module.exports = function(grunt)
{
  // Project configuration.
  grunt.initConfig({
    license: require("fs").readFileSync("LICENSE").toString(),
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      gruntfile: {
        src: "Gruntfile.js"
      },
      lib: {
        src: ["src/**/*.js"]
      },
      test: {
        src: ["test/**/*.js"]
      }
    },
    nodeunit: {
      files: "<%= jshint.test.src %>"
    },
    browserify: {
      build: {
        src: ["<%= jshint.lib.src %>"],
        dest: "build/<%= pkg.name %>.js",
        options: {
          banner: "/**\n * <%= pkg.name %> build <%= grunt.template.today(\"dd.mm.yyyy\") %>\n *\n<%= license %>\n */\n",
          browserifyOptions: {
            standalone: "Overtime"
          }
        }
      }
    },
    uglify: {
      build: {
        options: {
          banner: "<%= browserify.build.options.banner %>",
          mangle: {
            except: ["<%= browserify.build.options.browserifyOptions.standalone %>"]
          }
        },
        files: {
          "build/<%= pkg.name %>.min.js": ["<%= browserify.build.dest %>"]
        }
      }
    },
    watch: {
      gruntfile: {
        files: "<%= jshint.gruntfile.src %>",
        tasks: ["jshint:gruntfile"]
      },
      lib: {
        files: "<%= jshint.lib.src %>",
        tasks: ["jshint:lib", "nodeunit"]
      },
      test: {
        files: "<%= jshint.test.src %>",
        tasks: ["jshint:test", "nodeunit"]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task.
  grunt.registerTask("default", ["jshint", "nodeunit", "browserify", "uglify"]);
};
