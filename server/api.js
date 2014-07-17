exports.all = function(req, res) {

    var tiles = [
        {
            'tile-template': 'tt-01',
            'content-template': 'ct-fill',
            'animation': 'ease-01',
            'title': 'Last.fm',
            'style': 'lastfm',
            'href': 'http://last.fm/user/tehrikkit',
            'data': [
                {
                    'name': 'CocoRosie',
                    'image': 'http://rikk.it/blog/content/images/2014/Jun/STF---Super-summer-vacation-force-O.png',
                    'overlay': false
                },
                {'name': 'Neon Plastix', 'image': 'http://rikk.it/blog/content/images/2014/Jun/STF---Super-summer-vacation-force-O.png'},
                {'name': 'The Radio Dept.', 'image': 'http://rikk.it/blog/content/images/2014/Jun/STF---Super-summer-vacation-force-O.png'}
            ]
        }
//        {
//            'template-type': 'link-01',
//            'title': 'Blog',
//            'style': 'standard'
//        },
//        {
//            'tile-template': '01',
//            'content-template': 'fill',
//            'animation': 'ease-01',
//            'title': 'Github',
//            'style': 'github'
//        },
//        {
//            'tile-template': '01',
//            'content-template': 'fill',
//            'animation': 'ease-01',
//            'title': 'Hometown',
//            'style': 'map'
//        },
    ];

    res.send(tiles);
};



