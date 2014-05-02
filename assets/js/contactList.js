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
  
  ContactManager.mainRegion = mixRegion({});
  ContactManager.mainRegion.addSelector("main-region");
  ContactManager.ContactView = mixItemView({template: "contact-template"});
  ContactManager.on("initialize:after", function(){
    var alice = {
    firstName: "Alice",
    lastName: "Arten",
    phoneNumber: "(415) 555-0814"
    };
    var aliceView = extend({model: alice}, ContactManager.ContactView);
    ContactManager.mainRegion.show(aliceView);
  });

  // Start app
  ContactManager.start();
});
