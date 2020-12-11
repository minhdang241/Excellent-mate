$(document).ready(function() {
  var newDate = new Date();
  var year = newDate.getFullYear().toString();
  var month = newDate.getMonth() + 1;
  
  var date = newDate.getDate();
  var currentDate = year+"-"+month+"-"+date;
  $("#date").val(currentDate);
});

var createMilestone = $("#createMilestone");
createMilestone.click(function() {
  $("#createMilestoneForm").submit();
});

var editMilestoneSubmitButton = $("#editMilestone");
editMilestoneSubmitButton.click(function() {
  $("editMilestoneForm").submit();
});


var uploadButton = $("#submitImageButton");
uploadButton.click(function(){
    $("#uploadImage").submit();
});


var showAttachmentBtn = $(".showAttachments");
showAttachmentBtn.click(function(){

  if (showAttachmentBtn.text() == 'Show more') {
    showAttachmentBtn.text('Show less');
  } else {
    showAttachmentBtn.text('Show more');
  }
  // console.log(showAttachmentBtn.text());
});


