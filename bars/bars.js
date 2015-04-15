var checkIsBar = function(query, username, cb) {
	query("SELECT * FROM bars WHERE username = $1", [username], function(err, rows, results) {
		if (err) {
			return console.error('error running query', err);
		}
		if (!rows[0] || !rows[0].username) {
			cb(false);
		} else {
			cb(true);
		}
	});
}

var fetchBarDetails = function(query, id, cb) {
	query("SELECT * FROM bars WHERE id = $1", [id], function(err, rows, results) {
		if (err) {
			return console.error('error running query', err);
		}
		if (!rows[0] || !rows[0].id) {
			cb(null);
		} else {
			cb(rows[0]);
		}
	});
}

var changeBarDetails = function(query, id, form, cb) {
	query("SELECT * FROM bars WHERE id = $1", [id], function(err, rows, results) {
		if (err) {
			return console.error('error running query', err);
		}
		if (!rows[0] || !rows[0].id) {
			cb("Error: wrong bar id.");
		} else {
			query(
				"UPDATE bars SET (name, description, address, open_hours) = ($1, $2, $3, $4) WHERE id = $5 RETURNING name, description, address, open_hours",
				[form.name, form.description, form.address, form.open_hours, id],
				function(err, rows, results) {
					if (err) {
						cb("Error: cannot edit details.");
						return console.error('error running query', err);
					}
					cb(rows[0]);
				}
			);
		}
	});
}

var fetchSchedule = function(query, id, cb) {
	query("SELECT * FROM schedules WHERE id = $1", [id], function(err, rows, results) {
		if (err) {
			return console.error('error running query', err);
		}
		if (!rows[0] || !rows[0].id) {
			cb("Error: wrong bar id.");
		} else {
			cb(rows[0]);
		}
	});
}

var changeSchedule = function(query, id, schedule, cb) {
	query("SELECT * FROM schedules WHERE id = $1", [id], function(err, rows, results) {
		if (err) {
			return console.error('error running query', err);
		}
		if (!rows[0] || !rows[0].id) {
			cb("Error: wrong bar id.");
		} else {
			query("UPDATE schedules SET (schedule) = ($1) WHERE id = $2 RETURNING schedule", [schedule, id], function(err, rows, results) {
				if (err) {
					cb("Error: cannot change schedule.");
					return console.error('error running query', err);
				}
				cb(rows[0]);
			});
		}		
	});
}

module.exports = {
	checkIsBar: checkIsBar,
	fetchBarDetails: fetchBarDetails,
	changeBarDetails: changeBarDetails,
	fetchSchedule: fetchSchedule,
	changeSchedule: changeSchedule
}