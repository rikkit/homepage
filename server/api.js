var LastFmNode = require('lastfm').LastFmNode;

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

function getTopArtists(yep, nope) {
    refreshTopArtists(yep, nope);
}

exports.all = function(req, res) {
    var tiles = [];

    getTopArtists(
        function(artists){
            var tile = {
                'tile-template': 'tt-01',
                'content-template': 'ct-fill',
                'animation': 'ease-01',
                'title': 'Last.fm',
                'style': 'lastfm',
                'href': 'http://last.fm/user/tehrikkit',
                'data': artists
            };

            tiles.push(tile);

            res.send(tiles);
        },
        function(err){
            res.err(500);
    });
};



