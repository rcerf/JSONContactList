ContactManager.on("initialize:after", function(){
  var contacts = ContactManager.request("contact:entities");
  var contactsListView = framework.mixCollectionView({
    collection: contacts
  }, ContactManager.ContactsApp.List.Contacts);

  ContactManager.mainRegion.show(contactsListView);
});

document.addEventListener('DOMContentLoaded', function(){
  //ContactManager.mainRegion.addSelector("main-region");

  // Start app
  ContactManager.start();
});
