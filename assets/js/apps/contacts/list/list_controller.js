ContactManager.module("ContactsApp.List", function(List, ContactManager, framework, utils){
  List.Controller = framework.mixController({
    listContacts: function(){
      var contacts = ContactManager.request("contact:entities");

      var contactsListView = framework.mixCollectionView({
        collection: contacts
      }, List.Contacts);

      ContactManager.mainRegion.show(contactsListView);
    }
  });
}); 
