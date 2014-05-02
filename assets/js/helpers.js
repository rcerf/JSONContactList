
var extend = function(destination){
  var sources = Array.prototype.slice.call(arguments, 1);
  for(var i = 0; i<sources.length; i++){
    var source = sources[i];
    for(var key in source){
      destination[key] = source[key];
    }
  }
  return destination;
};

// fix so that it detects tags, creates elements and then adds textContent
var template = function(model, node){
  //clone node
  var newNode = node.cloneNode(true);
  var newElements = [];
  // grab text from node
  console.log("newNode", newNode);
  var content = newNode.text.trim();
  var interpolateRe = /<%=([\s\S]+?)%>/g;
  var elementTagRe = /<(?!%)([\s\S]+?)>/g;
  var text = />([\s\S]+?)</g;
  var varArray = content.match(interpolateRe);
  var tagArray = content.match(elementTagRe);
  console.log(varArray);
  console.log(tagArray);
  var interpolatedString = content.replace(interpolateRe, function(match, variable, offset){
    variable = variable.trim();
    var interp = model[variable];
    return interp;
  });
  var last;
  interpolatedString.replace(elementTagRe, function(match, variable, offset, string){
    console.log("STRING ", typeof string);
    variable = variable.trim();
    if(variable[0] !== "/"){
      last = offset + match.length;
      var element = document.createElement(variable);
      console.log("ELEMENT : ", typeof element);
      newElements.push(element)
    } else{
      var content = string.substring(last, offset);
      console.log("content; ", content);
      console.log("NODE", typeof newElements[newElements.length-1]);
      newElements[newElements.length-1].textContent = content;
    }
  });

  return newElements;
};

// Eventing system mix-in
var mixEvents = function(obj){
  obj = obj || {};
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

var mixRegion = function(obj) {
  obj = obj || {};
  obj._selector;
  obj.addSelector = function(id){
    this._selector = document.getElementById(id);
  };
  obj.show = function(itemView){
    //itemView = template(itemView.template);
    var nodes = itemView.getCachedTemplate();
    for(var i=0; i<nodes.length; i++){
      this._selector.appendChild(nodes[i]);
    };
  };

  return obj;
};

var mixItemView = function(obj){
  obj = obj || {};

  obj._cachedTemplate;
  obj._selectedTemplate;

  //won't be called if obj.template is set without calling the mixin
  function setSelectedTemplate(){
    if(!obj.template) {
      console.log("You must set template property on ItemView.");
      return;
    }
    this._selectedTemplate = document.getElementById(obj.template);
  };

  obj.getCachedTemplate = function(){
    if(!this.model || !this.template){
      console.log("You need to set a model and/or a template on this ItemView before you can render!");
      return;
    }
    if(!this._cachedTemplate){
      if(!this.hasOwnProperty("_selectedTemplate")){
        setSelectedTemplate.call(this);
      };

      this._cachedTemplate = template(this.model, this._selectedTemplate);
    }
    return this._cachedTemplate;
  }
  return obj;
};


