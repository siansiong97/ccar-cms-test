"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBodyTypeIcon = getBodyTypeIcon;
exports.getBodyType = getBodyType;
exports["default"] = exports.bodyTypeList = void 0;
var bodyTypeList = [{
  'icon': "/assets/car-type-ori-ver2/coach.png",
  'value': 'Coach'
}, {
  'icon': "/assets/car-type-ori-ver2/compact.png",
  'value': 'Compact'
}, {
  'icon': "/assets/car-type-ori-ver2/convertible.png",
  'value': 'Convertible'
}, {
  'icon': "/assets/car-type-ori-ver2/coupe.png",
  'value': 'Coupe'
}, {
  'icon': "/assets/car-type-ori-ver2/crossover.png",
  'value': 'Crossover'
}, {
  'icon': "/assets/car-type-ori-ver2/hatchback.png",
  'value': 'Hatchback'
}, {
  'icon': "/assets/car-type-ori-ver2/mpv.png",
  'value': 'MPV'
}, {
  'icon': "/assets/car-type-ori-ver2/pickup-truck.png",
  'value': 'Pickuptruck'
}, {
  'icon': "/assets/car-type-ori-ver2/sedan.png",
  'value': 'Sedan'
}, {
  'icon': "/assets/car-type-ori-ver2/sport-car.png",
  'value': 'Sportcar'
}, {
  'icon': "/assets/car-type-ori-ver2/suv.png",
  'value': 'SUV'
}, {
  'icon': "/assets/car-type-ori-ver2/truck.png",
  'value': 'Truck'
}, {
  'icon': "/assets/car-type-ori-ver2/van.png",
  'value': 'Van'
}, {
  'icon': "/assets/car-type-ori-ver2/wagon.png",
  'value': 'Wagon'
}, {
  'icon': "/assets/car-type-ori-ver2/sport-car.png",
  'value': 'GT'
}, {
  'icon': "/assets/car-type-ori-ver2/truck.png",
  'value': 'Lorry'
}];
exports.bodyTypeList = bodyTypeList;

function getBodyTypeIcon(bodyType) {
  if (bodyType) {
    var selectedBodyType = bodyTypeList.find(function (item) {
      return item.value.toLowerCase() === bodyType.toLowerCase();
    });

    if (selectedBodyType) {
      return selectedBodyType.icon;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getBodyType(bodyType) {
  if (bodyType) {
    var selectedBodyType = bodyTypeList.find(function (item) {
      return item.value.toLowerCase() === bodyType.toLowerCase();
    });

    if (selectedBodyType) {
      return selectedBodyType;
    } else {
      return {
        value: null,
        icon: null
      };
    }
  } else {
    return {
      value: null,
      icon: null
    };
  }
}

var _default = {
  bodyTypeList: bodyTypeList
};
exports["default"] = _default;