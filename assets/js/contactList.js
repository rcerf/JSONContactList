document.addEventListener('DOMContentLoaded', function(){
  // Create main app object
  var ContactManager = {};

  //Add eventing system to ContactManager app
  ContactManager = mixEvents(ContactManager);

  // Add start parameter to app
  ContactManager.start = function(){
    // when finished trigger "initialize:after" event
    this.trigger("initialize:after");
  }

  ContactManager.mainRegion = mixRegion({});
  ContactManager.mainRegion.addSelector("main-region");
  ContactManager.Contact = mixModel({
    defaults: {
      firstName: "",
      lastName: "",
      phoneNumber: ""
    }
  });
  ContactManager.ContactCollection = mixCollection({
    model: ContactManager.Contact
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
      firstName: "Brett",
      lastName: "Memsic",
      phoneNumber: "(415) 555-0001"
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
     }
    ], ContactManager.ContactCollection);

    var contactsListView = mixCollectionView({
      collection: contacts
    }, ContactManager.ContactsView);

    ContactManager.mainRegion.show(contactsListView);
  });

  // Start app
  ContactManager.start();
});
