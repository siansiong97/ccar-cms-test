import { Col, Icon, message, Pagination, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import client from '../../feathers';
import QuestionList from './question-list';
import { updateActiveMenu } from '../../redux/actions/app-actions';
import LayoutV2 from '../general/LayoutV2';
import { notEmptyLength } from '../../common-function';
import { fetchRevisionAnsweredQuestions } from '../../redux/actions/kpp-actions';
import { withRouter } from 'next/router';



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

const PAGE_SIZE = 10;
const adsImg = '/live-ads.png'
const adsImg2 = '/social-news-ads.png'

const KPPRevision = (props) => {
    const [questions, setQuestions] = useState([])
    const [origQuestions, setOrigQuestions] = useState([])
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        getQuestions(0);
        resetPaper();
    }, [])

    useEffect(() => {
        getQuestions((page - 1) * PAGE_SIZE)
    }, [page])

    useEffect(() => {
    }, [questions])


    useEffect(() => {
        replaceQuestions(origQuestions);
    }, [props.kpp[`answered${_.upperFirst(props.router.query.language)}RevisionSection${String.fromCharCode(65 + parseInt(props.router.query.group))}Paper`]])

    function getQuestions(skip) {
        props.updateActiveMenu('8');

        if (!props.router.query.group || !props.router.query.language) {
            props.router.push('/kpp', undefined, { shallow : false });
            message.error('Invalid Revision Paper');
        }

        client.service('kpp-app').find({
            query: {
                language: _.upperCase(props.router.query.language),
                group: props.router.query.group,
                $limit: PAGE_SIZE,
                $skip: skip,
                $sort: {
                    weight: -1,
                    createdAt: -1,
                },
            },
        }).then(res => {
            if (notEmptyLength(res.data)) {
                let questions = res.data.map(function (question) {
                    question.selectedSelection = {};
                    question.selections = _.shuffle(question.selections);
                    return question;
                });

                setOrigQuestions(questions);
                replaceQuestions(questions);
                setTotal(res.total);
            } else {
                setQuestions([]);
                setTotal(0)
            }
        }).catch(err => {
            message.error(err.message)
        });
    }


    function questionsTouched(questions) {
        if (notEmptyLength(questions)) {
            let answered = _.filter(questions, function (question) {
                return notEmptyLength(question.selectedSelection);
            });
            props.fetchRevisionAnsweredQuestions(
                {
                    language: props.router.query.language,
                    group: props.router.query.group,
                    data: _.unionBy(answered, props.kpp[`answered${_.upperFirst(props.router.query.language)}RevisionSection${String.fromCharCode(65 + parseInt(props.router.query.group))}Paper`], '_id')
                }
            )
        }
    }

    function replaceQuestions(questions) {
        if (notEmptyLength(questions)) {
            let replacedQuestions = _.map(questions, function (question) {
                let selectedAnsweredQuestion = _.find(props.kpp[`answered${_.upperFirst(props.router.query.language)}RevisionSection${String.fromCharCode(65 + parseInt(props.router.query.group))}Paper`], ['_id', question._id]);
                if (notEmptyLength(selectedAnsweredQuestion)) {
                    if (notEmptyLength(question.selectedSelection)) {
                        selectedAnsweredQuestion.selectedSelection = question.selectedSelection;
                    }
                    return selectedAnsweredQuestion;
                } else {
                    return question;
                }
            })
            setQuestions(replacedQuestions);
        }
    }

    function resetPaper() {
        props.fetchRevisionAnsweredQuestions(
            {
                language: props.router.query.language,
                group: props.router.query.group,
                data: [],
            }
        )
    }
    return (
        <React.Fragment>
            <LayoutV2>
                <div className='section'>
                    <div className="container">
                        <Row gutter={[10, 20]}>
                            <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                                <Row>
                                    <Col span={24}>
                                        <div className='width-100 flex-justify-space-between flex-items-align-center margin-bottom-sm'>
                                            <span className='d-inline-block h5 black' >
                                                {_.upperCase(props.router.query.language) == 'BM' ? 'Kertas Ulangkaji' : 'Revision'} - {_.upperCase(props.router.query.language)} - {_.upperCase(props.router.query.language) == 'BM' ? 'Bahagian' : 'Section'} {String.fromCharCode(65 + parseInt(props.router.query.group))}
                                            </span>
                                            {/* <span className='d-inline-block' >
                                        <Popconfirm
                                            title="Are you sure reset all the answer? This action cannot be rollback."
                                            onConfirm={resetPaper}
                                            okText="Yes"
                                            cancelText="No"
                                            placement="bottomLeft"
                                        >
                                            <Button icon="redo" className='padding-x-md'>Reset</Button>
                                        </Popconfirm>
                                    </span> */}
                                        </div>
                                        <Desktop>
                                            <div className='background-white padding-lg'>
                                                {_.upperCase(props.router.query.language) == 'BM' ?
                                                    <QuestionList
                                                        questions={notEmptyLength(questions) ? questions : []}
                                                        index={(page - 1) * PAGE_SIZE}
                                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                                        handleChange={(questions) => { questionsTouched(questions) }}
                                                        showCorrectAfterAnswer
                                                        language="BM"
                                                    />
                                                    :
                                                    <QuestionList
                                                        questions={notEmptyLength(questions) ? questions : []}
                                                        index={(page - 1) * PAGE_SIZE}
                                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                                        handleChange={(questions) => { questionsTouched(questions) }}
                                                        showCorrectAfterAnswer
                                                        language="EN"
                                                    />
                                                }
                                            </div>
                                        </Desktop>
                                        <Tablet>
                                            <div className='background-white'>
                                                {_.upperCase(props.router.query.language) == 'BM' ?
                                                    <QuestionList
                                                        questions={notEmptyLength(questions) ? questions : []}
                                                        index={(page - 1) * PAGE_SIZE}
                                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                                        handleChange={(questions) => { questionsTouched(questions) }}
                                                        showCorrectAfterAnswer
                                                        language="BM"
                                                    />
                                                    :
                                                    <QuestionList
                                                        questions={notEmptyLength(questions) ? questions : []}
                                                        index={(page - 1) * PAGE_SIZE}
                                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                                        handleChange={(questions) => { questionsTouched(questions) }}
                                                        showCorrectAfterAnswer
                                                        language="EN"
                                                    />
                                                }
                                            </div>
                                        </Tablet>
                                        <Mobile>
                                            <div className='background-white padding-lg'>
                                                {_.upperCase(props.router.query.language) == 'BM' ?
                                                    <QuestionList
                                                        questions={notEmptyLength(questions) ? questions : []}
                                                        index={(page - 1) * PAGE_SIZE}
                                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                                        handleChange={(questions) => { questionsTouched(questions) }}
                                                        showCorrectAfterAnswer
                                                        language="BM"
                                                    />
                                                    :
                                                    <QuestionList
                                                        questions={notEmptyLength(questions) ? questions : []}
                                                        index={(page - 1) * PAGE_SIZE}
                                                        itemClassName="margin-bottom-md box-shadow-thin round-border border-white"
                                                        handleChange={(questions) => { questionsTouched(questions) }}
                                                        showCorrectAfterAnswer
                                                        language="EN"
                                                    />
                                                }
                                            </div>
                                        </Mobile>

                                    </Col>
                                    <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                                        <div className='width-100 flex-justify-center flex-items-align-center'>
                                            <Pagination current={page} total={total} onChange={(page) => { setPage(page); window.scroll(0, 0) }} showQuickJumper />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={0} sm={0} md={0} lg={4} xl={4}>
                                <Row>
                                    <Col span={24}>
                                        <img style={{ width: '100%' }} src={adsImg}></img>
                                        <div className="advertisement-overlay">
                                            <a href="/newcar" style={{ color: 'rgba(0,0,0,0.65' }}> <p> Ads <Icon type="info-circle" /> </p>  </a>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <img style={{ width: '100%', marginTop: '10px' }} src={adsImg2}></img>
                                        <div className="advertisement-overlay">
                                            <a href="/newcar" style={{ color: 'rgba(0,0,0,0.65' }}> <p> Ads <Icon type="info-circle" /> </p>  </a>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            </LayoutV2>
        </React.Fragment>
    )

}

const mapStateToProps = state => ({
    app: state.app,
    kpp: state.kpp,
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
    fetchRevisionAnsweredQuestions: fetchRevisionAnsweredQuestions,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KPPRevision));