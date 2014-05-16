'use strict';

var mongodb = require('mongodb');

module.exports = {
	getConnection: getConnection
};

function getDbOpts(opts) {
	opts = opts || {
		host: 'localhost',
		db: 'my-app',
		port: 27017
	};
	opts.port = opts.port || 27017;
	return opts;
}

function initConnection(db, cb) {
	var collection = new mongodb.Collection(db, 'migrations');
	cb(null, {
		connection: db,
		migrationCollection: collection
	});
}

function getConnection(opts, cb) {
	opts = getDbOpts(opts);

	var server = new mongodb.Server(opts.host, opts.port, {});

	new mongodb.Db(opts.db, server, {safe: true}).open(function (err, db) {
		if (err) {
			return cb(err);
		}

		if (opts.user && opts.password) {
			db.authenticate(opts.user, opts.password, function(err, res) {
				if (err || !res) {
					return cb(err || 'authentication failed');
				}
				initConnection(db, cb);

			});
		} else {
			initConnection(db, cb);
		}
	});
}
