$("h1").addClass("big-title margin-50");
$("h1").click(function() {
    $("h1").css("color", "blue");
});
$("button").click(function() {
    $("button").css("color", "red");
});
$(document).keypress(function(event) {
    $("h1").text(event.key);
});
$("button").click(function() {
    $("h1").slideUp().slideDown().animate({opacity: 0.5});
});