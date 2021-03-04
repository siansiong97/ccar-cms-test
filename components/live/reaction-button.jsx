import { Form } from 'antd';
import _ from 'lodash';
import TweenOne from 'rc-tween-one';
import BezierPlugin from 'rc-tween-one/lib/plugin/BezierPlugin';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import { generateRandomTransition, reactionGif } from './config';
import { withRouter } from 'next/router';
import { isValidNumber, notEmptyLength } from '../../common-function';
TweenOne.plugins.push(BezierPlugin);
const eachTransitionLength = 4;
const maxTransitionX = 30;
const maxTransitionY = 400;
const flyUpDuration = 3000;

const ReactionButton = (props) => {


    const [transitions, setTransitions] = useState([])
    const [currentClickCount, setCurrentClickCount] = useState(0);
    const [timeoutFunction, setTimeoutFunction] = useState();



    useEffect(() => {
        if (notEmptyLength(props.pushReactions)) {

            let newTransitions = _.cloneDeep(transitions);
            _.forEach(props.pushReactions, function (pushReaction, index) {
                if (isValidNumber(pushReaction.total) && parseInt(pushReaction.total) > 0 && !_.some(transitions, ['key', pushReaction.key])) {
                    let data = generateRandomTransition(maxTransitionX, maxTransitionY, eachTransitionLength, parseInt(pushReaction.total))
                    let key = v4();
                    _.forEach(data, function (item) {
                        newTransitions = newTransitions.concat([{
                            bezier: {
                                type: 'soft',
                                vars: item,

                            },
                            duration: flyUpDuration,
                            scale: 0,
                            delay: _.random(flyUpDuration * index, flyUpDuration * (index + 1), false),
                            key: pushReaction.key ? pushReaction.key : key,
                        }])
                    })
                }
            })

            setTransitions(newTransitions);
        }
    }, [props.pushReactions])

    function pushUserTransitions() {


        let data = generateRandomTransition(maxTransitionX, maxTransitionY, eachTransitionLength, 1)[0]
        let newTransitions = _.cloneDeep(transitions);
        let key = v4();
        newTransitions = transitions.concat([{
            bezier: {
                type: 'soft',
                vars: data,
            },
            duration: flyUpDuration,
            key: key,
            scale: 0,
            // onComplete: (e) => removeTransition(key),
        }])
        setTransitions(newTransitions);

    }

    function handleOnClick() {
        let data = {
            total: currentClickCount + 1,
            userId: props.user.authenticated ? props.user.info.user._id : null,
            type: props.type,
            createdAt: new Date(),
        }

        setCurrentClickCount(currentClickCount + 1);

        if (timeoutFunction) {
            clearTimeout(timeoutFunction);
        }

        setTimeoutFunction(setTimeout(() => {
            if (props.onClick) {
                props.onClick(data);
            }
            setCurrentClickCount(0);
            setTimeoutFunction();
        }, isValidNumber(props.onClickTimeOut) ? parseInt(props.onClickTimeOut) : 0))

    }

    function removeTransition(key) {
        if (key) {
            let newTransition = _.filter(transitions, function (transition) {
                return transition.key != key;
            })
            setTransitions(newTransition);
        }
    }

    return props.type ?
        (
            <React.Fragment>
                <span
                    className={`${props.className ? props.className : ''} d-inline-block relative-wrapper cursor-pointer`}
                    style={{ ...props.style, width: isValidNumber(props.size) ? props.size : '25px', height: isValidNumber(props.size) ? props.size : '25px', overflow: 'visible' }}
                    onClick={(e) => {

                        if (props.onClickAnimation != null && props.onClickAnimation == true) {

                            pushUserTransitions();
                        }
                        handleOnClick();
                    }}>
                    <img src={props.src ? props.src : props.type ? reactionGif[`${props.type}Gif`] : null} className='absolute-center fill-parent' />
                    {/* Real time reaction */}
                    {
                        _.map(transitions, function (transition, index) {
                            return (
                                <TweenOne
                                    animation={transition}
                                >
                                    <img key={`${props.type}-${transition.key}`} src={reactionGif[`${props.type}Gif`]} className='absolute-center opacity-90' style={{ width: isValidNumber(props.size) ? props.size : '25px', height: isValidNumber(props.size) ? props.size : '25px' }} />
                                </TweenOne>
                            )
                        })
                    }
                    {/* User clicked reaction */}
                    {/* {
                    _.map(userReactionsTransition, function (transition, index) {
                        return (
                            <TweenOne
                                key={`${props.type}-clicked-${index}`}
                                animation={{
                                    bezier: {
                                        type: 'soft',
                                        vars: transition,
                                    },
                                    duration: duration,
                                    scale: 0,
                                }}
                            >
                                <img src={reactionGif[`${props.type}Gif`]} className='absolute-center opacity-90' style={{ width: isValidNumber(props.size) ? props.size : '25px', height: isValidNumber(props.size) ? props.size : '25px' }} />
                            </TweenOne>
                        )
                    })
                } */}
                </span>
            </React.Fragment>
        )
        :
        null
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ReactionButton)));