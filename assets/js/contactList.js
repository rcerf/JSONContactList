ContactManager.mainRegion = framework.mixRegion({});

ContactManager.Entities = {};
// moduel currently refers to a function that creates ContactManager.Entities
ContactManager.module = function(Entities, ContactManager, framework, util){

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
    ]);
  };

  var API = {
    getContactEntities: function(){
      if(contacts === undefined){
        initializeContacts();
      }
      return contacts;
    }
  }

  return ContactManager.Entities;
}(ContactManager.Entities, ContactManager, framework, util);

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
  var contacts = framework.mixCollection([{
    firstName: "Alice",
    lastName: "Arten",
    phoneNumber: "(415) 555-0814"
    },
    {
    firstName: "Julia",
    lastName: "Carnevale",
    phoneNumber: "(415) 555-0002"
    },
    {
    firstName: "Rick",
    lastName: "Cerf",
    phoneNumber: "(415) 555-0003"
    },
    {
    firstName: "Brett",
    lastName: "Memsic",
    phoneNumber: "(415) 555-0001"
    }
  ], ContactManager.Entities.ContactCollection);

  var contactsListView = framework.mixCollectionView({
    collection: contacts
  }, ContactManager.ContactsView);

  ContactManager.mainRegion.show(contactsListView);
});

document.addEventListener('DOMContentLoaded', function(){
  ContactManager.mainRegion.addSelector("main-region");

  // Start app
  ContactManager.start();
});
