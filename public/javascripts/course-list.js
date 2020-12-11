const submitCourseButton = document.querySelector("#submitCourseButton");
const courseForm = document.querySelector("#uploadCourseForm");
submitCourseButton.addEventListener("click", function() {
  courseForm.submit();
});
