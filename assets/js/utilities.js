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
  var eventTypes = /click/mi;
  for(var key in events){
    var eventName = key;
    var callbacks = events[key];
    var present = eventTypes.test(eventName);
    if(present){
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
  var tagName = eventNameArray.slice(1).join("").trim().toLowerCase();
  var boundCallback = callback.bind(itemView);
  var matchingNodes = rootNode.querySelectorAll(tagName);
  for(var j=0; j<matchingNodes.length; j++){
    matchingNodes[j].addEventListener(eventType, boundCallback);
  };
  if(rootNode.tagName.toUpperCase() === tagName.toUpperCase()){
    rootNode.addEventListener(eventType, boundCallback);
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
    if(/itemview/im.test(eventName) && this.itemView._events){
      var parentView = this;
      this.itemView.on(eventName.slice(9), function(){
        parentView.trigger(eventName, this, arguments[0]);
      });
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

util.mixBubbling = function(){
  var eventNames = ["change", "add", "remove", "dom:refresh"];
  var eventTypes = ["model", "collection"];
// Listening for changes on the model
  function bubble(){
    var capEventName = eventName;
    var capEventType = eventType;
    return function(){
      console.log(this);
      var args = Array.prototype.slice.call(arguments);
      this.collection && args.push(this.collection);
      args.unshift(capEventName);
      this.trigger.apply(this, args);
    }
  }

  for(var j=0; j<eventTypes.length; j++){
    var eventType = eventTypes[j];
    for(var i=0; i<eventNames.length; i++){
      var eventName = eventNames[i]
      var eventName = eventName === "dom:refresh" ? eventName : eventType + ":" + eventName;
      if(this[eventType]){
        var closureBubble = bubble();
        this[eventType] && this[eventType].on(eventName, closureBubble.bind(this));
      }
    }
  }
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

