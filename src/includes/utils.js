const fs = require('fs');
const path = require('path');

module.exports = class Utils {
  constructor(logger) {
    this.logger = logger;
  }

  log(message, config){
    var date = new Date();
    var currentDay = date.getDay();
    var currentMonth = date.getMonth();
    var currentYear = date.getFullYear();
    var currentHour = date.getHours();
    if(currentHour < 10)
      currentHour =  '0' + currentHour.toString();
    var currentMinutes = date.getMinutes();
    if(currentMinutes < 10)
      currentMinutes =  '0' + currentMinutes.toString();
    var currentSeconds = date.getSeconds();
    if(currentSeconds < 10)
      currentSeconds =  '0' + currentSeconds.toString();
    var timestamp = '[' + currentHour + ':' + currentMinutes + ':' + currentSeconds + '] ';

    var logMessage = timestamp + message + '\n';
    if(config.debug)
      fs.appendFileSync(path.join(__dirname, '../files/', date.toLocaleDateString().replace(/\//g,'') + '_debug.log'), logMessage, 'utf-8');
  }

  sortByProperty(property) {
    return function(a, b) {
      var sortStatus = 0;
      if (a[property] < b[property]) {
        sortStatus = -1;
      } else if (a[property] > b[property]) {
        sortStatus = 1;
      }

      return sortStatus;
    };
  }

  sortByTwoProperty(prop1, prop2) {
    'use strict';
    return function(a, b) {
      if (a[prop1] === undefined) {
        return 1;
      } else if (b[prop1] === undefined) {
        return -1;
      } else if (a[prop1] === b[prop1]) {
        var sortStatus = 0;
        if (a[prop2].toString().toLowerCase() < b[prop2].toString().toLowerCase()) {
          sortStatus = -1;
        } else if (String(a[prop2]).toString().toLowerCase() > b[prop2].toString().toLowerCase()) {
          sortStatus = 1;
        }
      } else {
        if (a[prop1].toString().toLowerCase() < b[prop1].toString().toLowerCase()) {
          sortStatus = -1;
        } else {
          sortStatus = 1;
        }
      };
      return sortStatus;
    };
  }

  formatInt (number) {
    let str = number.toLocaleString('en-US');
    str = str.replace(/,/g, ' ');
    str = str.replace(/\./, ',');
    return str;
  }

  rmDir (dirPath, extension, removeSelf) {
    if (removeSelf === undefined)
      removeSelf = true;
    try {
      var files = fs.readdirSync(dirPath);
    } catch (e) /* istanbul ignore next */ {
      return false;
    }

    if (files.length > 0)
      for (let i = 0; i < files.length; i++) {
        let filePath = dirPath + '/' + files[i];
        /* istanbul ignore else */
        if (fs.statSync(filePath).isFile()) {
          if (extension !== null) {
            if (path.extname(filePath) == extension)
              fs.unlinkSync(filePath);
          } else {
            fs.unlinkSync(filePath);
          }

        } else {
          utils.rmDir(filePath);
        }
      }
    /* istanbul ignore else */
    if (removeSelf)
      fs.rmdirSync(dirPath);

    return true;
  };

  capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};
