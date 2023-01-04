"use strict";

var Service, Characteristic, HomebridgeAPI;
const { HomebridgeZoneKitVersion } = require('./package.json');

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerPlatform("ZoneKit", "ZoneKit", ZoneKit);

}

function ZoneKit(log, config){
	this.log = log;
  this.name = config.name;
  this.devices = config["devices"];

}

ZoneKit.prototype = {
	accessories: function(callback){
		var foundAccessories = [];
		var index = 0;
		var count = this.devices.length;

		for(index=0; index< count; ++index){
			var accessory  = new zkAccessory(
				this.log,
				this.devices[index]);
			foundAccessories.push(accessory);

		callback(foundAccessories);
	}
}






//---------------------------------------------------------------------------------------

//Virtual DEVICE ACCESSORY

//---------------------------------------------------------------------------------------



function ZoneKitAccessory(log, device) {
	this.log = log;
	this.name = device["name"];
	this._state = false;

	 this._service = new Service.Lightbulb(this.name + ' Accessory');

   var light1 = new Service.Lightbulb("Light 1","1light");
   var light2 = new Service.Lightbulb("Light 2","2light"); 


  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'ZoneKit Platform')
      .setCharacteristic(Characteristic.Model, 'Accessory')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeVDPVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'ZKAccessory_' + this.name.replace(/\s/g, '_'));

  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({dir:this.cacheDirectory, forgiveParseErrors: true});


  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));

  var cachedState = this.storage.getItemSync(this.name);
  if((cachedState === undefined) || (cachedState === false)) {
    this._service.setCharacteristic(Characteristic.On, false);
    }
  else {
    this._service.setCharacteristic(Characteristic.On, true);
    }

}

ZoneKitAccessory.prototype.getServices = function() {

  return [this.informationService, this._service];

}

ZoneKitAccessory.prototype._setOn = function(on, callback) {

  this.log("Setting [Accessory] : " + this.name.replace(/\s/g, '_') + " from " + !on + " to " + on);

    this._state = on;

    if (this._state != this.accessoryaction._state) {
      this.accessoryaction._service.setCharacteristic(Characteristic.On, on);
    }



  this.storage.setItemSync(this.name, on);
  callback();

}

// VirtualDeviceAccessory.prototype.setAccessoryAction = function(accessoryaction) {
//
//   this.accessoryaction = accessoryaction;
//
// }
