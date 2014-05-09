ContactManager.module("ContactsApp.List", function(List, ContactManager, framework, utils){
  List.Controller = framework.mixController({
    listContacts: function(){
      var contacts = ContactManager.request("contact:entities");

      var contactsListView = framework.mixCompositeView({
        collection: contacts
      }, List.Contacts);

      contactsListView.on("itemview:contact:delete", function(childView, model){
        contacts.remove(model);
      });

      ContactManager.mainRegion.show(contactsListView);
      ContactManager.importRegion.show(List.Import);
    }
  });
});

