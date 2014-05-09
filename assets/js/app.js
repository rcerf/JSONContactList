// Create main app object
var ContactManager = framework.mixApp();

ContactManager.addRegions({
  mainRegion: "#main-region"
});

ContactManager.addRegions({
  importRegion: "#import-region"
});

ContactManager.on("initialize:after", function(){
  ContactManager.ContactsApp.List.Controller.listContacts();
});

ContactManager.reqres.setHandler("importNewContacts:app", function(){
  ContactManager.request("newContacts:entities");
  ContactManager.mainRegion.remove();
  ContactManager.ContactsApp.List.Controller.listContacts();
});

ContactManager.reqres.setHandler("oldContact:entities", function(){
  return ContactManager.request("contactsArray:entities");
});

