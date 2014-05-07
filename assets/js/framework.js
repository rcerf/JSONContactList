var framework = {};
framework.mixApp = function(obj){
  obj = obj || {};
  util.mixEvents(obj);
  util.mixReqres(obj);

  obj.start = function(){
    this.trigger("initialize:after");
  };

  obj.addRegions = function(obj){
    var app = this;
    for(var key in obj){
      app[key] = framework.mixRegion({}, obj[key]);
      var addSelector = function(){
        this[key].addSelector();
      };
      var boundAddSelector = addSelector.bind(this);
      app.on("initialize:after", function(){
        boundAddSelector();
      });
    }
  };

  obj.module = function(moduleName, callback){
    var moduleNameArray = moduleName.split(".");
    var container = this;
    for(var i=0; i<moduleNameArray.length; i++){
      container = container[moduleNameArray[i]] ? container[moduleNameArray[i]] : container[moduleNameArray[i]] = {};
      container;
    };
    callback(container, this, framework, util);
  };

  return obj;
};

framework.mixRegion = function(obj, id) {
  var id = id.slice(1);
  obj = obj || {};
  obj._selector;

  obj.addSelector = function(){
    this._selector = document.getElementById(id);
  };

  obj.show = function(view){
    var nodeTree = view.render();
    this._selector.appendChild(nodeTree);
  };

  return obj;
};

framework.mixController = function(obj){
  obj = obj || {};
  return obj;
}

framework.mixItemView = function(obj){
  var args = Array.prototype.slice.call(arguments, 0);
  if(args.length > 1){
    obj = util.extend({}, args);
  };
  obj = obj || {};

  obj.addEvents = obj.addEvents || function(){
    var events = this.events;
    for(key in events){
      this.on(key, events[key])
    };
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

  // add event system if not already present
  obj._events || util.mixEvents(obj) && obj.events && obj.addEvents();
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
    this.itemViewCollection || this.createItemViewCollection();
    for(var i=0; i<this.itemViewCollection.length; i++){
      var itemView = this.itemViewCollection[i];
      callback.call(this, itemView);
    };
  };

  if(obj.render){
   console.log("Render present");
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

framework.mixModel = function(obj){
  var args = Array.prototype.slice.call(arguments, 0);
  obj = obj || {};

  obj.get = function(propertyName){
    if(propertyName === "modelCollection" && !this.modelCollection){
      this.createCollection(this.modelsArray);
    };
    return this[propertyName];
  };

  if(args.length > 0){
    obj = util.extend(obj, args);
  };

  if(obj.hasOwnProperty("defaults")){
    util.extend(obj, obj.defaults);
  };

  return obj;
};

framework.mixCollection = function(obj){
  var args = Array.prototype.slice.call(arguments, 0);

  if(Array.isArray(args[0])){
    obj = {};
    // if first arg is Array make assume it's a modelsArray
    obj.modelsArray = args[0];
    args = args.slice(1);
  };

  obj = obj || {};

  obj.remove = function(model){
    delete this.modelCollection[model.id];
    //need to trigger a refresh DOM event so the compositeView can:
    // 1) re-render it's DOM tree passed on new collection
    // 2) clear current tree from DOM
    // 3) append new tree to correct region
    console.log("contact deleted");
  };

  obj.createCollection = function(arr){
    if(!this.hasOwnProperty("model")){
      console.log("Must set the collections model first");
      return;
    };
    if(this.hasOwnProperty("comparator")){
      var sorter = function(a,b){
          return a[this.comparator] < b[this.comparator] ? -1 : 1;
      };
      arr.sort(sorter.bind(this));
    };
    var count = 0;
    this.modelCollection = {};
    for(var i=0; i<arr.length; i++){
      // Create Models from Array and push into modelCollection
      var model = this.createModel(arr[i]);
      var id = model.id || count;
      model.id = id;
      this.modelCollection[id] = model;
      count++;
    };
  };

  obj.createModel = function(obj){
    return framework.mixModel(obj, this.model);
  };

  obj = util.extend(obj, args, framework.mixModel(obj));

  //if(obj.hasOwnProperty("modelsArray") && obj.hasOwnProperty("model")){
   // obj.createCollection.call(obj, obj.modelsArray);
  //};

  return obj;
};

