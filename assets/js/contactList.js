ContactManager.addRegions({
  mainRegion: "#main-region"
});

ContactManager.module("Entities", function(Entities, ContactManager, framework, util){

  var contacts;


  Entities.Contact = framework.mixModel({
    defaults: {
      firstName: "",
      lastName: "",
      phoneNumber: ""
    }
  });
  Entities.ContactCollection = framework.mixCollection({
    model: Entities.Contact,
    comparator: "firstName"
  });

  var initializeContacts = function(){
    contacts = framework.mixCollection([
      { id: 1, firstName: "Alice", lastName: "Arten",
        phoneNumber: "(415) 555-0184" },
      { id:2, firstName: "Bob", lastName: "Brigham",
        phoneNumber: "(415) 555-0163" },
      { id:3, firstName: "Charlie", lastName: "Campbell",
        phoneNumber: "(415) 555-0129" }
    ], Entities.ContactCollection);
  };

  var API = {
    getContactEntities: function(){
      if(contacts === undefined){
        initializeContacts();
      }
      return contacts;
    }
  };

  ContactManager.reqres.setHandler("contact:entities", function(){
    return API.getContactEntities();
  });
});

ContactManager.ContactItemView = framework.mixItemView({
  template: "contact-list-item",
  events: {
    "click li": "alertPhoneNumber"
  },

  alertPhoneNumber: function(){
    alert(this.model.get("phoneNumber"));
  }
});

ContactManager.ContactsView = framework.mixCollectionView({
  tagName: "ul",
  itemView: ContactManager.ContactItemView
});

ContactManager.on("initialize:after", function(){
  var contacts = ContactManager.request("contact:entities");
  var contactsListView = framework.mixCollectionView({
    collection: contacts
  }, ContactManager.ContactsView);

  ContactManager.mainRegion.show(contactsListView);
});

document.addEventListener('DOMContentLoaded', function(){
  //ContactManager.mainRegion.addSelector("main-region");

  // Start app
  ContactManager.start();
});
