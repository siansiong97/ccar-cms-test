"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColorIcon = getColorIcon;
exports.getColor = getColor;
exports["default"] = exports.colorList = void 0;
var colorList = [{
  'code': '#000000',
  'value': 'black'
}, {
  'code': '#FFFFFF',
  'value': 'white'
}, {
  'code': '#E7E7E7',
  'value': 'silver'
}, {
  'code': '#757575',
  'value': 'grey'
}, {
  'code': '#CA912B',
  'value': 'brown'
}, {
  'code': '#623008',
  'value': 'bronze'
}, {
  'code': '#E3C57D',
  'value': 'gold'
}, {
  'code': '#F1DCC3',
  'value': 'beige'
}, {
  'code': '#FFF009',
  'value': 'yellow'
}, {
  'code': '#F87719',
  'value': 'orange'
}, {
  'code': '#DA0000',
  'value': 'red'
}, {
  'code': '#760000',
  'value': 'maroon'
}, {
  'code': '#AC005A',
  'value': 'magenta'
}, {
  'code': '#DC7EA8',
  'value': 'pink'
}, {
  'code': '#670DA8',
  'value': 'purple'
}, {
  'code': '#4EC375',
  'value': 'green'
}, {
  'code': '#01007D',
  'value': 'blue'
}, {
  'code': 'white',
  'value': 'other'
}];
exports.colorList = colorList;

function getColorIcon(color) {
  if (color) {
    var selectedColor = colorList.find(function (item) {
      return item.value.toLowerCase() === color.toLowerCase();
    });

    if (selectedColor) {
      return selectedColor.icon;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getColor(color) {
  if (color) {
    var selectedColor = colorList.find(function (item) {
      return item.value.toLowerCase() === color.toLowerCase();
    });

    if (selectedColor) {
      return selectedColor;
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
  colorList: colorList
};
exports["default"] = _default;