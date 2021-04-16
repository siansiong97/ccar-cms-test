import { Affix, Col, message, Row } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Beforeunload } from 'react-beforeunload';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import client from '../../feathers';
import AnswerPaperForm from './answer-paper-form';
import QuestionList from './question-list';
import { updateActiveMenu } from '../../redux/actions/app-actions';
import LayoutV2 from '../general/LayoutV2';
import { isValidNumber, notEmptyLength  } from '../../common-function';



const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
  }
  const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
  }
  const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
  }
  const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
  }

const PAGE_SIZE = 50;

const KPPBM = (props) => {
    const [mainConfig, setMainConfig] = useState({
        page: 1,
        sorting: '',
      })
    const [questions, setQuestions] = useState([])
    const [submitedQuestions, setSubmitedQuestions] = useState([])
    const [allAnswered, setAllAnswered] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [visible, setVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getQuestions()
    }, [])

    useEffect(() => {
        getQuestions((page - 1) * PAGE_SIZE)
    }, [page])

    // function pushParameterToUrl(data, config) {

    //     let path = convertParameterToProductListUrl(data, config)
     
    //     if (path != `${props.location.pathname}${props.location.search}`) {
    //       props.router.replace(path)
    //     }
    
    //   }

    useEffect(() => {

        if (notEmptyLength(questions)) {
            let allanswered = true;
            _.forEach(questions, function (question) {
                if (!question.selectedSelection._id) {
                    allanswered = false;
                    return false;
                }
            })
            setAllAnswered(allanswered);

        }

    }, [questions])

    const showDrawer = () => {
        visible == true ? setVisible(false) : setVisible(true)
    }

    const onClose = () => {
        visible == false ? setVisible(true) : setVisible(false)
    }

    const getQuestions = () => {
        props.updateActiveMenu('8');

        axios.get(`${client.io.io.uri}randomKppQuestions`, {
            params: {
                $match: {
                    language: 'BM',
                },
                $sort: {
                    weight: -1,
                    createdAt: -1,
                },
                limit: PAGE_SIZE,
            }
        }).then(res => {
            if (notEmptyLength(res.data.data)) {
                setQuestions(res.data.data.map(function (question) {
                    question.selectedSelection = {};
                    question.selections = _.shuffle(question.selections);
                    return question;
                }))
                setTotal(res.data.total);
            } else {
                setQuestions([]);
                setTotal(50);
            }
        }).catch(err => {
            message.error(err.message)
        });
    }

    return (
        <React.Fragment>
            <LayoutV2>
            <Beforeunload onBeforeunload={() => "Anda akan kembali ke lama utama sekolah memandu. Anda pasti?"} />
                <div className='section'>
                    <Desktop>
                    <div className="container">
                        <Row gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                <div className='h5 black margin-bottom-sm'>
                                    UJIAN KPP
                                </div>
                                <div className='background-white padding-lg'>
                                    <QuestionList
                                        questions={notEmptyLength(questions) ? questions : []}
                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        language="BM" />
                                    {/* <Pagination current={page} total={total} onChange={(page) => { setPage(page); window.scroll(0, 0) }} showQuickJumper /> */}
                                </div>
                            </Col>
                            <Col xs={0} sm={0} md={6} lg={6} xl={6}>
                                <Affix offsetTop={isValidNumber(props.app.menuHeight ) ? parseInt(props.app.menuHeight) + 10 : 70} >
                                    <AnswerPaperForm
                                        questions={notEmptyLength(questions) ? questions : []}
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        allAnswered={allAnswered}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        timer={1800000}
                                        handleSubmit={(questions) => { setSubmited(true); setSubmitedQuestions(questions) }}
                                        language="BM" />
                                </Affix>
                            </Col>
                            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                                    <AnswerPaperForm
                                        questions={notEmptyLength(questions) ? questions : []}
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        allAnswered={allAnswered}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        timer={1800000}
                                        handleSubmit={(questions) => { setSubmited(true); setSubmitedQuestions(questions) }}
                                        language="BM" />
                            </Col>
                            {/* <div className="collapse-filter" style={{float:'right'}} >
                                <Affix offsetTop={200} onChange={affixed => {}}>
                                    <Button style={{position:'absolute'}} type="primary" onClick={() => showDrawer(true)}>
                                        <Icon type="caret-left" />
                                    </Button>
                                <Drawer
                                    placement="right"
                                    closable={true}
                                    onClose={() => setVisible(false)}
                                    visible={visible}
                                    width={350}
                                >
                                <div className="margin-top-sm">
                                <AnswerPaperForm
                                        questions={notEmptyLength(questions) ? questions : []}
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        allAnswered={allAnswered}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        timer={1800000}
                                        handleSubmit={(questions) => { setSubmited(true); setSubmitedQuestions(questions) }} />
                                </div></Drawer>
                                </Affix>
                            </div> */}

                        </Row>
                    </div>
                    </Desktop>

                    <Tablet>
                    <div style={{paddingLeft:'10px', paddingRight:'10px'}}>
                        <Row gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={15} lg={18} xl={18}>
                                <div className='h5 black margin-bottom-sm'>
                                    UJIAN KPP
                                </div>
                                <div className='background-white'>
                                    <QuestionList
                                        questions={notEmptyLength(questions) ? questions : []}
                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        language="BM" />
                                    {/* <Pagination current={page} total={total} onChange={(page) => { setPage(page); window.scroll(0, 0) }} showQuickJumper /> */}
                                </div>
                            </Col>
                            <Col xs={0} sm={0} md={9} lg={6} xl={6}>
                                <Affix offsetTop={isValidNumber(props.app.menuHeight ) ? parseInt(props.app.menuHeight) + 10 : 70} >
                                    <AnswerPaperForm
                                        questions={notEmptyLength(questions) ? questions : []}
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        allAnswered={allAnswered}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        timer={1800000}
                                        handleSubmit={(questions) => { setSubmited(true); setSubmitedQuestions(questions) }}
                                        language="BM" />
                                </Affix>
                            </Col>
                        </Row>
                    </div>
                    </Tablet>

                    <Mobile>
                    <div className="container">
                        <Row gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                                <div className='h5 black margin-bottom-sm'>
                                    UJIAN KPP
                                </div>
                                <div className='background-white padding-lg'>
                                    <QuestionList
                                        questions={notEmptyLength(questions) ? questions : []}
                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        language="BM" />
                                    {/* <Pagination current={page} total={total} onChange={(page) => { setPage(page); window.scroll(0, 0) }} showQuickJumper /> */}
                                </div>
                            </Col>
                            <Col xs={0} sm={0} md={6} lg={6} xl={6}>
                                <Affix offsetTop={isValidNumber(props.app.menuHeight ) ? parseInt(props.app.menuHeight) + 10 : 70} >
                                    <AnswerPaperForm
                                        questions={notEmptyLength(questions) ? questions : []}
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        allAnswered={allAnswered}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        timer={1800000}
                                        handleSubmit={(questions) => { setSubmited(true); setSubmitedQuestions(questions) }}
                                        language="BM" />
                                </Affix>
                            </Col>
                            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                                    <AnswerPaperForm
                                        questions={notEmptyLength(questions) ? questions : []}
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        allAnswered={allAnswered}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        timer={1800000}
                                        handleSubmit={(questions) => { setSubmited(true); setSubmitedQuestions(questions) }}
                                        language="BM" />
                            </Col>
                            {/* <div className="collapse-filter" style={{float:'right'}} >
                                <Affix offsetTop={200} onChange={affixed => {}}>
                                    <Button style={{position:'absolute'}} type="primary" onClick={() => showDrawer(true)}>
                                        <Icon type="caret-left" />
                                    </Button>
                                <Drawer
                                    placement="right"
                                    closable={true}
                                    onClose={() => setVisible(false)}
                                    visible={visible}
                                    width={350}
                                >
                                <div className="margin-top-sm">
                                <AnswerPaperForm
                                        questions={notEmptyLength(questions) ? questions : []}
                                        handleChange={(questions) => { setQuestions(questions) }}
                                        allAnswered={allAnswered}
                                        showCorrectAnswer={submited}
                                        answerAble={!submited}
                                        timer={1800000}
                                        handleSubmit={(questions) => { setSubmited(true); setSubmitedQuestions(questions) }} />
                                </div></Drawer>
                                </Affix>
                            </div> */}

                        </Row>
                    </div>
                    </Mobile>
                    
                </div>
            </LayoutV2>
        </React.Fragment>
    )

}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
}

export default connect(mapStateToProps, mapDispatchToProps)(KPPBM);