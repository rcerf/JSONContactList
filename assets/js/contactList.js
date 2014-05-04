ContactManager.mainRegion = mixRegion({});
ContactManager.Contact = mixModel({
  defaults: {
    firstName: "",
    lastName: "",
    phoneNumber: ""
  }
});
ContactManager.ContactCollection = mixCollection({
  model: ContactManager.Contact,
  comparator: "firstName"
});

ContactManager.ContactItemView = mixItemView({
  template: "contact-list-item",
  events: {
    "click li": "alertPhoneNumber"
  },

  alertPhoneNumber: function(){
    alert(this.model.get("phoneNumber"));
  }
});

ContactManager.ContactsView = mixCollectionView({
  tagName: "ul",
  itemView: ContactManager.ContactItemView
});

ContactManager.on("initialize:after", function(){
  var contacts = mixCollection([{
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
  ], ContactManager.ContactCollection);

  var contactsListView = mixCollectionView({
    collection: contacts
  }, ContactManager.ContactsView);

  ContactManager.mainRegion.show(contactsListView);
});

document.addEventListener('DOMContentLoaded', function(){
  //binds to DOM element so must be present before it's called
  ContactManager.mainRegion.addSelector("main-region");
  // Start app
  ContactManager.start();
});
