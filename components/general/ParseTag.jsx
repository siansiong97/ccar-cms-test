import { Form } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ShowMoreText from 'react-show-more-text';
import { parseTagStringToArray } from '../carFreak/config';
import { withRouter } from 'next/router';



const ParseTag = (props) => {

    const [text, setText] = useState('');

    useEffect(() => {

        if (_.isString(props.data)) {
            setText(parseText(props.data))
        } else {
            setText(props.data)
        }

    }, [props.data])


    function parseText(data) {
        if (_.isString(data)) {
            return _.map(parseTagStringToArray(data || '') || [], function (v,i) {
                if (v.type == 'tag') {
                    return <a key={'ccartag'+i} className={`${props.tagClassName || 'font-weight-bold blue'} cursor-pointer`} href={v.id ? `/profile/${v.id}` : '#'} target="_blank">
                        {v.value}
                    </a>
                }
                // if (v.type == 'hashTag') {
                //     return <a key={'ccarhashtag'+i} className={`${props.tagClassName || 'font-weight-bold black'} cursor-pointer`} href={v.id ? `/hashtag/${v.id}` : '#'} target="_blank">
                //         {v.value}
                //     </a>
                // }
                return v.value;
            })
        } else {
            return data
        }
    }


    return (
        <span className={`text-overflow-break d-inline-block ${props.className || ''}`} style={{ maxWidth : '100%', ...props.style }}>
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