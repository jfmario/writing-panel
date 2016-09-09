
var fs = require ( 'fs' );
var fsPath = require ( 'fs-path' );
var markdown = require ( 'markdown' ).markdown;
var mkdirp = require ( 'mkdirp' );
var nunjucks = require ( 'nunjucks' );
var path = require ( 'path' );
var yaml = require ( 'yamljs' );

var env = nunjucks.configure( path.resolve ( __dirname, './theme/' ), {
    tags: {
        blockStart: '{%',
        blockEnd: '%}',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
    }
});

var config = yaml.load ( path.resolve ( __dirname, './config', 'project.yml' ) );
console.log ( config );
var indexCount = 0;
for ( var i = 0; i < config.toc.length; ++i )
{
    if ( config.toc [i].index !== null )
        config.toc [i].index = ++indexCount;
}
for ( var i = 0; i < config.toc.length; ++i )
{

    var src = fs.readFileSync ( path.resolve ( __dirname, './src',
        config.toc [i].src + '.md' ) ).toString ();
    var content = markdown.toHTML ( src );
    var currentSlug = config.toc [i].src;

    fsPath.writeFileSync ( path.resolve ( __dirname, './dist/', currentSlug,
        'index.html' ), env.render ( path.resolve ( __dirname, './theme',
        'index.html' ), { config: config, content: content,
        currentSlug: currentSlug } ) );
}

fsPath.writeFileSync ( path.resolve ( __dirname, './dist/',
    'index.html' ), env.render ( path.resolve ( __dirname, './theme',
    'index.html' ), { config: config, content: config.desc,
    currentSlug: null } ) );
