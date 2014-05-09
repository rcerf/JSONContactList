ContactManager.module("ContactsApp.List", function(List, ContactManager, framework, utils){
  List.Contact = framework.mixItemView({
    tagName: "tr",
    template: "#contact-list-item",
    events: {
      "click td": "alertPhoneNumber",
      "click button .js-delete": "deleteClicked"
    },
    alertPhoneNumber: function(e){
      alert(this.model.get("phoneNumber"));
    },
    deleteClicked: function(e){
      e.preventDefault();
      e.stopPropagation();
      this.trigger("contact:delete", this.model);
    },
  });

  List.Contacts = framework.mixCompositeView({
    tagName: "table",
    className: "table table-hover",
    template: "#contact-list",
    itemView: List.Contact,
    itemViewContainer: "tbody"
  });

  List.Importer = framework.mixItemView({
    template: "#import-export-field",
    className: "importer",
    events: {
      "click button .js-import": "importContacts",
      "click button .js-export": "exportContacts"
    },
    importContacts: function(){
      // create contacts collection from JSON in template
      // create new contactsListView
      var JSONContacts = this._cachedTemplate.firstChild.value
      var contactsArray = JSONContacts.split(",");
      // start count on number of entries currently present
      var count = 0;
      for(var i=0; i<contactsArray.length; i++){
        var contact = contactsArray[i];
        var contactArray = contact.split(" ");
        var formattedContact = {};
        formattedContact.id = count;
        formattedContact.firstName = contactArray[0];
        formattedContact.lastName = contactArray[1];
        formattedContact.phoneNumber = contactArray[3] + " " + contactArray[4];
        contactsArray[i] = formattedContact;
        count++;
      }
      var oldContacts = ContactManager.request("oldContact:entities");
      var newContacts = oldContacts.concat(contactsArray);

      ContactManager.request("importNewContacts:app");
      ContactManager.reqres.setHandler("newContacts:importer", function(){
        return newContacts;
      })
    },

    exportContacts: function(){
      var currentContacts = ContactManager.request("contactsArray:entities");
      var stringifiedContacts = JSON.stringify(currentContacts);
      this._cachedTemplate.firstChild.value = stringifiedContacts;
    }

  });

  List.Import = framework.mixCompositeView({
    className: "import",
    template: "#import-export",
    itemView: List.Importer,
    itemViewContainer:"p"
  });

});
