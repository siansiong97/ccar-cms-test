

import _ from 'lodash';
import { notEmptyLength } from '../../../common-function';


export function languageCount(data) {
    let langs = [];
    if (notEmptyLength(data) && _.isPlainObject(data)) {
        return notEmptyLength(data.language) ? data.language.length : 0;
    } else {
        if (_.isArray(data) && notEmptyLength(data)) {
            _.forEach(data, function (item) {
                langs = _.union(langs, item.language);
            })
            return langs.length;
        } else {
            return 0;
        }
    }
}

export function languageExisted(lang, data) {
    if (lang != null) {
        if (notEmptyLength(data) && _.isPlainObject(data)) {
            return _.includes(data.language, lang)
        } else {
            let langs = [];
            if (notEmptyLength(data) && _.isArray(data)) {
                _.forEach(data, function (item) {
                    langs = _.union(langs, item.language);
                })
                return _.includes(langs, lang)
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}

export function getLanguages(data) {
    let langs = [];
    if (notEmptyLength(data) && _.isPlainObject(data)) {
        return notEmptyLength(data.language) ? data.language : 0;
    } else {
        if (_.isArray(data) && notEmptyLength(data)) {
            _.forEach(data, function (item) {
                langs = _.union(langs, item.language);
            })
            return langs;
        } else {
            return [];
        }
    }
}

