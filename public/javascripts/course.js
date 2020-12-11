const followButton = document.querySelector("#followBtn");
followButton.addEventListener("click", function() {
  console.log(typeof followButton.textContent);
  console.log(followButton.textContent);
  console.log(followButton.textContent.trim() === "Follow" );
  if (followButton.textContent.trim() === "Follow" ) {
    console.log("Following");
    
    followButton.textContent = "Following";
    const Http = new XMLHttpRequest();
    const url = "/courses/" + followButton.value + "/follow";
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = e => {
      console.log(Http.responseText);

    };
  } else if (followButton.textContent.trim() === "Following" ) {
    console.log("Unfollow");
    followButton.textContent = "Follow";
    const Http = new XMLHttpRequest();
    const url = "/courses/" + followButton.value + "/unfollow";
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = e => {
      console.log(Http.responseText);
      
    };
  }
});

const updateTargetBtn = document.querySelector("#submitUpdateTarget");
const updateTargetForm = document.querySelector("#updateTarget");
updateTargetBtn.addEventListener("click", () => {
  updateTargetForm.submit();
});
