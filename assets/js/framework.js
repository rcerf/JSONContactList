var mixRegion = function(obj) {
  var args = Array.prototype.slice.call(arguments, 0);
  obj = obj || {};
  if(args.length > 1){
    obj = extend(obj, args);
  };

  obj._selector;

  obj.addSelector = function(id){
    this._selector = document.getElementById(id);
  };

  obj.show = function(view){
    var nodeTree = view.render();
    this._selector.appendChild(nodeTree);
  };

  return obj;
};

var mixItemView = function(obj){
  var args = Array.prototype.slice.call(arguments, 0);
  if(args.length > 1){
    obj = extend({}, args);
  };
  obj = obj || {};

  obj.render = obj.render || function(){
    return this.getCachedTemplate();
  };

  obj.addEvents = obj.addEvents || function(){
    var events = this.events;
    for(key in events){
      this.on(key, events[key])
    };
  };

  obj.getCachedTemplate = obj.getCachedTemplate || function(){
    if(!this.model || !this.template){
      console.log("You need to set a model and/or a template on this ItemView before you can render!");
      return;
    };
    this._selectedTemplate = this.template && document.getElementById(this.template);
    var childNodes = template(this.model, this._selectedTemplate);
    this._cachedTemplate = document.createElement(this.el || "div");
    for(var i = 0; i<childNodes.length; i++){
      if(this._events){
        bindDOMEventListeners(this, childNodes[i]);
      };
      this._cachedTemplate.appendChild(childNodes[i]);
    };
    return this._cachedTemplate;
  };

  // add event system if not already present
  obj._events || mixEvents(obj) && obj.events && obj.addEvents();

  return obj;
};

var mixCollectionView = function(obj){
  var args = Array.prototype.slice.call(arguments, 1);
  obj = obj || {};

  obj.createItemViewCollection = function(){
    var models = this.collection.get("modelCollection");
    this.itemViewCollection = [];

    for(var i=0; i<models.length; i++){
      var tempItemView = mixItemView({model: models[i]},this.itemView)
      //save a collection of itemViews in the CollectionView
      this.itemViewCollection.push(tempItemView);
    };
  };

  obj.iterateSortItemViewCollection = function(callback, sort){
    this.itemViewCollection || this.createItemViewCollection();
    //TODO: sort method for collection
    for(var i=0; i<this.itemViewCollection.length; i++){
      var itemView = this.itemViewCollection[i];
      callback.call(this, itemView);
    };
  };

  obj.render = function(){
    if(!this.hasOwnProperty("collection") || !this.hasOwnProperty("itemView")){
      console.log("No collection and/or itemView property set on CollectionView.")
    }
    this._cachedTemplate = document.createElement(this.el);
    this.iterateSortItemViewCollection(function(itemView){
      var childNodes = itemView.render().childNodes;
      for(var j=0; j<childNodes.length; j++){
        // call render on each Itemview and append it to collection node
        var childNode = childNodes[j];
        this._cachedTemplate.appendChild(childNode);
      };
    });
    return this._cachedTemplate;
  };

  obj = mixItemView(obj);

  // auto extend if more than one object is passed in
  if(args.length > 0){
    obj = extend(obj, args);
  };

  obj.el = obj.tagName || obj.el || "div";
  obj.elNode = document.createElement(obj.el);

  return obj;
};

var mixModel = function(obj){
  var args = Array.prototype.slice.call(arguments, 0);
  obj = obj || {};

  obj.get = function(propertyName){
    return this[propertyName];
  };

  if(args.length > 0){
    obj = extend(obj, args);
  };

  if(obj.hasOwnProperty("defaults")){
    extend(obj, obj.defaults);
  };

  return obj;
};

var mixCollection = function(obj){
  var args = Array.prototype.slice.call(arguments, 0);

  if(args.length > 1 && Array.isArray(args[0])){
    obj = {};
    // if first arg is Array make assume it's a modelsArray
    obj.modelsArray = args[0];
    args = args.slice(1);
  };

  obj = obj || {};
  obj.modelCollection = [];

  obj.createCollection = function(arr){
    if(!this.hasOwnProperty("model")){
      console.log("Must set the collections model first");
      return;
    };
    for(var i=0; i<arr.length; i++){
      // Create Models from Array and push into modelCollection
      this.modelCollection.push(this.createModel(arr[i]));
    };
  };

  obj.createModel = function(obj){
    return mixModel(obj, this.model);
  };

  obj = extend(obj, args, mixModel(obj));

  if(obj.hasOwnProperty("modelsArray") && obj.hasOwnProperty("model")){
    obj.createCollection(obj.modelsArray);
  };

  return obj;
};

