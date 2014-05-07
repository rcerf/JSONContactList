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
};







