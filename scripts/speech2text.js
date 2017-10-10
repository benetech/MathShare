



$(function(){
	"use strict";
	var spokens = [];
	function changeButtonStates(){
		if($("#speechbutton").prop("disabled"))
			$("#speechbutton").prop("disabled", false);
		else
			$("#speechbutton").prop("disabled", true);
		if($("#stopbutton").prop("disabled"))
			$("#stopbutton").prop("disabled", false);
		else
			$("#stopbutton").prop("disabled", true);
	}
	$("#speechbutton").click(function(evt){
		changeButtonStates();
		recognition.start();
		$("#indicator").text("Speak, please!");
	});
	$("#stopbutton").click(function(evt){
		changeButtonStates();
		recognition.stop();
		$("#indicator").text("Not listening");
	});
	var recognition = new webkitSpeechRecognition();
	recognition.interimResults = true;
	recognition.continuous = true;
	var text = $("#mathAnnotation");
	recognition.onresult = function(event) {
		var res = [];
		for(var i= event.resultIndex; i<event.results.length; i++)
			res.push(event.results[i][0].transcript);
		var utterance = res+"";
		text.append(utterance);
		$("#indicator-sr").text(utterance);
		spokens = spokens.concat(res);
	};
	$("#undobutton").click(function(event){
		if(!spokens.length){
			$("#indicator").text("Can't undo");
			return;
		}
		var remove = spokens.pop();
		var utterance = spokens+"";
		text.text(utterance);
		$("#indicator").text("Removed "+remove);
	});
	$("#clearbutton").click(function(event){
		if(!confirm("Are you sure you want to delete everything you said? This cannot be undone.")){
			return;
		}
		spokens = [];
		text.text("");
		$("#indicator").text("Everything you said was just deleted.");
	});
});