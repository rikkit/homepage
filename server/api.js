var async = require('async');

var LastFmNode = require('lastfm').LastFmNode;
var github = require('octonode');

function makeErr(code, message, label) {
    return {'code':code,'error':message, 'label': label};
}

function refreshTopArtists(yep, nope){
    var lastfm = new LastFmNode({
        api_key: '4823457a7472a620207cf21ad7663f57',    // sign-up for a key at http://www.last.fm/api
        secret: '7f26392d49ddd3251532c75ab4e0dc7f',
        useragent: 'homepage/v1 (node)' // optional. defaults to lastfm-node.
    });

    var lastRequest = lastfm.request('user.getTopArtists', {
        user: 'tehrikkit',
        limit: 5,
        period: '7day'
    });

    lastRequest.on('error', function(error){
        nope(error);
    });

    lastRequest.on('success', function(json){
        var data = [];
        for (var i = 0; i < json.topartists.artist.length; i++) {
            var lastArtist = json.topartists.artist[i];

            var artist = {
                'name': lastArtist.name,
                'image': lastArtist.image[3]['#text'],
                'overlay': true
            };

            data.push(artist);
        }

        // TODO cache data var

        yep(data);
    });
}

function refreshGithubProjects(yep, nope) {
    var client = github.client('1d4f3baa5f5a7322f451de67ded5a45c5886e735');

    var me = client.me();

    me.repos({
        page: 1,
        per_page: 5
    }, function(err, repos, headers) {
        if (err) {
            nope(err);
        }
        else {
            var data = [];
            for (var i=0; i<repos.length; i++){
                data.push({'name': repos[i].name, 'overlay': false});
            }

            // TODO cache data var
            yep(data);
        }
    });
}

function buildTopArtistsTile(post) {
    refreshTopArtists(function(artists){
        var tile = {
            'tile-template': 'tt-01',
            'content-template': 'ct-fill',
            'animation': 'ease-01',
            'title': 'Last.fm',
            'style': 'lastfm',
            'href': 'http://last.fm/user/tehrikkit',
            'size': 'large',
            'data': artists
        };

        post(null, tile);
    }, function(err){
        post(makeErr(500, err, arguments.callee));
    });
}

function buildGithubProjectsTile(post) {
    refreshGithubProjects(function(repos) {
        var tile = {
            'tile-template': 'tt-01',
            'content-template': 'ct-fill',
            'animation': 'ease-01',
            'title': 'Github',
            'style': 'github',
            'href': 'http://github.com/rikkit',
            'size': 'wide',
            'data': repos
        };

        post(null, tile);
    }, function(err){
        post(makeErr(500, err, arguments.callee));
    });
}

function buildBlogTile(post) {
    var tile = {
        'tile-template': 'tt-02',
        'content-template': null,
        'title': 'Blog',
        'style': 'blog',
        'size': 'medium',
        'href': 'http://rikk.it/blog'
    };

    post(null, tile);
}

function buildMapTile(post) {
    var tile = {
        'tile-template': 'tt-01',
        'content-template': 'ct-fill',
        'animation': 'ease-01',
        'title': 'Hometown',
        'style': 'map',
        'size': 'wide',
        'href': 'http://her.is/uLjXEx',
        'data': []
    };

    for (var i=1; i<=9; i++)
    {
        tile.data.push({
            'name': 'Bath, UK',
            'image':  '/res/img/bath_' + i + '.jpg',
            'overlay': true
        });
    }

    post(null, tile);
}

exports.all = function(req, res) {
    async.parallel([
        buildTopArtistsTile,
        buildGithubProjectsTile,
        buildMapTile,
        buildBlogTile
    ], function(err, results) {
        if (err) {
            console.log(err);
            res.send(err.code);
        }
        else
            res.send(results);
    });
};



