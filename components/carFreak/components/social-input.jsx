import { Empty, Form, Icon, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import client from '../../../feathers';
import { loading } from '../../../redux/actions/app-actions';
import ClickOutsideDetectWrapper from '../../general/ClickOutsideDetectWrapper';
import EmojiPickerButton from '../../general/EmojiPickerButton';
import ScrollLoadWrapper from '../../general/ScrollLoadWrapper';
import { getAliasCodeFromText, hashTagPrefix, hashTagPrefixHashValue, hashTagSuffixHashValue, parseTagStringToPlainString, parseToTagString, seperatorHashValue, tagPrefix, tagPrefixHashValue, tagSuffixHashValue } from '../config';
import { arrayLengthCount, getUserName, isValidNumber } from '../../../common-function';
import UserAvatar from '../../general/UserAvatar';



let uid = v4();
let ref = {}
ref[uid] = React.createRef();
let typingTimeout;
let checkSearchTimeout;
let checkHashTagTimeout;
const PAGE_SIZE = 20;
let ReactQuill;
const SocialInput = (props) => {

    const [text, setText] = useState('');
    const [suggestList, setSuggestList] = useState({});
    const [suggestListTotal, setSuggestListTotal] = useState(0);
    const [suggestListPage, setSuggestListPage] = useState(1);
    const [prefix, setPrefix] = useState(tagPrefix);
    const [isLoading, setIsLoading] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [searchWord, setSearchWord] = useState('');
    const [activeTriggerPosition, setActiveTriggerPosition] = useState(0);
    const [hashTagActiveTriggerPosition, setHashTagActiveTriggerPosition] = useState(null);
    const [hashTagActived, setHashTagActived] = useState(false);
    const [hashTagValue, setHashTagValue] = useState('');
    const [aliasCode, setAliasCode] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [startWatching, setStartWatching] = useState(false);

    useEffect(() => {
        if (document) {
            ReactQuill = require('react-quill');
        }
    }, [])

    useEffect(() => {
        if (!hashTagActived && hashTagValue && hashTagActiveTriggerPosition != null) {
            handleAddAliasCode(`#${hashTagValue}`, '$_id', '#', hashTagActiveTriggerPosition);
            setHashTagValue('');
            setHashTagActiveTriggerPosition(null);
            setSearchMode(false);
        }
    }, [hashTagActived, hashTagValue])


    useEffect(() => {
        if (props.resetIndicator) {
            reset();
        }
    }, [props.resetIndicator])

    useEffect(() => {
        setEditMode(props.editMode ? true : false);
    }, [props.editMode])

    useEffect(() => {
        if (editMode && props.text && ReactQuill) {
            let newText = parseTagStringToPlainString(props.text);
            let quill = props.inputRef || ref[uid];
            if (quill.current) {
                let editor = quill.current.getEditor();
                if (editor && quill) {
                    editor.setText(newText, 'silent');
                }
                let newAliasCode = getAliasCodeFromText(props.text);
                setText(newText);
                setAliasCode(newAliasCode);
            }
        }
    }, [editMode, props.text, ReactQuill])


    useEffect(() => {

        if (searchMode) {
            searchData(0, searchWord, prefix);
        } else {
            setSearchWord('');
            setSuggestList([]);
            setSuggestListPage(1);
            setSuggestListTotal(0);
            setActiveTriggerPosition(null);
        }

    }, [searchMode])

    useEffect(() => {

        if (searchMode && prefix) {
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                searchData((suggestListPage - 1) * PAGE_SIZE, searchWord, prefix);
            }, 300);
        }

    }, [searchWord, prefix, suggestListPage])

    useEffect(() => {
        updateAliasText();
    }, [aliasCode])

    useEffect(() => {
        if (props.onChange && startWatching) {
            props.onChange(text, parseToTagString(text, aliasCode));
        }

        setStartWatching(true);
    }, [text, aliasCode])


    function reset() {

        if (ReactQuill) {
            let quill = props.inputRef || ref[uid];
            if (quill.current) {
                let editor = quill.current.getEditor();
                if (editor && quill) {
                    editor.setText("");
                }
                setText('');
                setAliasCode([]);
                setSuggestList([]);
            }
        }
    }

    function focus() {
        if (ReactQuill) {
            let quill = props.inputRef || ref[uid];
            if (quill.current) {
                let editor = quill.current.getEditor();
                quill.current.focus();
                let currentCursor = editor.getSelection().index || 0;
                if (editor && quill) {
                    setTimeout(() => {
                        editor.setSelection(currentCursor);
                    }, 10);
                }
            }

            return;
        }
    }

    function handleSubmit() {
        let finalText = text;
        if (props.excludeEnter) {
            finalText = finalText.replace(/\n/g, "");
        }
        if (props.onSubmit && finalText) {
            finalText = parseToTagString(finalText, aliasCode)
            props.onSubmit(finalText);
            reset();
            focus();
        }
    }

    function searchData(skip, keyword, prefix) {
        setSuggestList({});
        if (prefix == tagPrefix) {
            setIsLoading(true);
            axios.get(`${client.io.io.uri}getRelatedUser`, {
                params: {
                    match: {
                        userId: _.get(props.user, ['info', 'user', '_id']),
                        clubId : props.clubId || '',
                        keyword: keyword || '',
                    },
                    limit: PAGE_SIZE,
                    skip: skip || 0,
                }
            }).then(res => {
                console.log('res');
                console.log(res);
                setIsLoading(false);
                let temp = _.cloneDeep(suggestList);
                temp[prefix] = suggestListPage > 1 ?
                    _.isArray(_.get(res, ['data', 'data'])) && !_.isEmpty(_.get(res, ['data', 'data'])) ?
                        (suggestList[prefix] || []).concat(res.data.data)
                        : suggestList[prefix] || []
                    :
                    _.get(res, ['data', 'data']) || []

                setSuggestList(temp);
            }).catch(err => {
                setIsLoading(false);
                console.log(err);
            });
        }

        if (prefix == hashTagPrefix) {
            setIsLoading(true);
            axios.get(`${client.io.io.uri}getHashTags`, {
                params: {
                    match: {
                        keyword: keyword || '',
                    },
                    limit: PAGE_SIZE,
                    skip: skip || 0,
                }
            }).then(res => {
                setIsLoading(false);
                let temp = _.cloneDeep(suggestList);
                temp[prefix] = suggestListPage > 1 ?
                    _.isArray(_.get(res, ['data', 'data'])) && !_.isEmpty(_.get(res, ['data', 'data'])) ?
                        (suggestList[prefix] || []).concat(res.data.data)
                        : suggestList[prefix] || []
                    :
                    _.get(res, ['data', 'data']) || []

                setSuggestList(temp);

            }).catch(err => {
                console.log(err);
            });
        }
    }

    function handleChange(content, delta, source, editor) {

        let newText = editor.getText();
        let action = _.get(delta, ['ops', arrayLengthCount(_.get(delta, ['ops'])) == 2 ? 1 : 0]);
        let position = arrayLengthCount(_.get(delta, ['ops'])) == 2 ? _.get(delta, ['ops', 0, 'retain']) || 0 : 0;
        if (isValidNumber(parseInt(props.maxLength))) {
            if (newText.length > parseInt(props.maxLength) && ReactQuill) {
                let quill = props.inputRef || ref[uid];
                if (quill.current) {
                    let editor = quill.current.getEditor();
                    if (editor && quill) {
                        quill.current.focus();
                        let currentCursor = editor.getSelection().index || 0;
                        editor.setText(text, 'silent');
                        editor.setSelection(currentCursor);
                    }
                }

                return;
            }
        }

        // if (props.excludeEnter && _.get(action, ['insert']) == '\n') {
        //     newText = newText.replace(/\n/g, "");
        //     if (ReactQuill) {
        //         let quill = props.inputRef || ref[uid];
        //         if (quill.current) {
        //             let editor = quill.current.getEditor();
        //             if (editor && quill) {
        //                 quill.current.focus();
        //                 let currentCursor = editor.getSelection().index || 0;
        //                 editor.setText(newText, 'silent');
        //                 setTimeout(() => {
        //                     editor.setSelection(currentCursor);
        //                 }, 10);
        //             }
        //         }

        //         return;
        //     }
        // }

        setText(newText);

        if (_.isPlainObject(action) && !_.isEmpty(action)) {

            if (_.has(action, 'delete')) {
                handleDeleteAliasCode(position, 'delete');
            }

        }

    }

    function handleAddText(input, tagging) {
        if (ReactQuill) {
            let quill = props.inputRef || ref[uid];
            if (quill.current) {
                let editor = quill.current.getEditor();
                if (editor && quill) {
                    quill.current.focus();
                    let currentCursor = editor.getSelection().index || 0;
                    editor.insertText(currentCursor, input);
                }
            }
        }
    }

    function handleAddTag(input, aliasPosition, searchWord) {
        if (ReactQuill) {
            let quill = props.inputRef || ref[uid];
            if (quill.current) {
                let editor = quill.current.getEditor();
                if (editor && quill) {
                    let preText = text.substr(0, aliasPosition);
                    let postText = text.substr(aliasPosition + 1 + searchWord.length);
                    let newText = preText + postText;
                    editor.setText(newText, 'user');

                    editor.insertText(aliasPosition, input, {
                        bold: true,
                        color: '#2196F3',
                    })
                    editor.insertText(aliasPosition + input.length, ' ', {
                        'bold': false,
                        color: '#616161'
                    })
                    editor.setSelection(aliasPosition + input.length + 1)
                }
            }
        }

    }

    function handleAddAliasCode(value, id, prefix, aliasPosition) {
        if (text[aliasPosition] == prefix) {
            let newAliasCode = _.cloneDeep(aliasCode) || [];
            let codePrefix = prefix == '@' ? tagPrefixHashValue : hashTagPrefixHashValue;
            let codeSuffix = prefix == '@' ? tagSuffixHashValue : hashTagSuffixHashValue;
            newAliasCode = _.unionBy(_.sortBy(_.reverse(_.sortBy(_.concat(newAliasCode, [{
                value: `${codePrefix}${value || ''}${seperatorHashValue}${id || ''}${codeSuffix}`,
                position: aliasPosition,
                endPosition: aliasPosition + value.length - 1,
                prefix: prefix,
                name: value,
                id: id,
                createdAt: new Date().getTime(),
            }]), ['createdAt'])), ['position']), [], 'position');

            setAliasCode(newAliasCode);
        }

        setSearchMode(false);
    }

    function handleDeleteAliasCode(position, action) {

        if (ReactQuill) {
            let newAliasCode = _.unionBy(_.sortBy(_.reverse(_.sortBy(_.cloneDeep(aliasCode) || [], ['createdAt'])), ['position']), [], 'position');
            //need update back position after delete things

            console.log(newAliasCode);
            console.log('position');
            console.log(position);
            let quill = props.inputRef || ref[uid];
            if (quill.current) {
                let editor = quill.current.getEditor();
                let currentText = '';
                if (editor && quill) {
                    currentText = editor.getText();
                }

                newAliasCode = _.map(newAliasCode, function (code) {
                    if (code.position > position) {
                        code.position -= 1;
                    }
                    return code;
                })

                let codeStr = parseToTagString(currentText, newAliasCode);
                newAliasCode = getAliasCodeFromText(codeStr);

                if (!_.isEqual(newAliasCode, aliasCode)) {
                    setAliasCode(newAliasCode);
                }

            }
        }

    }


    function updateAliasText() {

        if (ReactQuill) {
            let quill = props.inputRef || ref[uid];
            if (quill.current) {
                quill = quill.current.getEditor();
                quill.formatText(0, text.length, {
                    'bold': false,
                    color: '#616161'
                }, 'silent')
                //Update format
                //If dont want the sudden color flash need to loop through each word
                _.forEach(aliasCode, function (code) {
                    let name = code.name;
                    let position = code.position;

                    if (name && isValidNumber(position)) {
                        name = name.split('');
                        _.forEach(name, function (char) {
                            if (char == text[position]) {
                                quill.formatText(position, 1, {
                                    bold: true,
                                    color: code.prefix == hashTagPrefix ? 'black' : '#2196F3',
                                    // color: '#2196F3',
                                })
                            } else {
                                return false;
                            }
                            position++;
                        })
                    }

                })
            }
        }

    }

    function checkCanSearch(range, editor) {

        let currentPosition = _.get(range, ['index']);
        let text = editor.getText();
        let newSearchWord = '';

        if (!currentPosition || (text[currentPosition - 1] == ' ' && hashTagActived)) {
            setHashTagActived(false);
            setTimeout(() => {
                setSearchMode(false);
            }, 300);
        }

        if (currentPosition > 0) {
            let canSearch = false;
            let gotSpace = false;
            _.forEach(_.reverse(_.range(0, currentPosition)), function (i) {
                if ((text[i] == ' ')) {
                    gotSpace = true;
                }

                if ((text[i] == ' ' && !searchMode)) {
                    return false;
                }

                if (text[i] == tagPrefix) {
                    if (text[i - 1] == undefined || text[i - 1] == ' ' || text[i - 1] == '') {
                        canSearch = true;
                        setPrefix(text[i]);
                        setActiveTriggerPosition(i);
                        // setSearchWord(_.reverse(newSearchWord.split('')).join(''));
                        setSearchWord(_.reverse(newSearchWord.split('')).join(''));
                        setSearchMode(true);
                        return false;
                    }
                } else if (text[i] == hashTagPrefix && !gotSpace) {
                    canSearch = true;
                    if (text[i - 1] == undefined || text[i - 1] == ' ' || text[i - 1] == '') {
                        setPrefix(text[i]);
                        setHashTagActiveTriggerPosition(i);
                        setSearchWord(_.reverse(newSearchWord.split('')).join(''));
                        setSearchMode(true);
                        setHashTagActived(true);
                        setHashTagValue(_.reverse(newSearchWord.split('')).join(''));
                        return false;
                    }
                }
                newSearchWord += `${text[i] || ''}`
            })

            if (!canSearch) {
                setSearchMode(false);
            }
        }
    }

    if (ReactQuill) {
        return (
            <React.Fragment>
                <ClickOutsideDetectWrapper
                    onClickedOutside={() => {
                        if (props.clickOutsideSubmit) {
                            handleSubmit();
                        }
                    }}
                    className={`no-border-input thin-border round-border-big background-white padding-sm flex-justify-start relative-wrapper flex-items-align-center ${props.className || ''}`}
                    style={{ ...props.style }}
                    id={uid}
                >
                    <ReactQuill
                        theme={null}
                        placeholder={props.placeholder || "What's on your mind?"}
                        className="width-90 grey-darken-3"
                        style={{ height: props.height || 30 }}
                        ref={props.inputRef || ref[uid]}
                        onChange={(content, delta, source, editor) => { handleChange(content, delta, source, editor) }}
                        onChangeSelection={(range, source, editor) => {
                            checkCanSearch(range, editor);
                            // checkHashTag(range, editor);
                        }}
                        onKeyUp={(e) => {

                            //Enter Hit
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit();
                            }

                        }}
                    >
                    </ReactQuill>
                    <EmojiPickerButton
                        onSelect={(emoji) => {
                            handleAddText(emoji.native)
                        }}
                        position={props.emojiPosition}
                    >
                        <Icon type="smile" className='cursor-pointer grey margin-right-sm margin-top-xs flex-items-no-shrink' style={{ fontSize: '17px' }} />
                    </EmojiPickerButton>
                    {
                        // searchMode && _.isArray(_.get(suggestList, [prefix])) && !_.isEmpty(_.get(suggestList, [prefix])) ?
                        searchMode ?
                            <div className="round-border thin-border background-white " style={props.placement == 'bottom' ? { position: 'absolute', bottom: -210, right: 0, left: 0, zIndex: 99999, margin: 'auto' } : { position: 'absolute', top: -210, right: 0, left: 0, zIndex: 99999, margin: 'auto' }}>
                                <ScrollLoadWrapper autoHeight autoHeightMax={200} autoHeightMin={200} style={{ width: '100%' }} >
                                    {
                                        _.isArray(_.get(suggestList, [prefix])) && !_.isEmpty(_.get(suggestList, [prefix])) ?
                                            (suggestList[prefix] || []).map(value => (
                                                <div className="padding-sm flex-justify-start flex-items-align-center cursor-pointer hover-background-yellow-accent-1"
                                                    onClick={(e) => {
                                                        if (prefix == tagPrefix) {
                                                            setSearchMode(false);
                                                            handleAddTag(getUserName(value, 'freakId') || '', activeTriggerPosition, searchWord);
                                                            handleAddAliasCode(getUserName(value, 'freakId'), value._id, prefix, activeTriggerPosition)
                                                        } else if (prefix == hashTagPrefix) {
                                                            setHashTagValue('');
                                                            setHashTagActived(false);
                                                            setHashTagActiveTriggerPosition(null);
                                                            handleAddTag(_.get(value, ['tag']) || '', hashTagActiveTriggerPosition, `#${hashTagValue}`);
                                                            handleAddAliasCode(_.get(value, ['tag']), '$_id', prefix, hashTagActiveTriggerPosition)
                                                        }
                                                    }}>
                                                    {
                                                        prefix == tagPrefix ?
                                                            <React.Fragment>
                                                                <UserAvatar data={value} size={50} className="margin-right-md" />
                                                                <span className='d-inline-block' >
                                                                    <div className="headline font-weight-black text-truncate">
                                                                        {getUserName(value, 'freakId') || ''}
                                                                    </div>
                                                                    <div className="headline text-truncate">
                                                                        {getUserName(value, 'fullName') || ''}
                                                                    </div>
                                                                </span>
                                                            </React.Fragment>
                                                            :
                                                            prefix == hashTagPrefix ?
                                                                <div className='headline font-weight-black text-truncate' >
                                                                    {
                                                                        _.get(value, ['tag'])
                                                                    }
                                                                </div>
                                                                :
                                                                null
                                                    }
                                                </div>
                                            ))
                                            :
                                            <div className="flex-justify-center flex-items-align-center padding-md">
                                                <Empty description={isLoading ? 'Getting data...' : 'No Result'}></Empty>
                                            </div>
                                    }
                                </ScrollLoadWrapper>
                            </div>
                            :
                            null
                    }
                </ClickOutsideDetectWrapper>
            </React.Fragment>
        );
    } else {
        return null;
    }
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialInput)));