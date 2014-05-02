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

var mixModel = function(obj){
  obj = obj || {};
  if(obj.defaults){
    extend(obj, obj.defaults);
  }
  return obj;
};

