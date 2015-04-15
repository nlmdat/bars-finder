var data = [
	{
		match: "Crystal Palace - West Bromwich Albion",
		date: "Sat",
		time: "22:00"
	},
	{
		match: "Everton - Burnley",
		date: "Sat",
		time: "22:00"
	},
	{
		match: "Leicester City - Swansee City",
		date: "Sat",
		time: "22:00"
	},
	{
		match: "Stoke City - Southamton",
		date: "Sat",
		time: "22:00"
	},
	{
		match: "Chelsea - Manchester United",
		date: "Sun",
		time: "00:30"
	},
	{
		match: "Manchester City - West Ham United",
		date: "Sun",
		time: "20:30"
	},
	{
		match: "Newcastle United - Tottenham Hotspur",
		date: "Sun",
		time: "23:00"
	}
];

var map = {
	"Wed": 0,
	"Thu": 1,
	"Fri": 2,
	"Sat": 3,
	"Sun": 4,
	"Mon": 5,
	"Tue": 6
}

var id;
var schedule;

function storeID(data_id) {
	id = data_id;
}

function storeSchedule(data_schedule) {
	schedule = JSON.parse(data_schedule);
}

function addToSchedule(match) {
	var day = map[match.date];
	schedule[day].push({
		detail: match.match,
		time: match.time
	});
	saveToDB();
}

function removeFromSchedule(match) {
	var day = map[match.date];
	var pos;
	for (pos = 0; pos < schedule[day].length; pos++)
		if (schedule[day][pos].detail === match.match) break;
	if (pos < schedule[day].length) {
		schedule[day].splice(pos, 1);
	}
	saveToDB();
}

function saveToDB() {
	$.ajax({
		url: "/schedule/" + id,
		method: "POST",
		data: {
			schedule: JSON.stringify(schedule)
		},
		success: function(data) {
			//console.log(data);
			location.reload();
		}
	});
}

function initMatches() {
	var table = $("#matches");

	for (var i = 0; i < data.length; i++) {
		table.append("<tr class='a'><td class='a'>" + data[i].match + "</td><td class='a'>" + data[i].date + " " + data[i].time + "</td><td><button class='btn btn-primary' id=button" + i + ">Add</button></tr>");
		for (var j = 0; j < schedule[map[data[i].date]].length; j++) {
			if (schedule[map[data[i].date]][j].detail === data[i].match) {
				$("#button" + i).html("Remove");
				$("#button" + i).removeClass("btn-primary");
				$("#button" + i).addClass("btn-danger");
			}
		}
		$("#button" + i).click(function() {
			var p = parseInt($(this)[0].id[6]);
			if ($(this).html() === "Add") {
				$(this).html("Remove");
				$(this).removeClass("btn-primary");
				$(this).addClass("btn-danger");
				addToSchedule(data[p]);
			} else {
				$(this).html("Add");
				$(this).removeClass("btn-danger");
				$(this).addClass("btn-primary");
				removeFromSchedule(data[p]);
			}
		});
	}
}

function populateSchedule() {
	for (var i = 0; i < schedule.length; i++)
		if (schedule[i].length) {
			$("#td" + i).addClass("a");
			for (var j = 0; j < schedule[i].length; j++) {
				$("#td" + i).append("<span>" + schedule[i][j].detail + " at " + schedule[i][j].time + "</span><br/>");
			}
		}
}

$(function() {
	initMatches();
	populateSchedule();
});