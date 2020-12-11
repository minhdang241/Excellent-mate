var submitButton = $("#submitButton");
submitButton.click(function(){
    $("#submit-form").submit();
});


var uploadButton = $("#submitImageButton");
uploadButton.click(function(){
    $("#uploadImage").submit();
});


var uploadProjectButton = $("#submitProjectButton");
uploadProjectButton.click(function () {
    $("#uploadProjectForm").submit();
});

//Readmore
$(document).ready(function(){
    var maxLength = 150;
    var ellipsestext = "...";
    var moretext = "Show more";
    var lesstext = "Show less";

    $(".more").each(function() {
        console.log("Hello");
        var content = $(this).text();
        console.log($(this).html());
        console.log(content.length.toString());
        if (content.length > maxLength) {
            var visibleContent = content.substr(0, maxLength);
            var hiddenContent = content.substr(maxLength, content.length);
            console.log(visibleContent);
            console.log(hiddenContent);

            var html = "<p class='card-text'>" + visibleContent +"<span>"
                + ellipsestext + "</span><span class='morecontent'><span>"
                + hiddenContent + "</span> <a class='morelink' href='#'>"
                + moretext + "</a></span></p>";
            $(this).html(html);
            
        } else {
            console.log("Hello2");
        }

    });

    $(".morelink").click(function(){
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
});