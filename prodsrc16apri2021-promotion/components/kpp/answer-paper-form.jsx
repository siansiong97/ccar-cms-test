import { ShareAltOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Empty, Form, Icon, message, Modal, Popconfirm, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';
import Texty from 'rc-texty';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { arrayLengthCount, convertMilliSecondsToTime, isValidNumber, notEmptyLength, numberToFixed, trimStringNumber } from '../../common-function';
import SocialShareButton from '../general/SocialShareButton';
import { withRouter } from 'next/router';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';
import Link from 'next/link';


const ANSWERS_PER_COL = 10;

const AnswerPaperForm = (props) => {

    const [questions, setQuestions] = useState([]);
    const [answerNavInput, setAnswerNavInput] = useState(1);
    const [answerInput, setAnswerInput] = useState('');
    const [allAnswered, setAllAnswered] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [countDownModal, setCountDownModal] = useState(true);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [answerAble, setAnswerAble] = useState(true);
    const [correctQuestions, setCorrectQuestions] = useState([]);
    const [timer, setTimer] = useState(null);
    const [countDownTimer, setCountDownTimer] = useState(3000);
    const [isAnimationEnd, setIsAnimationEnd] = useState(false);
    const [paperTimer, setPaperTimer] = useState(null);
    const [paperCountDownTimer, setPaperCountDownTimer] = useState(null);
    const [timerFunction, setTimerFunction] = useState(false);
    // const [showBmSummary, setShowBmSummary] = useState(false);
    // const [showEnSummary, setShowEnSummary] = useState(false);


    useEffect(() => {
        if (notEmptyLength(props.questions)) {
            let temp = _.cloneDeep(props.questions);
            temp = _.map(temp, function (question) {
                if (!notEmptyLength(question.selectedSelection)) {
                    question.selectedSelection = {}
                }
                question.selections = _.map(question.selections, function (selection, index) {
                    selection.index = index;
                    return selection;
                });
                return question;
            })
            setQuestions(temp);
        } else {
            setQuestions([]);
        }
    }, [props.questions])

    useEffect(() => {
        if (props.allAnswered) {
            setAllAnswered(true);
        } else {
            setAllAnswered(false);
        }
    }, [props.allAnswered])


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
        if (isValidNumber(paperCountDownTimer) && !timerFunction) {
            setTimerFunction(setInterval(() => {
                setPaperCountDownTimer(paperCountDownTimer => paperCountDownTimer - 1000);
            }, 1000))

        }

        if (paperCountDownTimer == 600000) {
            message.warning(`10 minutes left`, 10)
        }

        if (paperCountDownTimer == 60000) {
            message.warning(`1 minute left. Please do your final checking.`, 10)
        }

        if (paperCountDownTimer == 0 || !answerAble) {
            clearInterval(timerFunction);
            handleSubmit();

        }
    }, [paperCountDownTimer, timerFunction])


    useEffect(() => {
        if (isValidNumber(countDownTimer) && parseInt(countDownTimer) > 0 && !timerFunction && isAnimationEnd) {
            setCountDownModal(true);
            setTimerFunction(setInterval(() => {
                setCountDownTimer(countDownTimer => countDownTimer - 1000);
            }, 1500))
        }

        if (countDownTimer <= 0) {
            setCountDownModal(false);
            clearInterval(timerFunction);
            setTimerFunction(null);
            if (props.timer) {
                setTimer(props.timer);
                setPaperTimer(props.timer);
                setPaperCountDownTimer(props.timer);
            } else {
                setTimer(null);
            }
        }
    }, [countDownTimer, isAnimationEnd])

    useEffect(() => {
        findAnswer(answerNavInput)
    }, [questions])

    useEffect(() => {

        if (isValidNumber(parseInt(answerNavInput))) {
            findAnswer(answerNavInput);
        }

    }, [answerNavInput])

    useEffect(() => {

        if (answerInput != null && answerInput != '') {
            let newQuestions = notEmptyLength(_.cloneDeep(questions)) ? _.cloneDeep(questions) : [];

            if (notEmptyLength(newQuestions[answerNavInput - 1])) {
                let index = answerInput.charCodeAt(0) - 65;
                if (notEmptyLength(newQuestions[answerNavInput - 1].selections[index])) {
                    newQuestions[answerNavInput - 1].selectedSelection = newQuestions[answerNavInput - 1].selections[index];
                    if (props.handleChange) {
                        props.handleChange(newQuestions);
                    }
                }
            }
        }


    }, [answerInput])


    function splitAnswerToCols(data) {

        if (notEmptyLength(data)) {
            return _.chunk(data, ANSWERS_PER_COL);
        } else {
            return [];
        }
    }

    function handleAnswerNavChange(value) {
        if (isValidNumber(parseInt(value)) && parseInt(value) > 0) {
            if (value > arrayLengthCount(questions)) {
                setAnswerNavInput(arrayLengthCount(questions));
            } else {
                setAnswerNavInput(parseInt(value));
            }
        } else {
            setAnswerNavInput(1);
        }
    }

    function handleAnswer(value) {
        if (/^[a-zA-Z]+$/.test(value)) {
            let question = questions[answerNavInput - 1];

            if (notEmptyLength(question)) {
                let maxAsciiValue = arrayLengthCount(question.selections) - 1 + 65;
                let userInputAsciiValue = _.upperCase(value.slice(0, 1)).charCodeAt(0);
                if (userInputAsciiValue > maxAsciiValue || userInputAsciiValue < 65) {
                    message.warning(`Question ${answerNavInput} only have ${_.map(_.range(65, maxAsciiValue + 1, 1), function (ascii) {
                        return String.fromCharCode(ascii);
                    })}
                    selections.
                    `)
                    setAnswerInput('');
                } else {
                    setAnswerInput(String.fromCharCode(userInputAsciiValue));
                }
            } else {
                setAnswerInput('');
            }
        } else {
            setAnswerInput('');
        }
    }


    function findAnswer(value) {

        if (isValidNumber(parseInt(value))) {
            if (notEmptyLength(questions[value - 1])) {
                setAnswerInput(!isValidNumber(parseInt(questions[value - 1].selectedSelection.index)) ? '' : String.fromCharCode(65 + parseInt(questions[value - 1].selectedSelection.index)))
            } else {
                setAnswerInput('');
            }
        } else {
            setAnswerInput('');
        }
    }

    function handleSubmit() {
        if (notEmptyLength(questions)) {
            clearInterval(timerFunction)
            let correctQuestions = _.filter(questions, function (question) {
                return notEmptyLength(question.selectedSelection) ? question.selectedSelection.isAnswer : false;
            });

            setCorrectQuestions(correctQuestions);
            setModalVisible(true);
            if (props.handleSubmit) {
                props.handleSubmit(questions);
            }
        }
    }

    function scrollToQuestion(questionNo) {
        if (notEmptyLength(questions) && isValidNumber(parseInt(questionNo)) && notEmptyLength(questions[parseInt(questionNo) - 1])) {
            var element = document.getElementById(`question-${parseInt(questionNo)}`);
            var headerOffset = 0;
            var elementPosition = element.offsetTop;
            var offsetPosition = elementPosition - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setAnswerNavInput(parseInt(questionNo))
        }
    }

    function resetSelections() {
        if (notEmptyLength(questions)) {

            let newQuestions = _.map(questions, function (question) {
                question.selectedSelection = {};
                return question;
            })
            if (props.handleChange) {
                props.handleChange(newQuestions);
            }
        }
    }

    // const handlePage = () => {

    //     switch (tabIndex) {
    //         case 0:
    //             setShowEnRevisionModal(true);
    //             break;
    //         case 1:
    //             setShowBmRevisionModal(true);
    //             break;
    //         case 2:
    //             props.router.push('/kpp/kpp-en');
    //             break;
    //         case 3:
    //             props.router.push('/kpp/kpp-bm');
    //             break;

    //         default:
    //             break;
    //     }
    // }


    const _renderSummary = () => {

        let isPassed = arrayLengthCount(correctQuestions) / arrayLengthCount(questions) > 0.84;

        return (
            <React.Fragment>
                <Modal centered overlay={true} closable={false} maskClosable={true} mask visible={modalVisible} footer={null} width="100%" maskStyle={{ backgroundColor: 'black' }} className='no-padding-modal-body'>
                    <Row type="flex" align="middle" justify="center" className='background-white height-window-100' >
                        <Col xs={0} sm={0} md={24} lg={24} xl={24} className='flex-justify-center flex-items-align-center'>
                            <div className='flex-justify-center flex-items-align-center flex-wrap' style={{ maxHeight: '50%', maxWidth: '50%' }}>
                                <div className='relative-wrapper' style={{ height: '200px', width: '100%' }}>
                                    <img src={
                                        isPassed ?
                                            '/assets/kpp/pass.gif'
                                            :
                                            '/assets/kpp/fail.gif'
                                    } className='absolute-center' style={{ width: '200px', height: '200px' }}></img>
                                    <span className={`flex-justify-center width-100 h5 font-weight-bold ${isPassed ? 'green' : 'red'}`} style={{ position: 'absolute', bottom: '-3px' }} >
                                        {
                                            isPassed ?
                                                _.upperCase(props.language) == 'BM' ? 'LULUS' : 'PASS'
                                                :
                                                _.upperCase(props.language) == 'BM' ? 'GAGAL' : 'FAIL'
                                        }
                                    </span>
                                </div>
                                <div className='subtitle1 black text-overflow-break width-100 text-align-center margin-y-lg'>
                                    {
                                        isPassed ? 
                                            _.upperCase(props.language) == 'BM' ? 'Anda telah berjaya menyelesaikan Ujian Komputer Lesen Memandu' : 'You have successfully completed Driving License Computer Test'
                                            :
                                            _.upperCase(props.language) == 'BM' ? 'Anda tidak berjaya menyelesaikan Ujian Komputer Lesen Memandu' : 'You have failed to complete Driving License Computer Test'
                                    }
                                </div>
                                <div className='flex-items-align-center flex-justify-center width-100 margin-y-lg'>
                                    <span className='d-inline-block margin-x-md' >
                                        <div className={`h5 text-align-center font-weight-bold ${isPassed ? 'green' : 'red'}`}>
                                            {`(${numberToFixed(arrayLengthCount(correctQuestions) / arrayLengthCount(questions), false, 2) * 100}%)`}
                                        </div>
                                        <div className="subtitle1 black text-align-center margin-top-sm">
                                            {`${arrayLengthCount(correctQuestions)}/${arrayLengthCount(questions)}`}
                                        </div>
                                    </span>
                                    <span className='d-inline-block margin-x-md' >
                                        <Divider type="vertical" style={{ height: '100px', backgroundColor: '#757575' }} />
                                    </span>
                                    <span className='d-inline-block margin-x-md' >
                                        <div className="subtitle1 black text-align-center margin-top-sm">
                                            {moment().format('DD/MM/YYYY')}
                                        </div>
                                        <div className="subtitle1 black text-align-center margin-top-sm">
                                            {`${moment.duration(paperTimer - paperCountDownTimer).minutes() > 0 ? `${moment.duration(paperTimer - paperCountDownTimer).minutes()}mins` : ''} ${moment.duration(paperTimer - paperCountDownTimer).seconds() > 0 ? `${moment.duration(paperTimer - paperCountDownTimer).seconds()}sec` : ''}`}
                                        </div>
                                    </span>
                                </div>
                                <div className='subtitle1 black text-overflow-break width-100 text-align-center margin-y-lg'>
                                    {_.upperCase(props.language) == 'BM' ? 'Adakah anda ingin menyemak jawapan?' : 'View your attempts?'}
                                </div>
                                <div className='flex-justify-center width-100 flex-items-align-center margin-bottom-lg'>
                                    {/* <Button className='padding-x-md border-ccar-yellow background-white black margin-x-sm' style={{ minWidth: '100px' }} onClick={(e) => { window.location.reload(); }}> {_.upperCase(props.language) == 'BM' ? 'Saya mahu ujian semula' : 'I want retest'} </Button> */}
                                    <Button className='padding-x-md border-ccar-yellow background-ccar-yellow white margin-x-sm' style={{ minWidth: '100px' }} onClick={(e) => { setModalVisible(false) }}> {_.upperCase(props.language) == 'BM' ? 'Ya' : 'Yes'} </Button>
                                    <Link shallow={false}  href={'/kpp'} >
                                        <a>
                                            <Button className='padding-x-md border-ccar-yellow background-white black margin-x-sm' style={{ minWidth: '100px' }}> {_.upperCase(props.language) == 'BM' ? 'Tidak, kembali ke Laman Utama' : 'Back to Home Page'}  </Button>
                                        </a>
                                    </Link>
                                </div>
                                <div className='flex-justify-center flex-items-align-center width-100 text-align-center margin-y-lg'>
                                    <ShareAltOutlined className='margin-right-sm' /> {_.upperCase(props.language) == 'BM' ? 'Kongsi keputusan' : 'Share my result'}
                                </div>
                                <div className='flex-justify-center width-100 flex-items-align-center margin-bottom-lg flex-wrap'>
                                    <SocialShareButton title={`I scored ${numberToFixed(arrayLengthCount(correctQuestions) / arrayLengthCount(questions), false, 2) * 100}% in CCAR Mobile App KPP Test. I challenge you, go and test now!`} link={'https://play.google.com/store/apps/details?id=com.ccarmy'} shape="round"
                                        network={['facebook', 'twitter', 'line', 'telegram', 'whatsapp']} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal>
            </React.Fragment>
        )
    }

    return (
        notEmptyLength(questions) ?
            <React.Fragment>
                <Row type="flex" justify="center" align="top" className={`background-white padding-bottom-xs ${props.className ? props.className : ''}`} style={{ ...props.style }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className='width-100 background-ccar-yellow flex-items-align-center flex-justify-space-between' style={{ height: '40px' }}>
                            <span className='d-inline-block headline   white padding-x-sm' >
                                {_.upperCase(props.language) == 'BM' ? 'Jawapan' : 'Answer'}
                            </span>
                            <span className='d-inline-block padding-x-sm cursor-pointer' >
                                {
                                    answerAble ?
                                        <Popconfirm
                                            title={_.upperCase(props.language) == 'BM' ? 'Adakah anda pasti untuk menetapkan semula jawapan? Tindakan ini tidak boleh dikembalikan.' : 'Are you sure you want to reset all the answer? This action cannot be rollback.'}
                                            onConfirm={resetSelections}
                                            okText={_.upperCase(props.language) == 'BM' ? 'Ya' : 'Yes'}
                                            cancelText={_.upperCase(props.language) == 'BM' ? 'Tidak' : 'No'}
                                            placement="bottomLeft"
                                        >
                                            <Icon type="redo" className='white' />
                                        </Popconfirm>
                                        :
                                        null
                                }
                            </span>
                        </div>
                    </Col>
                    {
                        timer ?
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className=' flex-justify-center  flex-items-align-center ' >
                                    <span className='d-inline-block h3 font-weight-bold grey-darken-2  text-align-center' >
                                        {convertMilliSecondsToTime(paperCountDownTimer, 'minute')}
                                    </span>
                                </div>
                            </Col>
                            :
                            null
                    }
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="width-100 margin-y-sm" >
                            <div className='scroll-wrapper padding-x-md  flex-justify-space-between' style={{ maxHeight: '500px' }}>
                                {
                                    _.map(splitAnswerToCols(questions), function (col, colIndex) {
                                        return (
                                            <div key={`col-${colIndex}`} className='width-30 flex-justify-center flex-items-align-center flex-wrap' style={{ maxHeight: '500px' }}>
                                                {
                                                    _.map(col, function (question, colQuestionIndex) {
                                                        return (
                                                            <div className='flex-justify-center flex-items-align-center flex-items-no-shrink width-100 padding-xs margin-y-xs cursor-pointer' onClick={(e) => { scrollToQuestion(colIndex * ANSWERS_PER_COL + colQuestionIndex + 1) }} >
                                                                <span className='d-inline-block black caption flex-items-no-shrink width-30' style={{ marginRight: '7px' }}>
                                                                    {`${colIndex * ANSWERS_PER_COL + colQuestionIndex + 1}.`}
                                                                </span>
                                                                <span className={`d-inline-block flex-justify-center flex-items-align-center flex-items-no-shrink width-60 thin-border border-grey 
                                                            ${!showCorrectAnswer || !notEmptyLength(question.selectedSelection) ? null : question.selectedSelection.isAnswer ? 'green' : 'red'}`}
                                                                    style={{ height: '20px' }}>
                                                                    {!question.selectedSelection || question.selectedSelection.index == null ? null : String.fromCharCode(65 + parseInt(question.selectedSelection.index))}
                                                                </span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                        <div className='margin-y-sm flex-justify-center'>
                            <Button
                                className='padding-x-xl white font-weight-bold margin-x-sm'
                                style={{ borderColor: '#B16400', backgroundColor: '#B16400' }}
                                shape="round"
                                disabled={!allAnswered}
                                onClick={(e) => { handleSubmit() }}
                            > {_.upperCase(props.language) == 'BM' ? 'Hantar' : 'Submit'} </Button>

                            <Link shallow={false}  href={'/kpp'} >
                                <a>
                                    <Button
                                        className='padding-x-xl white font-weight-bold margin-x-sm'
                                        style={{ borderColor: '#B16400', backgroundColor: '#B16400' }}
                                        shape="round"
                                    > {_.upperCase(props.language) == 'BM' ? 'Keluar' : 'Exit'} </Button>
                                </a>
                            </Link>
                        </div>
                    </Col>



                </Row>

                {/* <div className={`background-white margin-y-sm ${props.navClassName ? props.navClassName : ''}`} style={{ ...props.navStyle }}>
                    <div className='width-100 background-ccar-yellow flex-items-align-center flex-justify-space-between' style={{ height: '40px' }}>
                        <span className='d-inline-block headline   white padding-x-sm' >
                            Enter Your Answer
                        </span>
                    </div>
                    <div className="width-100 padding-md" >
                        <div className='scroll-wrapper flex-items-align-stretch' style={{ maxHeight: '200px' }}>
                            <div className='width-100'>
                                <div className='flex-justify-space-between flex-items-align-center margin-y-sm'>
                                    <span className='d-inline-block headline   black width-80' >
                                        Answer No. {answerNavInput}
                                    </span>
                                    <span className='d-inline-block headline   black width-20' >
                                        <Input value={answerInput} disabled={!answerAble} onChange={(e) => { handleAnswer(e.target.value) }} ></Input>
                                    </span>
                                </div>
                                <div className='flex-justify-space-between flex-items-align-center margin-y-sm'>
                                    <span className='d-inline-block headline   black width-80 flex-items-no-shrink' >
                                        To Question No
                                  </span>
                                    <span className='d-inline-block headline   black width-20 flex-items-no-shrink margin-right-sm' >
                                        <Input type="number" step="1" max={arrayLengthCount(questions)} value={answerNavInput} onChange={(e) => { handleAnswerNavChange(e.target.value) }} ></Input>
                                    </span>
                                    <span className='d-inline-block flex-items-no-shrink' >
                                        <Button className='background-brown border-brown white' onClick={(e) => {
                                            var element = document.getElementById(`question-${answerNavInput}`);
                                            var headerOffset = -80;
                                            var elementPosition = element.offsetTop;
                                            var offsetPosition = elementPosition - headerOffset;
 
                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: "smooth"
                                            });
                                        }}>Go</Button>
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div> */}

                {_renderSummary()}
                <Modal centered overlay={true} closable={false} maskClosable={true} mask visible={countDownModal} footer={null} width="100%" className='no-padding-modal-body background-black'
                // footer = {[ 
                //     <div className="white h6 text-align-center margin-lg">
                //         <Texty duration={1500} type="right" mode="smooth">
                //         {_.upperCase(props.language) == 'BM' ? 'Disediakan oleh' : 'Prepared by:'}
                //         </Texty>
                //     </div>
                // ]} 
                >
                    <Row type="flex" align="top" justify="center" gutter={[0, 20]} style={{ height: '100vh' }} className='background-black kpp-background'>
                        <img className="kpp-background" style={{ position: "absolute" }} src="/orange-line-background-2.png"></img>
                        <Col xs={0} sm={0} md={0} lg={24} xl={24}>
                            <div className='white h2 font-weight-bold text-align-center margin-lg'>
                                <Texty duration={1500} type="right" mode="smooth">
                                    {_.upperCase(props.language) == 'BM' ? 'Selamat Datang ke Ujian KPP' : 'Welcome to KPP Test'}
                                </Texty>
                            </div>
                            <div className='white h4 font-weight-bold text-align-center margin-lg'>
                                <Texty duration={1500} type="right" mode="smooth">
                                    {_.upperCase(props.language) == 'BM' ? 'Ujian anda akan bermula dalam' : 'Your test will begin at'}
                                </Texty>
                            </div>
                            <div className='white h1 font-weight-bold text-align-center margin-left-sm'>
                                <QueueAnim delay={3000} onEnd={() => { setIsAnimationEnd(true) }}>
                                    <Texty duration={600} type="flash" mode="sync" key="count-down-timer" exclusive={true} enter={{ x: 200, opacity: 0 }} leave={{ x: -200, opacity: 0 }}>
                                        {trimStringNumber(convertMilliSecondsToTime(countDownTimer, 'second'))}
                                    </Texty>
                                </QueueAnim>
                            </div>
                            <div className="white h6 text-align-center margin-x-lg width-100" style={{ position: 'fixed', bottom: 0 }}>
                                <Link shallow={false}  href={'/kpp'} >
                                    <a>
                                        <Button className='margin-md'>{_.upperCase(props.language) == 'BM' ? 'Keluar' : 'Exit'}</Button>
                                    </a>
                                </Link>
                                <Texty duration={1500} type="right" mode="smooth" display="inline-block">
                                    {_.upperCase(props.language) == 'BM' ? 'Disediakan oleh:' : 'Prepared by:'}
                                </Texty>
                                <img style={{ width: '5%', padding: '10px', display: 'inline-block' }} src="/assets/Ccar-logo.png"></img>
                                <img style={{ width: '5%', padding: '10px', display: 'inline-block' }} src="/menu-bar-icons/driving-school.png"></img>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                            <div className='white h3 font-weight-bold text-align-center margin-y-lg'>
                                <Texty duration={1500} type="right" mode="smooth">
                                    {_.upperCase(props.language) == 'BM' ? 'Selamat Datang ke Ujian KPP' : 'Welcome to KPP Test'}
                                </Texty>
                            </div>
                            <div className='white h4 font-weight-bold text-align-center margin-lg'>
                                <Texty duration={1500} type="right" mode="smooth">
                                    {_.upperCase(props.language) == 'BM' ? 'Ujian anda akan bermula dalam' : 'Your test will begin at'}
                                </Texty>
                            </div>
                            <div className='white h1 font-weight-bold text-align-center'>
                                <QueueAnim delay={3000} onEnd={() => { setIsAnimationEnd(true) }}>
                                    <Texty duration={600} type="flash" mode="sync" key="count-down-timer" exclusive={true} enter={{ x: 200, opacity: 0 }} leave={{ x: -200, opacity: 0 }}>
                                        {trimStringNumber(convertMilliSecondsToTime(countDownTimer, 'second'))}
                                    </Texty>
                                </QueueAnim>
                            </div>
                            <div className="white h6 text-align-center width-100" style={{ position: 'fixed', bottom: 0 }}>
                                <Link shallow={false}  href={'/kpp'} > 
                                <a>
                                <Button className='margin-md'>{_.upperCase(props.language) == 'BM' ? 'Keluar' : 'Exit'}</Button>
                                </a>
                                </Link>
                                <Texty duration={1500} mode="smooth" display="inline-block">
                                    {_.upperCase(props.language) == 'BM' ? 'Disediakan oleh:' : 'Prepared by:'}
                                </Texty>
                                <img style={{ width: '10%', padding: '10px', display: 'inline-block' }} src="/assets/Ccar-logo.png"></img>
                                <img style={{ width: '10%', padding: '10px', display: 'inline-block' }} src="/menu-bar-icons/driving-school.png"></img>
                            </div>
                        </Col>
                    </Row>
                </Modal>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(AnswerPaperForm)));