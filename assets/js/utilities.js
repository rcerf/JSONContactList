var extend = function(destination){
  var sources = Array.prototype.slice.call(arguments, 1);

  for(var i = 0; i<sources.length; i++){
    var arg = sources[i];
    if(Array.isArray(arg)){
      for(var j=0; j<arg.length; j++){
        var source = arg[j];
        for(var key in source){
          destination[key] = destination[key] || source[key];
        };
      };
    }else{
      var source = sources[i];
      for(var key in source){
        destination[key] = destination[key] || source[key];
      };
    };
  };
  return destination;
};

// fix so that it detects tags, creates elements and then adds textContent
var template = function(model, node){
  //clone node
  var newNode = node.cloneNode(true);
  var newElements = [];
  // grab text from node
  var content = newNode.text.trim();
  var interpolateRe = /<%=([\s\S]+?)%>/g;
  var elementTagRe = /<(?!%)([\s\S]+?)>/g;
  var text = />([\s\S]+?)</g;
  var interpolatedString = content.replace(interpolateRe, function(match, variable, offset){
    variable = variable.trim();
    var interp = model[variable];
    return interp;
  });
  var last;
  interpolatedString.replace(elementTagRe, function(match, variable, offset, string){
    variable = variable.trim();
    if(variable[0] !== "/"){
      last = offset + match.length;
      var element = document.createElement(variable);
      newElements.push(element)
    } else{
      var content = string.substring(last, offset);
      newElements[newElements.length-1].textContent = content;
    }
  });

  return newElements;
};

var bindDOMEventListeners = function(itemView){
  var events = itemView._events;
  var eventTypes = /click/g;
  for(var key in events){
    var eventName = key;
    var callbacks = events[key];
    if(eventTypes.test(eventName)){
      for(var i=0; i<callbacks.length; i++){
        var callback = callbacks[i];
        addDOMEventListener(itemView, eventName, callback);
      };
    };
  };
};

var addDOMEventListener = function(itemView, eventName, callback){
  var eventNameArray = eventName.split(" ");
  var eventType = eventNameArray[0].trim().toLowerCase();
  var tagName = eventNameArray[1].trim().toLowerCase();
  var boundCallback = callback.bind(itemView);
  var node = itemView._cachedTemplate;
  var targetNodes = node.getElementsByTagName(tagName);
  for(var i = 0; i<targetNodes.length; i++){
    targetNodes[i].addEventListener(eventType, boundCallback);
  };
};


// Eventing system mix-in
var mixEvents = function(obj){
  obj = obj || {};

  obj._events = {};

  obj.on = function(eventName, callback){
    if(typeof callback === "string"){
      callback = this[callback];
    }
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


