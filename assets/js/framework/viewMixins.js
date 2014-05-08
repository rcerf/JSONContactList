framework.mixItemView = function(obj){
  var args = Array.prototype.slice.call(arguments, 0);
  if(args.length > 1){
    obj = util.extend({}, args);
  };
  obj = obj || {};

  obj.addEvents = obj.addEvents || function(){
    // Adds Events declared thru API
    var events = this.events;
    for(key in events){
      this.on(key, events[key])
    };

    this.on("dom:refresh", function(){
      var model = arguments[0];
      this.refreshDOM(model);
    });

    util.mixBubbling.call(this);
  };

  obj.createSelectedTemplate = function(){
    var cssSymbol = this.template[0];
    var template = this.template.slice(1);
    this._selectedTemplate = cssSymbol === "#" ? document.getElementById(template): console.log("Not using CSS Id symbol.");
  };

  obj.createCachedTemplate = function(){
    this._cachedTemplate = document.createElement(this.el || "div");
    //add Class to template
    this.className && util.addClass(this._cachedTemplate, this.className);
  };

  obj.createEl = function(){
    //render childNodes
    var childNodes = util.template(this.model, this._selectedTemplate);

    for(var i = 0; i<childNodes.length; i++){
      if(this._events){
        util.bindDOMEventListeners(this, childNodes[i]);
      };
      //build el tree from childNodes
      this._cachedTemplate.appendChild(childNodes[i]);
    };
  };

  obj.render = obj.render || function(){
    this.template ? this.createSelectedTemplate() : console.log("Must set template attribute on view");
    this.createCachedTemplate();
    this.model ? this.createEl() : console.log("Must set model on view.")
    return this._cachedTemplate;
  };

  obj.remove = obj.remove || function(){
    var model = arguments[0];
    var parentNode = this._cachedTemplate.parentNode
    parentNode.removeChild(this._cachedTemplate);
    parentNode.appendChild(this.render());
    //***** 
    //1) Remove listeners from view that was deleted
    // 2) remove
    //delete this.model;
  };

  obj.refreshDOM = obj.refreshDOM || function(){
    var model = arguments[0];
    this.remove(model)
  };

  // add event system if not already present
  obj._events || util.mixEvents(obj) && (obj.events || obj.model || obj.collection) && obj.addEvents();
  obj.el = obj.tagName || obj.el || "div";

  return obj;
};

framework.mixCollectionView = function(obj){
  var args = Array.prototype.slice.call(arguments, 1);
  obj = obj || {};

  obj.createItemViewCollection = function(){
    var models = this.collection.get("modelCollection");
    this.itemViewCollection = [];

    for(var key in models){
      var tempItemView = framework.mixItemView({model: models[key]}, this.itemView)
      //save a collection of itemViews in the CollectionView
      this.itemViewCollection.push(tempItemView);
    };
  };

  obj.iterateItemViewCollection = function(callback){
    this.createItemViewCollection();
    var args = Array.prototype.slice(0);
    for(var i=0; i<this.itemViewCollection.length; i++){
      var itemView = this.itemViewCollection[i];
      args.unshift(itemView);
      callback.apply(this, args);
      args.shift();
    };
  };

  obj.render = obj.render || function(){
    if(!this.hasOwnProperty("collection") || !this.hasOwnProperty("itemView")){
      console.log("No collection and/or itemView property set on CollectionView.")
    }

    this.createCachedTemplate();

    this.iterateItemViewCollection(function(itemView){
      var childNode = itemView.render();
      this._cachedTemplate.appendChild(childNode);
    });

    return this._cachedTemplate;
  };

  obj = framework.mixItemView(obj);

  // auto util.extend if more than one object is passed in
  if(args.length > 0){
    obj = util.extend(obj, args);
  };

  //overwrite el with tagName if one is given
  obj.el = obj.tagName || obj.el || "div";
  obj.elNode = document.createElement(obj.el);

  return obj;
};

framework.mixCompositeView = function(obj){
  var args = Array.prototype.slice.call(arguments, 1);
  obj = obj || {};
  obj.render = obj.render || function(){
    this.createCachedTemplate();
    this.createSelectedTemplate();

    var children = util.template(null, this._selectedTemplate);
    for(var i=0; i<children.length; i++){
      var child = children[i];
      this._cachedTemplate.appendChild(child);
    }

    this._selector = this.itemViewContainer ? this._cachedTemplate.querySelector(this.itemViewContainer): console.log("No itemViewContainer set");

    this.iterateItemViewCollection(function(itemView){
      var childNode = itemView.render();
      this._selector.appendChild(childNode);
    });

    return this._cachedTemplate;
  }
  obj = framework.mixCollectionView(obj);

  // auto util.extend if more than one object is passed in
  if(args.length > 0){
    obj = util.extend(obj, args);
  };

  //overwrite el with tagName if one is given
  obj.el = obj.tagName || obj.el || "div";
  obj.elNode = document.createElement(obj.el);


  return obj;
};






