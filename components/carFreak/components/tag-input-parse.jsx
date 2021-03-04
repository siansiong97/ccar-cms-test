import { Avatar, Form, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import connect from "react-redux/lib/connect/connect";
import { withRouter } from 'next/dist/client/router';
import { loading } from '../../../actions/app-actions';
import { darkThemeColorList } from '../../../params/darkThemeColorList';
import { isValidNumber } from '../../profile/common-function';
import { parseTagStringToArray } from '../config';


const TagInputParse = (props) => {

    const [content, setContent] = useState('')


    useEffect(() => {
        if (_.isString(props.text)) {
            parseToTagContent(props.text)
        } else {
            setContent(props.text)
        }

    }, [props.text])

    function parseToTagContent(text) {
        let textArr = parseTagStringToArray(text);
        if (_.isArray(textArr) && !_.isEmpty(textArr)) {
            textArr = _.map(textArr, function (v) {
                if (v.type == 'tag') {
                    return <span className="font-weight-bold blue cursor-pointer" onClick={() => {
                        if (v.id) {
                            props.router.push(`/profile/${v.id}`)
                        }
                    }}>
                        {v.value}
                    </span>
                }

                return v.value;
            })
            setContent(textArr);
        } else {
            setContent(text);
        }
    }

    return <React.Fragment>
     {content} 
    </React.Fragment>;
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(TagInputParse)));