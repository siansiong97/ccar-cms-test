import { Avatar, Form, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import connect from "react-redux/lib/connect/connect";
import { withRouter } from 'next/dist/client/router';
import { loading } from '../../../actions/app-actions';
import { darkThemeColorList } from '../../../params/darkThemeColorList';
import { isValidNumber } from '../../profile/common-function';
import { parseTagStringToArray } from '../config';
import Link from 'next/link';


const TagInputParse = (props) => {

    const [content, setContent] = useState('');
    const [users, setUsers] = useState([]);


    useEffect(() => {
        if (_.isString(props.text)) {
            parseToTagContent(props.text)
        } else {
            setContent(props.text)
        }

    }, [props.text])

    async function parseToTagContent(text) {
        let textArr = parseTagStringToArray(text);
        let userIds = [];
        if (_.isArray(textArr) && !_.isEmpty(textArr)) {
            _.forEach(textArr, function (v) {
                if (v.type == 'tag') {
                    userIds.push(v.id)
                }
            })

            if (_.isArray(userIds) && !_.isEmpty(userIds)) {
                let userRes = await client.service('users').find({
                    query: {
                        _id: {
                            $in: userIds || [],
                        }
                    }
                })

                let users = _.get(userRes, 'data') || [];
                console.log(users);
                textArr = _.map(textArr, function (v) {
                    if (v.type == 'tag') {
                        let user = _.find(users, function (user) {
                            return user._id == v.id;
                        })
                        if (_.get(user, ['userurlId'])) {
                            return <Link shallow={false} href={`/profile/${user.userurlId}`}>
                                <a>
                                    <span className="font-weight-bold blue cursor-pointer">
                                        {v.value}
                                    </span>
                                </a>
                            </Link>
                        } else {
                            return null;
                        }
                    }

                    return v.value;
                })
            }

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