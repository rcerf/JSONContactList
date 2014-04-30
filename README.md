# JSON Contact List Importer/Exporter

Using JavaScript, HTML and CSS, create a web interface that allows a user to enter the first name, last name and phone number of a contact and add them to a list of contacts.

The interface should be made up of the following:
* Inputs to add the first name, last name and phone number of a contact
* An "Add" button for adding the user input to the list of contacts.
* A "Remove" button for each contact in the list that eliminates the contact's row from the list.
* An "Export" button which takes the contact list and converts it to JSON
* A textarea that gets populated with the resulting JSON data after "Export" is clicked
* An "Import" button that overwrites and populates the list of contacts with contact data manually entered into the textarea if it's properly formatted JSON.
* Create a fake event tracking function that will capture key user events and log them to the bottom of the page.  Track whatever events you think help determine whether or not the interface is effective.

**Key user events:**
* adding a contact and time
* removing a contact and time
* exporting contact list and time
* importing a contact list and time
* stack of contacts visited and time of visit
* count for each contact of # of times contact was visited
* time of latest change to contact
* history of past versions

## Other caveats/limitations/exceptions:
* You CANNOT use JS libraries to complete the task (jQuery/YUI, Backbone, Angular, underscore, etc.).  You must use native JS to manipulate the DOM.
* You CANNOT use a CSS library/framework to complete the task (Bootstrap/Blueprint, etc.)
* You CAN use JSON.parse/JSON.stringify
* The final product should be compatible with the latest versions of all major browsers (Chrome, FF, Safari, IE)
* Bonus points are rewarded if the data in the form persists when the user navigates away from the page and comes back
* Extra bonus points for how the persistent data is stored

## EXTRAS
**Security:**

Make Address Book accessible by password.
Encrypt contacts before storing them.

**Templates:**

Roll my own templateing so I don't need HTML in my js file.

**Form Validation**