ContactManager.on("initialize:after", function(){
  ContactManager.ContactsApp.List.Controller.listContacts();
});

document.addEventListener('DOMContentLoaded', function(){
  //ContactManager.mainRegion.addSelector("main-region");

  // Start app
  ContactManager.start();
});
