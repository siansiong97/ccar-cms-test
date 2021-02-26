import { isInteger } from "lodash";
import _ from 'lodash';
import queryString from 'query-string';
import cookie from 'cookie';
import { statePersistActions } from "./redux/config";

var moment = require('moment');

const defaultRangeSmaller = '<='
const defaultRangeBigger = '>='
const availableFilters = ['make', 'model', 'title', 'condition', 'transmission', 'state', 'area', 'priceRange', 'yearRange', 'mileageRange', 'engineCapacityRange', 'bodyType', 'color', 'fuelType', 'registrationUrl', 'readyStock', 'car360View', 'businessType'];

export function isNumberAndSpace(value) {

    //to array
    if (value != null) {
        value = value.split('');
        if (
            value.filter(function (item, index) {

                return !parseInt(item) && parseInt(item) != 0 && item != ' ';
            }).length > 0
        ) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}


export function formatDate(value, format) {

    if (value != null) {
        if (!isValidDate(value)) {
            return null;
        } else {

            if (format == null) {
                format = "DD/MM/YYYY"
            }

            return moment(value).format(format);
        }
    } else {
        return null;
    }

}

export function formatNumber(value, unit, round, fixedPoint, trim) {

    if (value != null) {
        if (isNaN(parseFloat(value))) {
            return value;
        } else {

            value = parseFloat(value);
            //default will auto round up if round didn't passed in
            //default fixedPoint 0
            switch (unit) {
                case "k":
                    value = numberToFixed(value / 1000, round, fixedPoint);
                    break;
                case "m":
                    value = numberToFixed(value / 1000000, round, fixedPoint);
                    break;
                case "b":
                    value = numberToFixed(value / 1000000000, round, fixedPoint);
                    break;
                case "auto":
                    let units = [['', 1], ['k', 1000], ['m', 1000000], ['b', 1000000000]];
                    //get closest unit

                    if (value <= 1) {
                        unit = '';
                    } else {
                        _.forEach(_.reverse(units), function (item, index) {
                            if (value / item[1] >= 1) {
                                value = numberToFixed(value / item[1], round, fixedPoint);
                                unit = item[0];
                                return false;
                            }

                        })
                    }


                    break;
                default:
                    value = numberToFixed(value, round, fixedPoint);
                    break;
            }

            let formatedValue = '';
            let prefix = insertBetween(parseInt(value), 3, ',', true, true);
            let postfix = value.toString().split('.')[1];
            formatedValue += prefix;
            if (postfix) {
                formatedValue += '.' + postfix;
            }

            if (trim) {
                formatedValue = trimStringNumber(formatedValue);
            }
            if (unit) {
                formatedValue += unit;
            }



            return formatedValue;
        }
    } else {
        return value;
    }

}

export function numberToFixed(value, round, fixedPoint, fromFront) {

    if (value != null && !isNaN(parseFloat(value))) {

        if (isNaN(parseInt(fixedPoint))) {
            //Default
            fixedPoint = 0;
        } else {
            fixedPoint = parseInt(fixedPoint);
        }

        if (round == null) {
            round = true;
        }

        if (fromFront) {
            value = parseFloat(value);
            value = value.toString().split('.');
            if (value[0]) {
                // if (value[0].length > fixedPoint) {
                //     value[0] = value[0].slice(value[0].length - fixedPoint);
                // }

                if (value[0].length < fixedPoint) {
                    _.forEach(_.range(fixedPoint - value[0].length), function () {
                        value[0] = '0' + value[0];
                    })
                }

                return value[0];
            }
        } else {
            value = parseFloat(value);
            if (round) {
                return value.toFixed(fixedPoint);
            } else {
                value = value.toString().split('.');
                if (value[1]) {
                    if (value[1].length > fixedPoint) {
                        value[1] = value[1].slice(0, fixedPoint);
                    }

                    if (value[1].length < fixedPoint) {
                        _.forEach(_.range(fixedPoint - value[0].length), function () {
                            value[0] = value[0] + '0';
                        })
                    }
                }

                return parseFloat(value.join(".")).toFixed(fixedPoint);
            }
        }


    } else {
        return value;
    }

}

//Remove prefix 0 and postfix 0
export function trimStringNumber(value) {

    if (value != null) {

        value = value.toString().split('.');
        let prefix = value[0];
        let postfix = value[1];

        if (prefix != null) {
            if (prefix.length > 1) {
                let prefixArr = prefix.split("");
                let done = false;
                prefixArr.some(num => {
                    if (num == '0') {
                        //cut out 0
                        prefix = prefix.substring(1);
                    } else {
                        done = true;
                    }
                    return done;
                });
            }
        }

        if (postfix != null) {
            if (postfix.length > 0) {
                let postfixArr = postfix.split("").reverse();
                let done = false;
                postfixArr.some(num => {
                    if (num == '0') {
                        //cut out 0
                        postfix = postfix.substring(0, postfix.length - 1);
                    } else {
                        done = true;
                    }
                    return done;
                });
            }
        }
        if (postfix) {
            return prefix + "." + postfix;
        } else {
            return prefix;
        }

    } else {
        return value;
    }

}

export function reverseString(value) {

    if (value != null) {
        var strArray = value.toString().split("");
        strArray = strArray.reverse();
        return strArray.join("");
    } else {
        return value;
    }

}


export function checkCardType(number) {
    if (number != null) {

        number = number.replace(/\s/g, '');
        // visa
        var re = new RegExp("^4");
        if (number.match(re) != null)
            return "VISA";

        // Mastercard 
        // Updated for Mastercard 2017 BINs expansion
        if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
            return "MASTERCARD";

        // AMEX
        re = new RegExp("^3[47]");
        if (number.match(re) != null)
            return "AMERICANEXPRESS";

        // Discover
        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
        if (number.match(re) != null)
            return "DISCOVER";

        // Diners
        re = new RegExp("^36");
        if (number.match(re) != null)
            return "DINERS";

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (number.match(re) != null)
            return "DINERSCARTEBLANCHE";

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (number.match(re) != null)
            return "JCB";

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (number.match(re) != null)
            return "VISAELECTRON";

    }
    return null;
}

export function removeNullFromArray(value) {

    if (notEmptyLength(value)) {
        return value.filter(function (item) {
            return item != null;
        })
    }

    return value;
}
export function isValidDate(value) {

    if (value != null) {
        value = new Date(value);
        if (Object.prototype.toString.call(value) === "[object Date]") {
            // it is a date
            if (isNaN(value.valueOf())) {  // value.valueOf() could also work
                return false;
            } else {
                return true
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function calculateTimeRange(date1, date2, unit, precise) {

    if (date1 != null) {
        if (isValidDate(date1)) {
            date1 = moment(date1);

            if (date2 != null) {
                if (isValidDate(date2)) {
                    date2 = moment(date2);
                } else {
                    return null;
                }
            } else {
                date2 = moment();
            }

            let data = {};
            switch (unit) {
                case 'year':
                    data.difference = date1.diff(date2, 'years', precise);
                    data.unit = unit;
                    break;
                case 'month':
                    data.difference = date1.diff(date2, 'months', precise);
                    data.unit = unit;
                    break;
                case 'week':
                    data.difference = date1.diff(date2, 'weeks', precise);
                    data.unit = unit;
                    break;
                case 'day':
                    data.difference = date1.diff(date2, 'days', precise);
                    data.unit = unit;
                    break;
                case 'hour':
                    data.difference = date1.diff(date2, 'hours', precise);
                    data.unit = unit;
                    break;
                case 'minute':
                    data.difference = date1.diff(date2, 'minutes', precise);
                    data.unit = unit;
                    break;
                case 'second':
                    data.difference = date1.diff(date2, 'seconds', precise);
                    data.unit = unit;
                    break;

                default:
                    //auto get nearest 1
                    let sections = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']
                    let selectedSection = sections.find(function (section) {
                        return Math.abs(date1.diff(date2, section + 's', true)) >= 1;
                    })
                    if (selectedSection) {
                        data.difference = date1.diff(date2, selectedSection + 's', precise);
                        data.unit = selectedSection;
                    } else {
                        data.difference = 0;
                        data.unit = 'second';
                    }
            }

            return data;
        } else {
            return null;
        }
    } else {
        return null;
    }

}

export function convertMilliSecondsToTime(millisecond, minUnit) {

    if (millisecond != null && isValidNumber(parseInt(millisecond))) {

        let second = 0, minute = 0, hour = 0;
        let finalTime = '';
        millisecond = parseInt(millisecond);

        hour = numberToFixed(moment.duration(millisecond).hours(), false, 2, true);
        minute = numberToFixed(moment.duration(millisecond).minutes(), false, 2, true);
        second = numberToFixed(moment.duration(millisecond).seconds(), false, 2, true);

        switch (minUnit) {
            case 'minute':
                if (hour > 0) {
                    finalTime = `${hour}:${minute}:${second}`;
                } else {
                    finalTime = `${minute}:${second}`;
                }
                break;
            case 'hour':
                finalTime = `${hour}:${minute}:${second}`;
                break;

            default:
                if (hour > 0) {
                    finalTime = `${hour}:${minute}:${second}`;
                } else if (minute > 0) {
                    finalTime = `${minute}:${second}`;
                } else {
                    finalTime = `${second}`;
                }
                break;
        }

        return finalTime;
    } else {
        return null;
    }

}
export function isExpired(date, aspect) {

    if (aspect == null) {
        aspect = 'second';
    }

    if (date != null && isValidDate(date)) {
        var today = moment();
        date = moment(date);
        return today.isAfter(date, aspect);
    }
    return null;
}
export function convertToCardFormat(value) {

    if (value != null) {
        value = value.replace(/\s/g, '');
        value = insertBetween(value, 4, ' ');
    }

    return value
}

export function convertToExpiredDateFormat(value) {

    if (value != null) {
        var str = value.split('');
        if (str.length < 3) {
            if (str[1] == '/') {
                str.splice(0, 0, '0');
                value = str.join("");
            } else {
                value = value.replace('/', '');
                value = insertBetween(value, 2, '/');
            }
        }
    }

    return value;

}

export function insertBetween(value, space, char, fromBack, stopAtEnd) {

    if (value != null) {
        if (isNaN(parseInt(space))) {
            return value;
        } else {
            if (fromBack) {
                value = reverseString(value);
            }
            var oristr = value.toString().split('');
            var length = oristr.length;
            var addedspacecount = 1;
            space = parseInt(space);
            for (let index = 0; index < length; index++) {
                if (index != 0 && (index + 1) % space == 0) {
                    if (stopAtEnd && index == length - 1) {
                        break;
                    }
                    oristr.splice(index + addedspacecount, 0, char);
                    addedspacecount = addedspacecount + 1;
                }
            }
            if (fromBack) {
                oristr = oristr.reverse();
            }
            return oristr.join("");
        }
    } else {
        return null;
    }

}

export function checkSupportedCardType(card) {
    if (card != null) {
        // visa
        if (card == 'VISA') {
            return true;
        }

        if (card == 'MASTERCARD') {
            return true;
        }

        if (card == 'VISAELECTRON') {
            return true;
        }

        if (card == 'AMERICANEXPRESS') {
            return true;
        }

    }
    return false;
}
export function isValidNumber(value) {
    return !isNaN(parseFloat(value));
}
export function isExpiryDateFormat(value) {

    if (value != null) {
        //to array
        value = value.split('');
        if (
            value.filter(function (item, index) {
                if (index == 2) {
                    return item != '/';
                }

                return !parseInt(item) && parseInt(item) != 0;
            }).length > 0
        ) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

export function sortByDesc(data, col) {

    if (data && col) {
        return data.sort(function (a, b) {
            if (_.isPlainObject(a) || _.isPlainObject(b) || _.isArray(a) || _.isArray(b)) {
                if (!col) {
                    col = 0;
                }
                if (a[col] < b[col]) return 1;
                if (a[col] > b[col]) return -1;
                return 0;
            } else {
                if (a < b) return 1;
                if (a > b) return -1;
                return 0;
            }
        });
    } else {
        return [];
    }
}

export function sortByDateDesc(data, col) {

    if (data && col) {
        return data.sort(function (a, b) {
            if (moment(a[col]).isBefore(moment(b[col]))) return 1;
            if (moment(a[col]).isAfter(moment(b[col]))) return -1;
            return 0;
        });
    } else {
        return [];
    }
}

export function findData(data, col, val) {
    return data.filter(function (item) {
        return item[col] == val;
    })
}
export function hideStringNumber(string, start, end) {
    if (string) {
        var length = string.length;

        //Get rest part
        var startpart = '';
        var endpart = '';
        if (Number.isInteger(start) && Number.isInteger(end)) {
            startpart = string.slice(0, start);
            endpart = string.slice(length - (length - end), length);
        } else if (Number.isInteger(start)) {
            startpart = string.slice(0, start);
            endpart = '';
        } else if (Number.isInteger(end)) {
            startpart = '';
            endpart = string.slice(length - (length - end), length);
        } else {
            return string;
        }

        //Get desire convert part
        var convertpart = '';
        if (Number.isInteger(start) && Number.isInteger(end)) {
            convertpart = string.slice(start, end);
        } else if (Number.isInteger(start)) {
            convertpart = string.slice(start)
        } else if (Number.isInteger(end)) {
            convertpart = string.slice(0, end)
        } else {
            return string;
        }

        //to array
        convertpart = convertpart.split('');
        convertpart = convertpart.map(function (char) {
            if (isNaN(parseInt(char)) || !parseInt(char)) {
                return char;
            } else {
                return '*';
            }
        })

        //to string
        convertpart = convertpart.join("");

        return startpart + convertpart + endpart;



    } else {
        return null;
    }

}
export function notEmptyLength(data) {
    if (data) {
        if (Array.isArray(data) && data.length > 0) {
            return true;
        } else if (isObject(data) && Object.keys(data).length > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
export function arrayLengthCount(data) {

    if (notEmptyLength(data) && Array.isArray(data)) {
        return data.length;
    } else {
        return 0;
    }
}


export function syncDefaultDelivery(data, id) {
    return data.map(function (item) {
        if (item._id) {
            if (item._id != id) {
                if (item.isDefaultDelivery) {
                    item.isDefaultDelivery = false;
                }
            } else {
                item.isDefaultDelivery = true;
            }
        }

        return item;
    })
}

export function syncDefaultBilling(data, id) {
    return data.map(function (item) {
        if (item._id) {
            if (item._id != id) {
                if (item.isDefaultBilling) {
                    item.isDefaultBilling = false;
                }
            } else {
                item.isDefaultBilling = true;
            }
        }

        return item;
    })
}


export function syncDefaultCard(data, id) {
    return data.map(function (item) {
        if (item._id) {
            if (item._id != id) {
                if (item.isDefaultCard) {
                    item.isDefaultCard = false;
                }
            } else {
                item.isDefaultCard = true;
            }
        }

        return item;
    })
}
export function syncDefaultBank(data, id) {
    return data.map(function (item) {
        if (item._id) {
            if (item._id != id) {
                if (item.isDefaultBank) {
                    item.isDefaultBank = false;
                }
            } else {
                item.isDefaultBank = true;
            }
        }

        return item;
    })
}

export function isSavedWishList(data, id) {
    if (data && id) {
        var check = data.filter(function (item) {
            return item.productId == id;
        });

        return check.length > 0;
    } else {
        return false;
    }

}

export function isFollowed(data, id) {
    if (data && id) {
        var check = data.filter(function (item) {
            return item.companyId == id;
        });

        return check.length > 0;
    } else {
        return false;
    }

}

export function deepEqual(object1, object2) {
    if (object1 && object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            const val1 = object1[key];
            const val2 = object2[key];
            const areObjects = isObject(val1) && isObject(val2);
            if (
                areObjects && !deepEqual(val1, val2) ||
                !areObjects && val1 !== val2
            ) {
                return false;
            }
        }

    } else {
        return false
    }

    return true;
}

export function isObject(object) {
    return object != null && typeof object === 'object';
}

export function deepEqualArrayObject(array1, array2) {


    if (Array.isArray(array1) && Array.isArray(array2)) {
        if (array1.length != array2.length) {
            return false;
        } else {
            for (let x = 0; x < array1.length; x++) {
                if (!deepEqual(array1[x], array2[x])) {
                    return false;
                }
            }
            return true;
        }


    } else {
        return false;
    }
}


export function roundToHalf(number) {

    if (number != null) {
        if (!isNaN(parseFloat(number))) {
            var decimal = parseFloat(number);
            var int = parseInt(number);

            decimal = decimal - int;
            return decimal >= 0.5 ? int + 0.5 : int;

        }
    }

    return false;
}


export function queryStringifyNestedObject(value, colName) {

    if (value != null) {
        if (colName) {
            let data = {};
            data[colName] = JSON.stringify(value);
            return queryString.stringify(data);
        }
        return queryString.stringify({
            data: JSON.stringify(value)
        })
    }

    return '';
}

export function getImgTagSource(str) {
    if (str) {
        str = str.toString();
        let strArr = str.split("");
        let removed = true;
        //Get html tag only
        strArr = _.compact(_.map(strArr, function (chr) {
            if (chr == '<') {
                removed = false;
                return chr;
            }

            if (chr == '>') {
                removed = true;
                return chr;
            }
            if (removed) {
                return null;
            }
            return chr;
        }));

        let images = strArr.join("").split(">");
        images = _.compact(_.map(images, function (image) {
            if (image.substr(0, 4) == '<img') {
                //point to src value
                let startIndex = image.indexOf('src="') + 5;

                //crop until src
                let croppedStrArr = image.substr(startIndex)
                croppedStrArr = croppedStrArr.split("");
                let removed = false;

                //retrieve value
                croppedStrArr = _.compact(_.map(croppedStrArr, function (chr) {
                    if (chr == '"') {
                        removed = true;
                        return null;
                    }
                    if (removed) {
                        return null;
                    }
                    return chr;
                }));

                return { url: `/${croppedStrArr.join("")}`, name: croppedStrArr.join("").slice(10) };

            }

            return null;
        }))
        return images;
    } else {
        return str;
    }
}

export function removeHtmlTag(str) {
    if (str) {
        str = str.toString();
        let strArr = str.split("");
        let removed = false;
        strArr = _.compact(_.map(strArr, function (chr) {
            if (chr == '<') {
                removed = true;
                return null;
            }

            if (chr == '>') {
                removed = false;
                return null;
            }
            if (removed) {
                return null;
            }
            return chr;
        }));

        return strArr.join("");
    } else {
        return str;
    }
}

export function convertToRangeFormat(value) {
    let data = _.cloneDeep(value);
    //Convert Range Format
    if (notEmptyLength(data)) {
        //Restruct range format to convert
        if (!data[0] && !data[1]) {
        } else if (!data[0]) {
            data[0] = data[1];
            data[1] = defaultRangeSmaller
        } else if (!data[1]) {
            data[1] = defaultRangeBigger
        }
    }

    return data;
}

export function convertRangeFormatBack(valueArr) {
    if (_.isArray(valueArr) && !_.isEmpty(valueArr)) {
        let parameter1 = valueArr[0];
        let parameter2 = valueArr[1];
        let data = [,]

        if (parameter2 == defaultRangeSmaller || parameter2 == defaultRangeBigger) {
            if (parameter2 == defaultRangeBigger) {
                data[0] = parameter1;
            }
            if (parameter2 == defaultRangeSmaller) {
                data[1] = parameter1;
            }
            return data;
        } else {
            return valueArr;
        }
    } else {
        return valueArr;
    }
}



export function convertFilterRange(value, name) {

    if (notEmptyLength(value) && name) {
        let parameter1 = parseFloat(value[0]);
        let parameter2 = value[1];
        let finalData = [];
        let query = {};

        if (!isValidNumber(parameter1)) {
            return null;
        }

        if (parameter2 != null) {

            switch (parameter2) {
                case '<=':
                    query[`${name}`] = { $lte: +(parameter1) }
                    finalData.push(query);
                    break;
                case '<':
                    query[`${name}`] = { $lt: +(parameter1) }
                    finalData.push(query);
                    break;
                case '==':
                    query[`${name}`] = { $eq: +(parameter1) }
                    finalData.push(query);
                    break;
                case '>':
                    query[`${name}`] = { $gt: +(parameter1) }
                    finalData.push(query);
                    break;
                case '>=':
                    query[`${name}`] = { $gte: +(parameter1) }
                    finalData.push(query);
                    break;
                default:
                    parameter2 = parseFloat(parameter2);
                    if (!isValidNumber(parameter2)) {
                        query[`${name}`] = { $eq: +(parameter1) }
                        finalData.push(query);
                    } else {
                        query[`${name}`] = { $gte: +(parameter1) }
                        finalData.push(query);

                        let query1 = {};
                        query1[`${name}`] = { $lte: +(parameter2) }
                        finalData.push(query1);
                    }
                    break;
            }

        } else {
            query[`${name}`] = { $eq: +(parameter1) }
            finalData.push(query);
        }
        return finalData;
    } else {
        return null;
    }
}

export function objectRemoveEmptyValue(value) {

    if (notEmptyLength(value) && _.isPlainObject(value)) {
        return _.pickBy(value, function (property) {
            return _.isArray(property) ? notEmptyLength(_.compact(property)) : _.isPlainObject(property) ? notEmptyLength(objectRemoveEmptyValue(property)) : property;
        });
    } else {
        return {}
    }
}

export function convertProductRouteParamsToFilterObject(routeParams) {

    let { parameter1, parameter2, parameter3 } = routeParams;
    let { sorting, page, } = routeParams;
    let mergeObj = _.pick(routeParams, availableFilters) || {};

    if (!isValidNumber(parseInt(page))) {
        page = 1;
    }

    if (!_.get(sorting, ['carspec.year']) && !_.get(sorting, ['mileageFilter']) && !_.get(sorting, ['searchPrice'])) {
        sorting = {};
    }
    let finalData = {
        filterGroup: {
            ...mergeObj
        },
        config: {
            page: page,
            sorting: sorting
        },
    };

    if(finalData.filterGroup.priceRange){
        finalData.filterGroup.priceRange = convertRangeFormatBack(finalData.filterGroup.priceRange);
    }
    if(finalData.filterGroup.yearRange){
        finalData.filterGroup.yearRange = convertRangeFormatBack(finalData.filterGroup.yearRange);
    }
    if(finalData.filterGroup.mileageRange){
        finalData.filterGroup.mileageRange = convertRangeFormatBack(finalData.filterGroup.mileageRange);
    }
    if(finalData.filterGroup.engineCapactityRange){
        finalData.filterGroup.engineCapactityRange = convertRangeFormatBack(finalData.filterGroup.engineCapactityRange);
    }

    if (parameter1 && !parameter2 && !parameter3) {
        let stateArr = parameter1.split('_');
        finalData.filterGroup.state = _.isArray(stateArr) && !_.isEmpty(stateArr) ? _.get(stateArr, [1]) || '' : '';
        finalData.filterGroup.area = _.isArray(stateArr) && !_.isEmpty(stateArr) ? _.get(stateArr, [2]) || '' : '';
    } else if (parameter1 && parameter2 && !parameter3) {
        finalData.filterGroup.make = _.toLower(parameter1);

        let stateArr = parameter2.split('_');
        finalData.filterGroup.state = _.isArray(stateArr) && !_.isEmpty(stateArr) ? _.get(stateArr, [1]) || '' : '';
        finalData.filterGroup.area = _.isArray(stateArr) && !_.isEmpty(stateArr) ? _.get(stateArr, [2]) || '' : '';

    } else if (parameter1 && parameter2 && parameter3) {
        finalData.filterGroup.make = _.toLower(parameter1);
        finalData.filterGroup.model = _.toLower(parameter2);

        let stateArr = parameter3.split('_');
        finalData.filterGroup.state = _.isArray(stateArr) && !_.isEmpty(stateArr) ? _.get(stateArr, [1]) || '' : '';
        finalData.filterGroup.area = _.isArray(stateArr) && !_.isEmpty(stateArr) ? _.get(stateArr, [2]) || '' : '';

    } else {

    }

    return finalData;


}


export function convertParameterToProductListUrl(data, config) {

    let mergeObj = objectRemoveEmptyValue(data);
    let basePath = '';

    if (!notEmptyLength(config)) {
        config = {
            page: 1,
            sorting: {},
        }
    }

    if (!isValidNumber(parseInt(config.page))) {
        config.page = 1;
    }

    if (!_.isPlainObject(objectRemoveEmptyValue(config.sorting)) && _.isEmpty(objectRemoveEmptyValue(config.sorting)) && (!_.get(config, ['sorting', 'carspec.year']) && !_.get(config, ['sorting', 'mileageFilter']) && !_.get(config, ['sorting', 'searchPrice']))) {
        config.sorting = {};
    } else {
        config.sorting = _.pick(objectRemoveEmptyValue(config.sorting), ['carspec.year', 'searchPrice', 'mileageFilter']);
    }


    if (notEmptyLength(mergeObj)) {
        mergeObj = _.pick(mergeObj, availableFilters);
        let condition = mergeObj.condition;
        let make = mergeObj.make;
        let model = mergeObj.model;
        let state = mergeObj.state;
        let area = mergeObj.area;



        if (condition && condition != 'cars-on-sale' && condition != 'all') {
            condition = [_.toLower(condition), 'cars-on-sale'].join('-');
        } else {
            condition = 'cars-on-sale';
        }

        if (state && state != 'malaysia') {
            if (area && state != 'malaysia') {
                state = ['malaysia', _.toLower(mergeObj.state), _.toLower(mergeObj.area)].join('_');
            } else {
                state = ['malaysia', _.toLower(mergeObj.state)].join('_');
            }
        } else {
            state = 'malaysia';
        }



        //Main parameter
        //Order is important
        //The first 1 always is condition
        //The last 1 always is state
        let mainParameters = [make, model];
        let path = `${basePath}/${condition}`;

        _.forEach(mainParameters, function (parameter) {
            if (!parameter) {
                return false;
            } else {
                path += `/${_.toLower(parameter)}`
            }
        })

        path += `/${state}`
        delete mergeObj.condition;
        delete mergeObj.make;
        delete mergeObj.model;
        delete mergeObj.state;
        return `${path}?page=${config.page}${_.isPlainObject(config.sorting) && !_.isEmpty(config.sorting) ? `&${queryStringifyNestedObject(config.sorting, 'sorting')}` : ''}${notEmptyLength(mergeObj) ? `&${queryStringifyNestedObject(mergeObj)}` : ''}`;

    } else {
        return `/cars-on-sale/malaysia?page=${config.page}${_.isPlainObject(config.sorting) && !_.isEmpty(config.sorting) ? `&${queryStringifyNestedObject(config.sorting, 'sorting')}` : ''}`;
    }
}

export function getTopItems(data, rank, col) {
    if (_.isArray(data) && notEmptyLength(data)) {
        if (!isValidNumber(rank)) {
            rank = 3;
        } else {
            rank = parseInt(rank);
        }

        let pickedData = sortByDesc(data, col);
        pickedData = _.slice(pickedData, 0, rank);
        return pickedData;
    } else {
        return data;
    }
}


export function toCamelCase(value, seperator) {
    if (!value || !value.toString()) {
        return value;
    } else {
        if (!seperator || !seperator.toString()) {
            seperator = ' ';
        } else {
            seperator = seperator.toString();
        }
        value = value.toString().split(seperator);
        value = _.map(value, function (item, index) {
            if (index > 0) {
                return _.capitalize(item);
            } else {
                return item;
            }
        });

        return value.join('');
    }
}

export function toSnakeCase(value, seperator) {
    if (!value || !value.toString()) {
        return value;
    } else {
        if (!seperator || !seperator.toString()) {
            seperator = '_';
        } else {
            seperator = seperator.toString();
        }
        value = value.toString().split('')
        let finalData = []
        _.forEach(value, function (item, index) {
            if (index == 0) {
                finalData.push(_.lowerCase(item));
            } else {

                if (item == _.upperCase(item)) {
                    finalData.push(seperator);
                }

                finalData.push(_.lowerCase(item));
            }
        });
        return finalData.join('');
    }
}

export const viewPort = {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
}

export function getUserName(user, type) {
    if (_.isPlainObject(user) && !_.isEmpty(user)) {
        let username = _.trim(_.get(user, ['username']) || '');
        let fullName = _.trim(_.get(user, ['fullName']) || `${_.get(user, ['firstName']) || ''} ${_.get(user, ['lastName']) || ''}` || '');
        let firstName = _.trim(_.get(user, ['firstName']) || '');
        let lastName = _.trim(_.get(user, ['lastName']) || '');
        let namePrefix = _.trim(_.get(user, ['namePrefix']) || '');
        let freakId = _.trim(_.get(user, ['freakId']) || '');

        switch (type) {
            case 'username':
                return username;
            case 'fullName':
                return fullName;
            case 'prefixName':
                return _.trim(`${namePrefix ? `${namePrefix}` : ''} ${fullName || ''}`);
            case 'firstName':
                return firstName;
            case 'lastName':
                return lastName;
            case 'freakId':
                return freakId;
            default:
                return fullName;
        }
    } else {
        return 'Ccar User'
    }
}


export function getPlural(singular, plural, count, showCount) {
    if (singular && isValidNumber(parseInt(count))) {
        return parseInt(count) > 1 ?
            showCount ?
                `${count} ${plural || singular + 's'}`
                :
                `${plural || singular + 's'}`
            :
            showCount ?
                `${formatNumber(count, 'auto', true, 0, true)} ${singular}`
                :
                `${singular}`

    } else {
        return '';
    }
}

export function findIndexesOfString(text, search) {
    if (text && search) {
        let indexes = [];
        let currentPosition = 0;
        while (currentPosition < text.length) {
            currentPosition = text.indexOf(search, currentPosition);
            if (currentPosition == -1) {
                currentPosition = text.length;
            } else {
                indexes.push(currentPosition);
                currentPosition = currentPosition + search.length;
            }
        }

        return indexes;
    } else {
        return [];
    }
}


export function checkObjectId(data, idForCheck, col) {
    if (_.isPlainObject(data) && !_.isEmpty(data)) {
        return data[`${col || '_id'}`] == idForCheck;
    } else {
        return data == idForCheck;
    }
}

export function getObjectId(data, col) {
    if (_.isPlainObject(data) && !_.isEmpty(data)) {
        return data[`${col || '_id'}`];
    } else {
        return data;
    }
}


export function getCookiePersistStates(cookieData) {

    cookieData = cookie.parse(cookieData) || {};
    let cookiePersistStates = [];

    _.forEach(statePersistActions, function (statePersistAction) {
        if (cookieData[statePersistAction['action']]) {
            cookieData[statePersistAction['action']] = JSON.parse(cookieData[statePersistAction['action']]);
            try {
                cookiePersistStates.push({
                    persistObj: statePersistAction,
                    data: _.get(cookieData[statePersistAction['action']], ['data']),
                    reducer: _.get(cookieData[statePersistAction['action']], ['reducer']),
                    createdAt: new Date(_.get(cookieData[statePersistAction['action']], ['createdAt'])).getTime(),
                })
            } catch (error) {

            }
        }
    })

    cookiePersistStates = _.sortBy(cookiePersistStates, ['reducer', 'createdAt']);
    return cookiePersistStates || [];

}


