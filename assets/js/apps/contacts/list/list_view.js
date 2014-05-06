ContactManager.module("ContactsApp.List", function(List, ContactManager, framework, utils){
  List.Contact = framework.mixItemView({
    tagName: "tr",
    template: "#contact-list-item",
    events: {
      "click td": "alertPhoneNumber",
      "click button": "alertDelete"
    },
    alertPhoneNumber: function(e){
      alert(this.model.get("phoneNumber"));
    },
    alertDelete: function(e){
      e.preventDefault();
      alert("delete button was clicked");
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
