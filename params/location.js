
import _ from 'lodash';

var country_json_1 = require("./country.json");
var state_json_1 = require("./state.json");
var city_json_1 = require("./city.json");



export function getStatesOfCountry(countryId) {

    function compare(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    var states = state_json_1.filter(function (value, index) {
        return value.country_id === "132";
    });

    return states.sort(compare);

};


export function getCitiesOfState(stateId) {

    function compare(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    var cities = city_json_1.filter(function (value, index) {
        return value.state_id === stateId;
    });
    return cities.sort(compare);


};

export function getStateById(id) {

    var _findEntryById = function (source, id) {
        if (id && state_json_1 != null) {
            var idx = state_json_1.findIndex(function (c) { return c.id === id; });
            return (idx !== -1) ? state_json_1[idx] : "";
        }
        else
            return "";
    };



    return _findEntryById(state_json_1.default, id);

};

export function getOrigStateByName(name) {

    if (name) {
        let selectedState = _.find(state_json_1.default, function (state) {
            return _.toLower(state.name) == _.toLower(name);
        })

        return selectedState || null;
    } else {
        return null;
    }

};

export function getOrgiAreaByName(name) {

    if (name) {
        let selectedArea = _.find(city_json_1.default, function (city) {
            return _.toLower(city.name) == _.toLower(name);
        })

        return selectedArea || null;
    } else {
        return null;
    }

};

// exports.default = {
//     getCountryById: function (id) {
//         return _findEntryById(country_json_1.default, id);
//     },
//     getStateById: function (id) {
//         return _findEntryById(state_json_1.default, id);
//     },
//     getCityById: function (id) {
//         return _findEntryById(city_json_1.default, id);
//     },
//     getStatesOfCountry: function (countryId) {
//         var states = state_json_1.default.filter(function (value, index) {
//             return value.country_id === countryId;
//         });
//         return states.sort(compare);
//     },
//     getCitiesOfState: function (stateId) {
//         var cities = city_json_1.default.filter(function (value, index) {
//             return value.state_id === stateId;
//         });
//         return cities.sort(compare);
//     },
//     getAllCountries: function () {
//         return country_json_1.default;
//     },
//     getCountryByCode: function (code) {
//         return _findEntryByCode(country_json_1.default, code);
//     }
// };
// var _findEntryById = function (source, id) {
//     if (id && source != null) {
//         var idx = source.findIndex(function (c) { return c.id === id; });
//         return (idx !== -1) ? source[idx] : "";
//     }
//     else
//         return "";
// };
// var _findEntryByCode = function (source, code) {
//     if (code && source != null) {
//         var codex = source.findIndex(function (c) { return c.sortname === code; });
//         return (codex !== -1) ? source[codex] : "";
//     }
//     else
//         return "";
// };
// function compare(a, b) {
//     if (a.name < b.name)
//         return -1;
//     if (a.name > b.name)
//         return 1;
//     return 0;
// }
