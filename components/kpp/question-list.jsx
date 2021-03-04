import { Empty, Form } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Question from './question';
import { withRouter } from 'next/router';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';
import { notEmptyLength } from '../../common-function';


const QuestionList = (props) => {

    const [questionList, setQuestionList] = useState([]);
    const [showCorrectAfterAnswer, setShowCorrectAfterAnswer] = useState(false);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [answerAble, setAnswerAble] = useState(true);


    useEffect(() => {

        if (notEmptyLength(props.questions)) {
            setQuestionList(_.cloneDeep(props.questions))
        }
    }, [props.questions])

    useEffect(() => {

        if (props.showCorrectAfterAnswer != null) {
            if (props.showCorrectAfterAnswer) {
                setShowCorrectAfterAnswer(true);
                setQuestionList(props.questions.map(function (question) {
                    question.showAnswer = false;
                    return question;
                }))
            } else {
                setShowCorrectAfterAnswer(false)
            }
        } else {
            setShowCorrectAfterAnswer(false)

        }
    }, [props.showCorrectAfterAnswer])

    useEffect(() => {

        if (props.showCorrectAnswer != null) {
            if (props.showCorrectAnswer) {
                setShowCorrectAnswer(true)
            } else {
                setShowCorrectAnswer(false)
            }
        } else {
            setShowCorrectAnswer(false)
        }
    }, [props.showCorrectAnswer])

    useEffect(() => {

        if (props.answerAble != null) {
            if (props.answerAble) {
                setAnswerAble(true)
            } else {
                setAnswerAble(false)
            }
        } else {
            setAnswerAble(true)

        }
    }, [props.answerAble])


    useEffect(() => {

        if (props.showCorrectAfterAnswer != null) {
            if (props.showCorrectAfterAnswer) {
                setShowCorrectAfterAnswer(true)
            } else {
                setShowCorrectAfterAnswer(false)
            }
        } else {
            setShowCorrectAfterAnswer(false)

        }
    }, [props.showCorrectAfterAnswer])

    useEffect(() => {

        if (!_.isEqual(props.questions, questionList) && props.handleChange) {
            props.handleChange(questionList);
        }
    }, [questionList])

    function fillInQuestion(question, selection) {

        if (notEmptyLength(question) && notEmptyLength(selection)) {
            setQuestionList(_.map(questionList, function (q) {
                if (q._id == question._id) {
                    q.selectedSelection = selection;

                    if (showCorrectAfterAnswer) {
                        q.showAnswer = true;
                    }
                }
                return q;
            }))
        }
    }


    return (
        notEmptyLength(questionList) ?
            <React.Fragment>
                {
                    _.map(questionList, function (question, index) {
                        return (
                            <React.Fragment>
                                <Question
                                    question={question}
                                    index={props.index ? props.index + index + 1 : index + 1}
                                    key={`question-${index + 1}`}
                                    id={`question-${index + 1}`}
                                    language={props.language}
                                    showCorrectAnswer={
                                        showCorrectAfterAnswer ?
                                            question.showAnswer != null ?
                                                question.showAnswer
                                                :
                                                null
                                            :
                                            showCorrectAnswer != null ?
                                                showCorrectAnswer
                                                :
                                                null}
                                    answerAble={answerAble != null ? answerAble : null}
                                    className={props.itemClassName ? props.itemClassName : ''}
                                    style={{ ...props.itemStyle }}
                                    handleAnswer={(selection) => { fillInQuestion(question, selection); }} />
                            </React.Fragment>
                        )
                    })
                }
            </React.Fragment>
            :
            <Empty></Empty>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(QuestionList)));