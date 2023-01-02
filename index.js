"use strict";

var Service, Characteristic, HomebridgeAPI;
const { HomebridgeVDPVersion } = require('./package.json');

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerPlatform("homebridge-virtual-device-platform", "VirtualDevicePlatform", VirtualDevicePlatform);

}

function VirtualDevicePlatform(log, config){
	this.log = log;
  this.name = config.name;
  this.devices = config["devices"];

}

VirtualDevicePlatform.prototype = {
	accessories: function(callback){
		var foundAccessories = [];
		var index = 0;
		var count = this.devices.length;


		for(index=0; index< count; ++index){
			var accessory  = new VirtualDeviceAccessory(
				this.log,
				this.devices[index]);
			foundAccessories.push(accessory);

      var accessorySwitch  = new VirtualDeviceAccessorySwitch(
				this.log,
				this.devices[index]);
			foundAccessories.push(accessorySwitch);

      var accessoryAction  = new VirtualDeviceAccessoryAction(
				this.log,
				this.devices[index],accessory);
			foundAccessories.push(accessoryAction);
		}
    var accessorygroup  = new VirtualDeviceAccessoryGroup(
        this.log,
        this.name, foundAccessories);

    foundAccessories.push(accessorygroup);
		callback(foundAccessories);
	}
};






//---------------------------------------------------------------------------------------

//Virtual DEVICE ACCESSORY

//---------------------------------------------------------------------------------------



function VirtualDeviceAccessory(log, device) {
	this.log = log;
	this.name = device["name"];
	this._state = false;

	this._accessoryService = new VirtualDeviceAccessorySwitch(this.log, this.name + " TEST Accessory", this._state);
	//this._accessoryactionService = new VirtualDeviceAccessoryAction(this.log, this.name + " TEST Accessory Action", this._accessoryService);


	 this._service = new Service.Lightbulb(this.name + 'Accessory');


  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Virtual Device Platform')
      .setCharacteristic(Characteristic.Model, 'Accessory')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeVDPVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'VDPAccessory_' + this.name.replace(/\s/g, '_'));

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

VirtualDeviceAccessory.prototype.getServices = function() {

  return [this.informationService, this._service];

}

VirtualDeviceAccessory.prototype._setOn = function(on, callback) {

  this.log("Setting [Accessory] : " + this.name.replace(/\s/g, '_') + " from " + !on + " to " + on);

    this._state = on;

    if (this._state != this.accessoryaction._state) {
      this.accessoryaction._service.setCharacteristic(Characteristic.On, on);
    }



  this.storage.setItemSync(this.name, on);
  callback();

}

VirtualDeviceAccessory.prototype.setAccessoryAction = function(accessoryaction) {

  this.accessoryaction = accessoryaction;

}

//---------------------------------------------------------------------------------------

//Virtual DEVICE ACCESSORY SWITCH

//---------------------------------------------------------------------------------------



function VirtualDeviceAccessorySwitch(log, name) {
	this.log = log;
	this.name = name;
	  this._state = false;

	console.log(this.name + " = " + "Test");

	 this._service = new Service.Lightbulb(this.name + "Accessory Switch");

	 this.accessoryaction = "";

  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Virtual Device Platform')
      .setCharacteristic(Characteristic.Model, 'Accessory')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeVDPVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'VDPAccessory_' + this.name.replace(/\s/g, '_'));

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

VirtualDeviceAccessorySwitch.prototype.getServices = function() {

  return [this.informationService, this._service];

}

VirtualDeviceAccessorySwitch.prototype._setOn = function(on, callback) {

  this.log("Setting [Accessory] : " + this.name.replace(/\s/g, '_') + " from " + !on + " to " + on);

    this._state = on;

    if (this._state != this.accessoryaction._state) {
      this.accessoryaction._service.setCharacteristic(Characteristic.On, on);
    }



  this.storage.setItemSync(this.name, on);
  callback();

}

VirtualDeviceAccessorySwitch.prototype.setAccessoryAction = function(accessoryaction) {

  this.accessoryaction = accessoryaction;

}







//---------------------------------------------------------------------------------------

//Virtual DEVICE ACCESSORY ACTION

//---------------------------------------------------------------------------------------


function VirtualDeviceAccessoryAction(log, name, accessory) {

  this.log = log;
  //this.name = name + " Accessory Action";
  this._service = new Service.Switch(this.name + 'Accessory Action');
  this._state = false;

  this.accessory = accessory;

  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Virtual Device Platform')
      .setCharacteristic(Characteristic.Model, 'Accessory Action')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeVDPVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'VDPAccessoryAction_' + this.name.replace(/\s/g, '_'));

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

VirtualDeviceAccessoryAction.prototype.getServices = function() {

  return [this.informationService, this._service];

}

VirtualDeviceAccessoryAction.prototype._setOn = function(on, callback) {

  if (on && this._state){
    this.log("Setting [Accessory Action] : " + this.name.replace(/\s/g, '_') + " from " + !on + " to " + on);
    setTimeout(() => {
      this._service.setCharacteristic(Characteristic.On, false)
      }, 100);
    }
  else {
    this._state = on;

	      this.log("Setting [Accessory Action] : " + this.name.replace(/\s/g, '_') + " from " + !on + " to " + on);
    this.storage.setItemSync(this.name, on);
    }



this.accessory._service.setCharacteristic(Characteristic.On, this._state);

  callback();

}

VirtualDeviceAccessoryAction.prototype.getStringFromState = function (state) {
  return state ? 'on' : 'off'
}











//---------------------------------------------------------------------------------------

//Virtual DEVICE ACCESSORY GROUP

//---------------------------------------------------------------------------------------


function VirtualDeviceAccessoryGroup(log, name) {

  this.log = log;
  this.name = name + 'Accessory Group';

   this._service = new Service.Fan(this.name);

  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Virtual Device Platform')
      .setCharacteristic(Characteristic.Model, 'Accessory Group')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeVDPVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'VDPAccessoryGroup_' + this.name.replace(/\s/g, '_'));

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

VirtualDeviceAccessoryGroup.prototype.getServices = function() {

  return [this.informationService, this._service];

}

VirtualDeviceAccessoryGroup.prototype._setOn = function(on, callback) {

  this.log("Setting [Accessory Group] : " + this.name.replace(/\s/g, '_') + " to " + on);
  this.storage.setItemSync(this.name, on);
  callback();

}
