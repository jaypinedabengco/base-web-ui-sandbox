'use strict';
module.exports = function(grunt) {

  //load
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');

  //init
  grunt.initConfig({
    configuration : {
        app : 'app',  
        dest : 'dist',
        build_date : grunt.template.today('yyyymmdd'),
        build_time : grunt.template.today('hh:MM TT')
    },

    /* copy */    
    copy : {
        build : {
            files : [{expand:true, cwd : '<%= configuration.app %>', src : ["**"], dest : "<%= configuration.dest %>/" }]
        }
    },

    /* build date */
    'string-replace' : {
        'update-build-date': {
            files : [{
                expand : true,
                cwd : '<%=configuration.dest%>',
                src : '**/*',
                dest : '<%=configuration.dest%>'
            }],
            options: {
                replacements: [
                    {pattern: '_update._build.date', replacement: '<%=configuration.build_date%>'}, 
                    {pattern: '_update._build.time', replacement: '<%=configuration.build_time%>'}
                ]
            }    
        }
    },

    /*Compress*/
    compress: {
        main: {
            options: {
                mode: 'gzip'
            },
            expand: true,
            cwd: '<%=configuration.dest%>',
            src: ['js/*.js', 'css/*.css'],
            dest: '<%=configuration.dest%>'
        }
    },

    /* AWS */
    aws_s3 : {
        options : {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,                 /* get params from system environment */
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,          /* get params from system environment */
            region : 'us-east-1'
        }, 
        clean : {
            options : {
                bucket : 'sandbox-container'
            }, 
            files: [
               {dest: '/', src:['**/*'], action: 'delete', exclude : '/backup'},
            ]
        },
        download_for_backup : {
            options : {
                bucket : 'sandbox-container'
            }, 
            files: [
                {cwd: '<%=configuration.dest%>/backups/', dest: '/', action: 'download'},
            ]
        },
        upload_for_backup : {
            options : {
                bucket : 'sandbox-container-backups'
            }, 
            files: [
                {
                    expand: true, 
                    cwd: '<%=configuration.dest%>/backups', 
                    src: ['**/*'],
                    dest: (grunt.template.today('yyyymmdd-HH:MM:ss') + '/'), 
                    action: 'upload'
                },
            ]
        },        
        deploy : {
            options : {
                bucket : 'sandbox-container'
            },
            files: [
                {expand: true, cwd: '<%=configuration.dest%>', src: ['**/*.js', '**/*.css'], dest: '/', action: 'upload', params : { ContentEncoding: 'gzip' } },
                {expand: true, cwd: '<%=configuration.dest%>', src: ['**/*.html'], dest: '/', action: 'upload'},
            ]                        
        },
        deploy_test : {
            options : {
                bucket : 'sandbox-container'
            },
            files: [
                    {
                        expand: true, 
                        cwd: 'temp', 
                        src: ['**/*.js', '**/*.css'],
                        dest: '/', action: 'upload',
                        params : { ContentEncoding: 'gzip' } 
                    }
            ]                        
        }        
    }
  });
  

  //custom tasks
  grunt.registerTask('deploy', [
      'aws_s3:clean',
      'aws_s3:deploy'
  ]);

  grunt.registerTask('build', [
      'copy:build',
      'compress:main',
      'string-replace:update-build-date',
      'backupStage',
      'deploy'
  ]);

  grunt.registerTask('backupStage', [
    'aws_s3:download_for_backup',
    'aws_s3:upload_for_backup'
  ]);

  grunt.registerTask('hello',function(){
      grunt.log.write('hello world');
  })

};