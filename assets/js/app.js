// Create main app object
var ContactManager = {};

//Add eventing system to ContactManager app
ContactManager = util.mixEvents(ContactManager);

// Add start parameter to app
ContactManager.start = function(){
  // when finished trigger "initialize:after" event
  this.trigger("initialize:after");
};

