var mixRegion = function(obj) {
  obj = obj || {};
  obj._selector;
  obj.addSelector = function(id){
    this._selector = document.getElementById(id);
  };
  obj.show = function(itemView){
    //itemView = template(itemView.template);
    var node = itemView.getCachedTemplate();
    this._selector.appendChild(node);
    bindDOMEventListeners(itemView);
  };

  return obj;
};

var mixItemView = function(obj){
  obj = obj || {};
  //add eventing system
  obj = mixEvents(obj);

  //Declare Custom Private Variables
  obj._selectedTemplate;
  obj.el = obj.el || "div";
  obj.elNode = document.createElement(obj.el);
  obj._cachedTemplate = obj.elNode;

  //won't be called if obj.template is set without calling the mixin
  function setSelectedTemplate(){
    this._selectedTemplate = document.getElementById(obj.template);
  };

  function addEvents(){
    var events = this.events;
    for(key in events){
      this.on(key, events[key])
    };
  };

  if(obj.template){
    setSelectedTemplate.call(obj);
  };

  if(obj.events){
    addEvents.call(obj);
  };

  obj.getCachedTemplate = function(){
    if(!this.model || !this.template){
      console.log("You need to set a model and/or a template on this ItemView before you can render!");
      return;
    }
    if(!this.hasOwnProperty("_selectedTemplate")){
      setSelectedTemplate.call(this);
    };
    var childNodes = template(this.model, this._selectedTemplate);
    for(var i = 0; i<childNodes.length; i++){
      this._cachedTemplate.appendChild(childNodes[i]);
    };
    return this._cachedTemplate;
  }
  return obj;
};

var mixModel = function(obj){
  obj = obj || {};

  obj.get = function(propertyName){
    return this[propertyName];
  }

  if(obj.defaults){
    extend(obj, obj.defaults);
  }
  return obj;
};

