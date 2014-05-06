util = {};
util.extend = function(destination){
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
util.template = function(model, node){
  //clone node
  var newNode = node.cloneNode(true);
  // grab text from node
  var content = newNode.text.trim();
  var interpolateRe = /<%=([\s\S]+?)%>/g;
  var elementTagRe = /<(?!%)([\s\S]+?)>/g;
  var text = />([\s\S]+?)</g;

  var interpolatedString = model ? content.replace(interpolateRe, function(match, variable, offset){
    variable = variable.trim();
    var interp = model[variable];
    return interp;
  }) : content;

  var currentElement;
  var last;
  var lastVariable;
  var result = [];

  interpolatedString.replace(elementTagRe, function(match, variable, offset, string){
    variable = variable.trim();
    if(variable[0] !== "/"){
      if(!currentElement){
        currentElement = document.createElement(variable);
        last = offset + match.length;
        lastVariable = variable;
      }
    } else{
      if(variable.slice(1) === lastVariable){
        var content = string.substring(last, offset).trim();
        currentElement.innerHTML = content;
        result.push(currentElement);
        currentElement = null;
      }
    }
  });
  return result;
};

util.bindDOMEventListeners = function(itemView, rootNode){
  var events = itemView._events;
  var eventTypes = /click/g;
  for(var key in events){
    var eventName = key;
    var callbacks = events[key];
    if(eventTypes.test(eventName)){
      for(var i=0; i<callbacks.length; i++){
        var callback = callbacks[i];
        util.addDOMEventListener(itemView, eventName, rootNode, callback);
      };
    };
  };
};

util.addDOMEventListener = function(itemView, eventName, rootNode, callback){
  var eventNameArray = eventName.split(" ");
  var eventType = eventNameArray[0].trim().toLowerCase();
  var tagName = eventNameArray[1].trim().toLowerCase();
  var boundCallback = callback.bind(itemView);
  if(rootNode.tagName === tagName.toUpperCase()){
    rootNode.addEventListener(eventType, boundCallback);
  };
  var targetNodes = rootNode.getElementsByTagName(tagName);
  for(var i = 0; i<targetNodes.length; i++){
    targetNodes[i].addEventListener(eventType, boundCallback);
  };
};

util.addClass = function(el, className){
  var classNames = className.split(" ");
  for(var i=0; i<classNames.length; i++){
    var className = classNames[i];
    if (el.classList){
      el.classList.add(className);
    }else{
      el.className += ' ' + className;
    }
  }
};

// Eventing system mix-in
util.mixEvents = function(obj){
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

util.mixReqres = function(obj){
  obj = obj || {};


  obj.reqres = {};

  obj.reqres._reqresStore = {};
  obj.reqres.setHandler = function(handlerName, callback){
    if(typeof callback === "string"){
      callback = this[callback];
    }
    if(this._reqresStore[handlerName] === undefined){
      this._reqresStore[handlerName] = [callback];
    } else {
      this._reqresStore[handlerName].push(callback);
    }
  };

  obj.request = function(handlerName){
    if(!this.reqres._reqresStore.hasOwnProperty(handlerName)){
      console.log("No such handler set.");
      return;
    }
    for(var i=0; i<this.reqres._reqresStore[handlerName].length; i++){
      return this.reqres._reqresStore[handlerName][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };

  return obj;
}

