exports.index = function(req, res) {
    res.render('index');
};

exports.newgame = function(game) {
    return function(req, res) {
	res.render('game', { num : req.query.num,
			     turn : 2});
    };
};
