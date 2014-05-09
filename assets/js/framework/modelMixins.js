framework.mixModel = function(obj){
  var args = Array.prototype.slice.call(arguments, 0);
  obj = obj || {};

  obj.addEvents = obj.addEvents || function(){
    // Adds Events declared thru API
    var events = this.events;
    for(key in events){
      this.on(key, events[key])
    };
    // add eventBubbling
    util.mixBubbling.call(this);
  };

  obj.get = obj.get || function(propertyName){
    if(propertyName === "modelCollection" && !this.modelCollection){
      this.createCollection(this.modelsArray);
    };
    return this[propertyName];
  };

  obj.remove = obj.remove || function(model){
    var model = this.modelCollection ? this.modelCollection[model.id] : this;
    this.modelCollection ? delete this.modelCollection[model.id]: delete this
    this.refreshDOM(model);
  };

  obj.refreshDOM = obj.refreshDOM || function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift("dom:refresh");
    this.trigger.apply(this, args);
  };

  if(args.length > 0){
    obj = util.extend(obj, args);
  };

  if(obj.defaults){
    util.extend(obj, obj.defaults);
  };

  // add event system if not already present
  obj._events || util.mixEvents(obj) && (obj.events || obj.model) && obj.addEvents();

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

  return obj;
};

