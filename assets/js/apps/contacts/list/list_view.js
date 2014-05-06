ContactManager.module("ContactsApp.List", function(List, ContactManager, framework, utils){
  List.Contact = framework.mixItemView({
    tagName: "tr",
    template: "#contact-list-item",
    events: {
      "click td": "alertPhoneNumber"
    },
    alertPhoneNumber: function(){
      alert(this.model.get("phoneNumber"));
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
