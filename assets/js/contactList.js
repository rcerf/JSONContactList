document.addEventListener('DOMContentLoaded', function(){
  // Create main app object
  var ContactManager = {};

  //Add eventing system to ContactManager app 
  ContactManager = mixEvents(ContactManager);
  
  // Add start parameter to app
  ContactManager.start = function(){
    // when finished trigger "initialize:after" event
    this.trigger("initialize:after");
  }
  
  ContactManager.mainRegion = document.getElementById("main-region");
  ContactManager.staticView = document.getElementById("static-template");
  ContactManager.on("initialize:after", function(){
    var staticView = ContactManager.staticView.cloneNode(true);
    var newParagraph = document.createElement("p");
    newParagraph.textContent = "Test Content";
    ContactManager.mainRegion.appendChild(newParagraph);
  });

  // Start app
  ContactManager.start();
});
