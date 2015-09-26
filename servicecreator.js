function createSinkFoundExposerService(execlib, ParentServicePack) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry,
    ParentService = ParentServicePack.Service;

  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function SinkFoundExposerService(prophash) {
    if (!prophash) {
      throw new lib.Error('NO_PROPERTY_HASH', 'SinkFoundExposerService ctor needs a propertyhash');
    }
    if (!prophash.sinkname) {
      throw new lib.Error('NO_SINK_NAME_IN_PROPERTY_HASH', 'SinkFoundExposerService propertyhash misses the sinkname');
    }
    this.sinkName = prophash.sinkname;
    this.identity = prophash.identity || {name: 'user', role: 'user'};
    ParentService.call(this, prophash);
  }
  
  ParentService.inherit(SinkFoundExposerService, factoryCreator);
  
  SinkFoundExposerService.prototype.__cleanUp = function() {
    ParentService.prototype.__cleanUp.call(this);
    this.identity = null;
    this.sinkName = null;
  };

  SinkFoundExposerService.prototype.obtainOuterSink = function () {
    taskRegistry.run('findSink', {
      sinkname: this.sinkName,
      identity: this.identity,
      onSink: this.setOuterSink.bind(this)
    });
  };
  
  return SinkFoundExposerService;
}

module.exports = createSinkFoundExposerService;
