
import _ from 'lodash';
import { v4 } from 'uuid';

export const chatRestrictTime = 2000;
export const carFreakGlobalSearch = ['carFreak', 'socialBoard', 'club', 'dealer', 'people'];
export const tagPrefix = '@';
export const hashTagPrefix = '#';
export const tagPrefixHashValue = '@~#}:start';
export const hashTagPrefixHashValue = '#^:!%start';
export const tagSuffixHashValue = '@^@}}end';
export const hashTagSuffixHashValue = '#>^}~end';
export const seperatorHashValue = ']<%seperator>!;_';
export const clubProfileViewTypes = ['admin', 'member', 'pending', 'non-member'];


export function parseTagStringToArray(text) {
    if (text) {
        let finalText = [];
        let tagText = text.split(tagSuffixHashValue);
        tagText = _.forEach(tagText, function (char) {

            if (char.includes(tagPrefixHashValue)) {
                char = char.split(tagPrefixHashValue);
                //split prefix , the previous 1 sure is other text
                if (char[0] != null && char[0] != undefined) {

                    //Check if other text got hashtag
                    if (char[0].includes(hashTagPrefixHashValue)) {
                        let hashTagArr = parseHashTagStringToArray(char[0]);
                        finalText = finalText.concat(hashTagArr);
                    } else {
                        finalText.push(
                            {
                                type: 'normal',
                                value: char[0],
                                id: null,
                            }
                        );
                    }
                }

                //split prefix , the after 1 sure is tag text
                if (char[1] != null && char[1] != undefined) {
                    char[1] = char[1].split(seperatorHashValue);
                    finalText.push(
                        {
                            type: 'tag',
                            value: char[1][0],
                            id: char[1][1],
                        }
                    );
                }
            } else {
                let hashTagArr = parseHashTagStringToArray(char);
                finalText = finalText.concat(hashTagArr);
            }

        })

        return finalText;
    } else {
        return text;
    }
}

function parseHashTagStringToArray(text) {
    if (text) {
        let finalText = [];
        let tagText = text.split(hashTagSuffixHashValue);
        tagText = _.forEach(tagText, function (char) {

            if (char.includes(hashTagPrefixHashValue)) {
                char = char.split(hashTagPrefixHashValue);
                //split prefix , the previous 1 sure is other text
                if (char[0] != null && char[0] != undefined) {
                    finalText.push(
                        {
                            type: 'normal',
                            value: char[0],
                            id: null,
                        }
                    );
                }

                //split prefix , the after 1 sure is tag text
                if (char[1] != null && char[1] != undefined) {
                    char[1] = char[1].split(seperatorHashValue);
                    finalText.push(
                        {
                            type: 'hashTag',
                            value: char[1][0],
                            id: char[1][1],
                        }
                    );
                }
            } else {

                finalText.push(
                    {
                        type: 'normal',
                        value: char,
                        id: null,
                    }
                );
            }

        })

        return finalText;
    } else {
        return [];
    }
}

export function getTagString(text, id, prefix) {
    if (text && id) {
        let codePrefix = prefix == '#' ? hashTagPrefixHashValue : tagPrefixHashValue;
        let codeSuffix = prefix == '#' ? hashTagSuffixHashValue : tagSuffixHashValue;
        return `${codePrefix}${text || ''}${seperatorHashValue}${id || ''}${codeSuffix}`;
    } else {
        return text;
    }
}

export function parseToTagString(text, aliasCode) {

    if (text && _.isArray(aliasCode) && !_.isEmpty(aliasCode)) {
        let finalText = text;
        let sortedAliasCode = _.reverse(_.sortBy(aliasCode, ['position']))
        _.forEach(sortedAliasCode, function (code) {
            let name = code.name;
            let indexes = findIndexesOfString(finalText, name);

            if (_.includes(indexes, code.position)) {
                let preText = finalText.substr(0, code.position) || '';
                let postText = finalText.substr(code.position + name.length) || '';
                finalText = preText + code.value + postText;
            }

        })
        return finalText;
    } else {
        return text;
    }
}

export function getAliasCodeFromText(text) {

    if (text) {

        let aliasCode = [];
        let structedText = '';
        let textArr = parseTagStringToArray(text);
        textArr = _.map(textArr, function (item) {
            if (item.type != 'tag' && item.type != 'hashTag') {
                return item;
            } else {
                item.uid = `${v4()}`;
                return item;
            }
        });

        structedText = _.compact(_.map(textArr, function (item) {
            if (item.type != 'tag' && item.type != 'hashTag') {
                return item.value;
            } else {
                return `${item.uid}${item.value}`;
            }
        }));

        structedText = structedText.join('');


        _.forEach(textArr, function (item) {
            if (item.type == 'tag' || item.type == 'hashTag') {
                let position = structedText.indexOf(item.uid);
                structedText = structedText.replace(item.uid, '');
                aliasCode.push({
                    position: position,
                    value: `${item.type == 'tag' ? tagPrefixHashValue : hashTagPrefixHashValue}${item.value || ''}${seperatorHashValue}${item.id || ''}${item.type == 'tag' ? tagSuffixHashValue : hashTagSuffixHashValue}`,
                    prefix: item.type == 'tag' ? tagPrefix : hashTagPrefix,
                    endPosition : position + item.value.length - 1,
                    name: item.value,
                    id: item.id,
                    createdAt : new Date().getTime(),
                });
            }
        })

        return aliasCode;

    } else {
        return [];
    }
}

export function parseTagStringToPlainString(text) {

    if (text) {
        let textArr = parseTagStringToArray(text);
        textArr = _.map(textArr, function (item) {
            return item.value;
        })

        return textArr.join('');
    } else {
        return text;
    }
}


export function convertNameString(users, authUser) {
    if (_.isArray(users) && !_.isEmpty(users)) {

        let text = '';
        let count = 3;
        if (getObjectId(authUser)) {
            users = _.filter(users, function (user) {
                return checkObjectId(user, getObjectId(authUser));
            })
        }

        _.forEach(users, function (user, index) {
            if (index + 1 == users.length && users.length > 1) {
                text += ` and ${getUserName(user, 'fullName')}`
                return false;
            }

            if (index + 1 > count) {
                text += ` and ${users.length - count} others`
                return false;
            }

            if (index == 0) {
                text += `${getUserName(user, 'fullName')}`
            }

            if (index > 0) {
                text += `, ${getUserName(user, 'fullName')}`
            }
        })

        return text;
    } else {
        return 'Ccar User';
    }
}


export function getViewType(join) {

    if (_.isPlainObject(join) && !_.isEmpty(join)) {
        if (_.get(join, ['status']) == 'approved' && _.get(join, ['role']) == 'admin') {
            return clubProfileViewTypes[0];
        }

        if (_.get(join, ['status']) == 'approved' && _.get(join, ['role']) == 'member') {
            return clubProfileViewTypes[1];
        }

        if (_.get(join, ['status']) == 'pending' && _.get(join, ['role']) == 'member') {
            return clubProfileViewTypes[2];
        }

        return clubProfileViewTypes[3];
    } else {
        return clubProfileViewTypes[3];
    }
}


export function validateViewType(data) {

    if (!data) {
        return clubProfileViewTypes[3];
    } else {
        return _.find(clubProfileViewTypes, function (type) {
            return type == data;
        }) || clubProfileViewTypes[3];
    }
}