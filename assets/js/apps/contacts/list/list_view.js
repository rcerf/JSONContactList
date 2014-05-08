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
    }
  });


  List.Contacts = framework.mixCompositeView({
    tagName: "table",
    className: "table table-hover",
    template: "#contact-list",
    itemView: List.Contact,
    itemViewContainer: "tbody"
  });

});
