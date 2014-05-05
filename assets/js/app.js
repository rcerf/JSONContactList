// Create main app object
var ContactManager = framework.mixApp();

ContactManager.addRegions({
  mainRegion: "#main-region"
});

ContactManager.on("initialize:after", function(){
  ContactManager.ContactsApp.List.Controller.listContacts();
});

