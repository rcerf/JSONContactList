// Eventing system mix-in
var mixEvents = function(obj){
  obj._events = {};

  obj.on = function(eventName, callback){
    if(this._events[eventName] === undefined) {
      this._events[eventName] = [callback];
    } else {
      this._events[eventName].push(callback);
    }
  };

  obj.trigger = function(eventName) {
    if(!this._events.hasOwnProperty(eventName)){
      return;
    }

    for(var i=0; i<this._events[eventName].length; i++){
      this._events[eventName][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };

  return obj;
};


var template = function(node){
  var newNode = node.cloneNode(true);
  var removeWhiteSpace = function(node){
    //base case for recursion
    if(!node.hasChildNodes()){
      return;
    };

    var childNodes = node.childNodes;
    var newChildNodes = [];

    //remove whitespace
    for(var i = 0; i<childNodes.length; i++){
      var child  = childNodes[i];
      if(child.nodeName !== "#text"){
        newChildNodes.push(child);
      }
      removeWhiteSpace(child);
    };

    console.log(childNodes);
    childNodes = newChildNodes;
    console.log(childNodes)
    return childNodes;
  };

   newNode = removeWhiteSpace(newNode);
   return newNode;
}
