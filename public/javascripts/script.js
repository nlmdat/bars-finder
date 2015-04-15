var id;
var form, dialog;

function storeID(data_id) {
	id = data_id;
}

function sendData() {
	$.ajax({
		type: "POST",
		url: "/bars/" + id,
		data: {
			name: $("#name").val(),
			description: $("#description").val(),
			address: $("#address").val(),
			open_hours: $("#open_hours").val()
		},
		success: function(data) {
			if (typeof data === "string") {
				alert(data);
			} else {
				alert("Details are successfully saved.");
				location.reload();
			}
		}
	});
	dialog.dialog("close");
}

$(function() {
	dialog = $("#dialog-form").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Save": sendData,
			Cancel: function() {
				dialog.dialog("close");
			}
		},
		close: function() {
			form[0].reset();
		}
	});
	
	form = dialog.find("form").on("submit", function(event) {
		event.preventDefault();
		sendData();
	});

	$("#edit").click(function() {
		dialog.dialog("open");
	});
});