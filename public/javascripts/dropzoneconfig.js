Dropzone.options.myAwesomeDropzone = {
    paramName: function() { return 'images'; },
    addRemoveLinks: true,
    parallelUploads: 10,
    uploadMultiple: true, 
    autoProcessQueue: false,
    
    init: function() {
      var myDropzone = this;
  
      var submitButton = document.querySelector('#submit-form-btn');
      submitButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        if (myDropzone.files.length) {
          myDropzone.processQueue(); // upload files and submit the form
        } else {
          $("#my-awesome-dropzone").submit(); // just submit the form
        }
        
      }); 
      myDropzone.on('queuecomplete', function(file) {
        setTimeout(function () {
          window.location.reload();
      }, 500);
      });
      
    }
}
