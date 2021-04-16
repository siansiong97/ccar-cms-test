import { Form } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { defaultReactions } from './config';
import ReactionButton from './reaction-button';
import { withRouter } from 'next/router';
import { isValidNumber, notEmptyLength, objectRemoveEmptyValue } from '../../common-function';


const ReactionButtonList = (props) => {

    const [reactions, setReactions] = useState([])

    useEffect(() => {
        if (notEmptyLength(props.reactions)) {
            setReactions(props.reactions)
        } else {
            let temp = [];
            _.forEach(defaultReactions, function (reaction) {
                temp.push({
                    type: reaction,
                })
            })
            setReactions(temp);
        }
    }, [props.reactions])

    function handleOnClick(data) {
        if (props.onClick) {
            props.onClick(data);
        }
    }

    return (
        <div className={`${props.className ? props.className : ''}`} style={{ ...props.style }}>
            {
                _.compact(_.map(reactions, function (reaction) {
                    if (_.indexOf(defaultReactions, reaction.type) != -1) {
                        return (
                            <React.Fragment>
                                <ReactionButton
                                    className={props.reactionClassName ? props.reactionClassName : ''}
                                    style={notEmptyLength(objectRemoveEmptyValue(props.reactionStyle)) ? props.reactionStyle : {}}
                                    size={isValidNumber(props.size ? props.size : 25)}
                                    type={reaction.type}
                                    onClick={(data) => { handleOnClick(data) }}
                                    pushReactions={notEmptyLength(props.pushReactions) ? _.filter(props.pushReactions, ['type', reaction.type]) : []}
                                    onClickTimeOut={isValidNumber(props.onClickTimeOut) ? parseInt(props.onClickTimeOut) : 0}
                                    onClickAnimation={props.onClickAnimation == true ? true : false}
                                     />
                            </React.Fragment>
                        )
                    } else {
                        return null;
                    }
                }))
            }
        </div>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ReactionButtonList)));