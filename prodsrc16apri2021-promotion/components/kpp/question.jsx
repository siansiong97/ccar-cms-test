import { Col, Empty, Form, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ReactImageZoom from 'react-image-zoom';
import { connect } from 'react-redux';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';
import { isValidNumber, notEmptyLength } from '../../common-function';
import { withRouter } from 'next/router';


const Question = (props) => {

    const [question, setQuestion] = useState({});
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [answerAble, setAnswerAble] = useState(true);

    useEffect(() => {
        if (props.showCorrectAnswer) {
            setShowCorrectAnswer(true);
        } else {
            setShowCorrectAnswer(false);
        }
    }, [props.showCorrectAnswer])

    useEffect(() => {
        if (props.answerAble != null) {
            if (props.answerAble) {
                setAnswerAble(true);
            } else {
                setAnswerAble(false);
            }
        } else {
            setAnswerAble(true);
        }
    }, [props.answerAble])

    useEffect(() => {

        if (notEmptyLength(props.question)) {
            let temp = _.cloneDeep(props.question);
            if (!notEmptyLength(temp.selectedSelection)) {
                temp.selectedSelection = {}
            }
            temp.selections = _.map(temp.selections, function (selection, index) {
                selection.index = index;
                return selection;
            })
            setQuestion(temp);
        } else {
            setQuestion(null)
        }
    }, [props.question])

    function handleAnswer(selection, index) {
        if (notEmptyLength(selection) && isValidNumber(parseInt(index))) {
            if (props.handleAnswer) {
                props.handleAnswer(selection);
            }

            setQuestion({
                ...question,
                selectedSelection: selection,
            })

        }
    }

    function getCorrectSelection(question) {
        if (notEmptyLength(question)) {
            return _.find(question.selections, function (selection) {
                return selection.isAnswer;
            })
        }
    }


    return (
        notEmptyLength(question) ?
            <React.Fragment>
                <div key={props.key} id={props.id} className={`background-white padding-x-lg padding-y-lg ${props.className ? props.className : ''}`} style={{ ...props.style, width: '100%' }}>
                    <Row gutter={[0, 10]} >
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="h6 text-overflow-break black">
                                {`${_.toLower(props.language) == 'bm' ? 'Soalan' : 'Question'} ${props.index != null ? props.index : ''}`}
                                {/* {`${_.toLower(props.language) == 'bm' ? 'Soalan' : 'Question'} ${props.index != null ? props.index : ''}`} */}
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="headline   text-overflow-break">
                                {question.title}
                            </div>
                            {
                                notEmptyLength(question.imgURL) ?
                                    <div className="flex-justify-start flex-items-align-center scroll-x-wrapper">
                                        {
                                            _.map(question.imgURL, function (img) {
                                                return (
                                                    <ReactImageZoom
                                                        width='100'
                                                        height="100"
                                                        img={`${img.url || img}`}
                                                        zoomWidth="200"
                                                        zoomStyle="z-index: 99;background-color:white;"
                                                        zoomPosition="original"
                                                        scale="1.2"
                                                    />
                                                    // <span className='d-inline-block margin-md relative-wrapper flex-items-no-shrink' style={{ width: '100px', height: '100px' }} >
                                                    //     <img src={`/${img.url}`} className='fill-parent absolute-center'></img>
                                                    // </span>
                                                );
                                            })
                                        }
                                    </div>
                                    :
                                    null
                            }
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div>
                                {
                                    _.map(notEmptyLength(question.selections) ? question.selections : [], function (selection, index) {
                                        return (
                                            <React.Fragment>
                                                <div className={`flex-justify-start flex-items-align-center fill-parent margin-y-sm ${!answerAble ? '' : 'cursor-pointer'} ${!question.selectedSelection || question.selectedSelection._id != selection._id ? '' : 'ccar-yellow'}`}
                                                    onClick={(e) => {
                                                        if (answerAble) {
                                                            handleAnswer(selection, index)
                                                        }
                                                    }}
                                                >
                                                    <span className='d-inline-block headline   margin-right-sm flex-items-no-shrink' >
                                                        {`${String.fromCharCode(65 + index)}.`}
                                                    </span>
                                                    {
                                                        notEmptyLength(selection.imgURL) ?
                                                            _.map(selection.imgURL, function (img) {
                                                                return (
                                                                    <ReactImageZoom
                                                                        width='100'
                                                                        height="100"
                                                                        img={`${img.url || img}`}
                                                                        zoomWidth="225"
                                                                        zoomStyle="z-index: 99;background-color:white;"
                                                                        zoomPosition="original"
                                                                        scale="1.2"
                                                                    />
                                                                    // <span className='d-inline-block margin-md relative-wrapper flex-items-no-shrink' style={{ width: '100px', height: '100px' }} >
                                                                    //     <img src={`/${img.url}`} className='fill-parent absolute-center'></img>
                                                                    // </span>
                                                                )
                                                            })
                                                            :
                                                            null
                                                    }
                                                    <span className={`d-inline-block headline   text-overflow-break`} >
                                                        {selection.title}
                                                    </span>
                                                </div>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </div>
                        </Col>
                        {
                            showCorrectAnswer ?
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    {
                                        !notEmptyLength(question.selectedSelection) || question.selectedSelection.isAnswer == null || !question.selectedSelection.isAnswer ?
                                            <React.Fragment>
                                                <div className='red headline  '>
                                                    {`${_.toLower(props.language) == 'bm' ? 'Salah!' : 'Wrong!'}`}
                                                </div>
                                                <div className='green headline  '>
                                                    {`${_.toLower(props.language) == 'bm' ? 'Jawapan :' : 'Answer :'} ${String.fromCharCode(65 + getCorrectSelection(question).index)}`}
                                                </div>
                                            </React.Fragment>
                                            :
                                            <div className='green headline  '>
                                                {`${_.toLower(props.language) == 'bm' ? 'Betul!' : 'Correct!'}`}
                                            </div>
                                    }
                                </Col>
                                :
                                null
                        }
                    </Row>
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Question)));