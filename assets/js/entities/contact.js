ContactManager.module("Entities", function(Entities, ContactManager, framework, util){

  var contacts;
  var contactsArray;


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
    contactsArray = [
      { id: 1, firstName: "Alice", lastName: "Arten",
        phoneNumber: "(415) 555-0184" },
      { id:2, firstName: "Bob", lastName: "Brigham",
        phoneNumber: "(415) 555-0163" },
      { id:3, firstName: "Charlie", lastName: "Campbell",
        phoneNumber: "(415) 555-0129" }
    ];
    contactsArray = ContactManager.reqres.setHandler("newContacts:entities", function(){
      return ContactManager.request("newContacts:importer");
    }) || contactsArray;
    contacts = framework.mixCollection(contactsArray, Entities.ContactCollection);
  };

  var API = {
    getContactEntities: function(){
      if(contacts === undefined){
        initializeContacts();
      }
      return contacts;
    },
    getContactsArray: function(){
      var newArray = []
      for(var i =0; i<contactsArray.length; i++){
        var contact = contactsArray[i];
        var newContainer = {};
        newContainer.firstName = contact.firstName;
        newContainer.lastName = contact.lastName;
        newContainer.phoneNumber = contact.phoneNumber;
        newArray.push(newContainer);
      }
      return newArray;
    }
  };

  ContactManager.reqres.setHandler("contact:entities", function(){
    return API.getContactEntities();
  });

  ContactManager.reqres.setHandler("contactsArray:entities", function(){
    return API.getContactsArray();
  })
});

