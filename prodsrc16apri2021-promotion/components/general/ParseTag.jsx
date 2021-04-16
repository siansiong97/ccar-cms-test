import { Form } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ShowMoreText from 'react-show-more-text';
import { parseTagStringToArray } from '../carFreak/config';
import { withRouter } from 'next/router';
import client from '../../feathers';


let timeoutFunc;

const ParseTag = (props) => {

    const [text, setText] = useState('');

    useEffect(() => {

        if (_.isString(props.data)) {
            parseText(props.data)
        } else {
            setText(props.data)
        }

    }, [props.data])


    async function parseText(data) {
        let userIds = [];
        let users = [];
        if (_.isString(data)) {

            let textArr = parseTagStringToArray(data || '') || [];
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

                users = _.get(userRes, 'data') || [];
            }


            setText(_.map(textArr, function (v, i) {

                if (v.type == 'tag') {
                    let user = _.find(users, function (user) {
                        return user._id == v.id;
                    })
                    if (_.get(user, ['userurlId'])) {
                        return <a key={'ccartag' + i} className={`${props.tagClassName || 'font-weight-bold blue'} cursor-pointer`} href={`/profile/${user.userurlId}`} target="_blank">
                            {v.value}
                        </a>
                    }
                }
                if (v.type == 'hashTag') {
                    return <a key={'ccarhashtag' + i} className={`${props.tagClassName || 'font-weight-bold black'} cursor-pointer`} href={v.id ? `/hashtag/${(v.value || '').replace('#', '')}` : '#'} target="_blank">
                        {v.value}
                    </a>
                }
                return v.value;
            }))
        } else {
            setText(data)
        }
    }


    return (
        <span className={`text-overflow-break d-inline-block ${props.className || ''}`} style={{ maxWidth: '100%', ...props.style }}>
            {
                props.expandable ?
                    <ShowMoreText
                        lines={props.lines || 1}
                        more={props.more || <a className="small-text">Show More</a>}
                        less={props.less || <a className="small-text">Show Less</a>}
                        expanded={false}
                    >
                        {
                            text || ''
                        }
                    </ShowMoreText>
                    :
                    text || ''
            }
        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ParseTag)));