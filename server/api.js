exports.all = function(req, res) {

    var tiles = [
        {
            'template-type': 'ease-01',
            'title': 'Last.fm',
            'style': 'lastfm'
        },
        {
            'template-type': 'ease-01',
            'title': 'Github',
            'style': 'github'
        },
        {
            'template-type': 'link-01',
            'title': 'Blog',
            'style': 'standard'
        },
        {
            'template-type': 'ease-01',
            'title': 'Hometown',
            'style': 'map'
        },
    ];

    res.send(tiles);
};



