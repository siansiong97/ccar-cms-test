import { Button, Col, Divider, Empty, Icon, message, Modal, Row } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import client from '../../feathers';
import Question from './question';
import LayoutV2 from '../general/LayoutV2';
import { notEmptyLength } from '../../common-function';
import { updateActiveMenu } from '../../redux/actions/app-actions';
import CustomTabs from '../general/CustomTabs';
import { withRouter } from 'next/router';



const banner = 'hands-on-wheel.png'
const ads = '20-Car-Dealership-Promotion-Ideas.jpg'


const KPPIndex = (props) => {
    const [loading, setLoading] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [questions, setQuestions] = useState([])
    const [showAnswer, setShowAnswer] = useState(false)
    const [showEnRevisionModal, setShowEnRevisionModal] = useState(false)
    const [showBmRevisionModal, setShowBmRevisionModal] = useState(false)
    useEffect(() => {
        props.updateActiveMenu('11');
        // setLoading(true)
        getQuestions();
        
    }, [])

    const getQuestions = () => {

        axios.get(`${client.io.io.uri}randomKppQuestions`, {
            params: {
                $match: {
                    language: 'EN',
                },
                $sort: {
                    weight: -1,
                    createdAt: -1,
                },
                limit: 1,
            }
        }).then(res => {
            setShowAnswer(false)
            if (notEmptyLength(res.data.data)) {
                setQuestions(res.data.data);
            } else {
                setQuestions([]);
            }

        }).catch(err => {
            message.error(err.message)
        });
    }


    const handlePage = () => {

        switch (tabIndex) {
            case 0:
                setShowEnRevisionModal(true);
                break;
            case 1:
                setShowBmRevisionModal(true);
                break;
            case 2:
                props.router.push('/kpp/kpp-en');
                break;
            case 3:
                props.router.push('/kpp/kpp-bm');
                break;

            default:
                break;
        }
    }

    const _renderBanner = () => {
        let tabs = ['Revision', 'Ulang Kaji', 'KPP Test (EN)', 'Ujian Kpp (BM)'];
        let tabPanels = ['Come with questions and answers to help you study effectively', 'Lengkap dengan soalan dan jawapan untuk membantu anda belajar dengan lebih efektif', 'English KPP Test Paper', 'Kertas Ujian KPP Bahasa Melayu'];

        tabs = _.map(tabs, function (tab) {
            return <div className='flex-justify-center flex-items-align-center white fill-parent subtitle1 font-weight-bold'>
                {tab}
            </div>
        })

        tabPanels = _.map(tabPanels, function (tabPanel) {
            return <div className='flex-justify-center flex-items-align-center white fill-parent subtitle1 padding-md'>
                {tabPanel}
                {/* {_.upperCase(props.language) == 'BM' ? 
                <div className='fill-parent flex-justify-center flex-items-align-center'>
                    <Button onClick={(e) => { handlePage() }} shape="round" className="padding-x-xl background-ccar-yellow border-ccar-yellow white font-weight-bold subtitle1"> Mula </Button>
                </div>
                :
                <div className='fill-parent flex-justify-center flex-items-align-center'>
                    <Button onClick={(e) => { handlePage() }} shape="round" className="padding-x-xl background-ccar-yellow border-ccar-yellow white font-weight-bold subtitle1"> Mula </Button>
                </div>
                } */}
            </div>
        })
        return (
            <React.Fragment>
                <div className='relative-wrapper fill-parent' style={{ height: '450px' }}>
                    <img src={banner} className='fill-parent absolute-center'></img>
                    {/* <div className='fill-parent absolute-center background-black opacity-60'>
                    </div> */}
                    <div className='fill-parent absolute-center padding-lg flex-items-align-center'>
                        <Row type="flex" justify="center" align="middle" gutter={[0, 20]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className='fill-parent h5 font-weight-bold white text-align-center opacity-100 flex-justify-center flex-items-align-center'>
                                    {_.upperCase(props.handleChange) == 'BM' ? 'Ujian Komputer Lesen Memandu' : 'Driving License Computer Test'}
                                </div>
                            </Col>
                            {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className='fill-parent h6 font-weight-bold white text-align-center opacity-100 flex-justify-center flex-items-align-center'>
                                    Choose Your Language
                                </div>
                            </Col> */}
                            <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                                <div className='fill-parent flex-justify-center flex-items-align-center padding-x-lg'>
                                    <CustomTabs
                                        tabs={tabs}
                                        tabPanels={tabPanels}
                                        selectedTabClassName="background-ccar-yellow"
                                        tabContainerClassName="flex-justify-space-between flex-items-align-stretch border-bottom-ccar-yellow"
                                        tabClassName="cursor-pointer"
                                        tabStyle={{ width: '33.33%', height: '70px' }}
                                        handleChange={(index) => {  setTabIndex(index) }}
                                        className="width-90" />
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                                <Row style={{marginBottom:'6px'}}>
                                    <Col span={24} style={{textAlign:'center'}} >
                                    <p style={{color:'#ffffff', marginBottom:'2px'}}> Come with questions and answers to help you study effectively </p>
                                    <Button onClick={(e) => {setShowEnRevisionModal(true)}} style={{marginLeft:'-11px', width:'129px'}} type="primary"> Revision </Button>
                                    </Col>
                                    {/* <Col span={6}>
                                    <Button onClick={(e) => {setShowEnRevisionModal(true)}} style={{marginLeft:'-11px', width:'129px'}} type="primary"> Revision </Button>
                                    </Col> */}
                                </Row>
                                <Row style={{marginBottom:'6px'}}>
                                    <Col span={24} style={{textAlign:'center'}}>
                                    <p style={{color:'#ffffff', marginBottom:'2px'}}> Lengkap dengan soalan dan jawapan untuk membantu anda belajar dengan lebih efektif </p>
                                    <Button onClick={(e) => {setShowBmRevisionModal(true)}} type="primary" style={{marginLeft:'-11px', width:'129px'}}> Ulang Kaji </Button>
                                    </Col>
                                    {/* <Col span={6}>
                                    <Button onClick={(e) => {setShowBmRevisionModal(true)}} type="primary" style={{marginLeft:'-11px', width:'129px'}}> Ulang Kaji </Button>
                                    </Col> */}
                                </Row>
                                <Divider style={{marginTop:'10px', marginBottom:'10px', color:'#ffffff'}}/>
                                <Row style={{marginBottom:'6px'}}>
                                    <Col span={24} style={{textAlign:'center'}}>
                                    <p style={{color:'#ffffff', marginBottom:'2px'}}> English KPP Test Paper </p>
                                    <Button onClick={(e) => {props.router.push('/kpp/kpp-en')}} style={{marginLeft:'-11px', width:'129px'}} type="primary"> KPP Test (EN) </Button>
                                    </Col>
                                    {/* <Col span={6}>
                                    <Button onClick={(e) => {props.router.push('/kpp/kpp-en')}} style={{marginLeft:'-11px', width:'129px', marginTop:'-6px'}} type="primary"> KPP Test (EN) </Button>
                                    </Col> */}
                                </Row>
                                <Row style={{marginBottom:'6px'}}>
                                    <Col span={24} style={{textAlign:'center'}}>
                                    <p style={{color:'#ffffff', marginBottom:'2px'}}> Kertas Ujian KPP Bahasa Melayu </p>
                                    <Button onClick={(e) => {props.router.push('/kpp/kpp-bm')}} style={{marginLeft:'-12px'}} type="primary"> Ujian Kpp (BM) </Button>
                                    </Col>
                                    {/* <Col span={6}>
                                    <Button onClick={(e) => {props.router.push('/kpp/kpp-bm')}} style={{marginLeft:'-12px'}} type="primary"> Ujian Kpp (BM) </Button>
                                    </Col> */}
                                </Row>
                            </Col>

                            <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                                <div className='fill-parent flex-justify-center flex-items-align-center'>
                                    <Button onClick={(e) => { handlePage() }} shape="round" className="padding-x-xl background-yellow border-ccar-yellow black font-weight-bold subtitle1">{tabIndex == 1 || tabIndex == 3 ? 'Mula' : 'Start'}</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        )
    }


    const _renderQuestion = (question) => {
        if (notEmptyLength(question)) {
            return (
                <React.Fragment>
                    <div className='background-white thin-border width-100'>
                        <div className="background-yellow flex-items-align-center padding-md flex-justify-space-between">
                            <span className='d-inline-block headline black padding-x-sm' >
                                Quiz
                        </span>
                            <span className='d-inline-block padding-x-sm cursor-pointer' onClick={(e) => {getQuestions()}} >
                                <Icon type="redo" className='red' />
                            </span>
                        </div>
                        <div>
                            <Question question={question} showCorrectAnswer={showAnswer} handleAnswer={(e) => { setShowAnswer(true) }} />
                        </div>
                    </div>
                </React.Fragment>
            );
        } else {
            return <Empty></Empty>
        }
    }

    return (
        <React.Fragment>
            <LayoutV2>
                <div className='section'>
                    <div className='container'>
                        <Row type="flex" justify="center"  gutter={[10, 0]}>
                            <Col className='margin-bottom-md ' xs={24} sm={24} md={24} lg={18} xl={18}>
                                {_renderBanner()}
                            </Col>
                            <Col xs={{span:24, offsetTop:'10px'}} sm={{span:24, offsetTop:'10px'}} md={{span:24, offsetTop:'0px'}} lg={{span:6, offsetTop:'0px'}} xl={{span:6, offsetTop:'0px'}}>
                                {_renderQuestion(questions[0])}
                                <div className='margin-top-md relative-wrapper' style={{ height: '160px' }}>
                                    <img src={ads} className='fill-parent absolute-center'></img>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Modal
                    visible={showEnRevisionModal}
                    centered
                    maskClosable
                    footer={null}
                    closable={false}
                    maskStyle={{
                        backdropFilter: 'blur(4px)'
                    }}
                    onCancel={(e) => { setShowEnRevisionModal(false) }}
                >
                    <div className='padding-xs'>
                        <Row type="flex" align="middle" gutter={[10, 20]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className='flex-justify-center flex-items-align-center subtitle1 font-weight-bold black'>
                                    TOPIC
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                                <div className='flex-justify-center flex-items-align-center subtitle1 black'>
                                    We are using question sets from real test sheet provided by KPP (Kurikulum Pendidikan Pemandu) which approved by Jabatan Pengangkutan Jalan Malaysia.
                                </div>
                            </Col>

                            <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                                <div className='flex-justify-space-around flex-items-align-center padding-top-md'>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/0/en') }}>Section A</Button>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/1/en') }}>Section B</Button>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/2/en') }}>Section C</Button>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                                <div className='flex-justify-space-around flex-items-align-center padding-top-md'>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/0/en') }}>Section A</Button>
                                </div>
                                <div className='flex-justify-space-around flex-items-align-center padding-top-md'>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/1/en') }}>Section B</Button>
                                </div>
                                <div className='flex-justify-space-around flex-items-align-center padding-top-md'>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/2/en') }}>Section C</Button>
                                </div>
                            </Col>

                        </Row>
                    </div>
                </Modal>
                <Modal
                    visible={showBmRevisionModal}
                    centered
                    maskClosable
                    footer={null}
                    closable={false}
                    maskStyle={{
                        backdropFilter: 'blur(4px)'
                    }}
                    onCancel={(e) => { setShowBmRevisionModal(false) }}
                >
                    <div className='padding-xs'>
                        <Row type="flex" align="middle" gutter={[10, 20]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className='flex-justify-center flex-items-align-center subtitle1 font-weight-bold black'>
                                    TOPIK
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                                <div className='flex-justify-center flex-items-align-center subtitle1 black'>
                                    Kami menggunakan set soalan ujian sebenar KPP (Kurikulum Pendidikan Pemandu) yang diluluskan oleh Jabatan Pengangkutan Jalan Malaysia.
                                </div>
                            </Col>

                            <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                                <div className='flex-justify-space-around flex-items-align-center padding-top-md flex-wrap'>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/0/bm') }}>Bahagian A</Button>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/1/bm') }}>Bahagian B</Button>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/2/bm') }}>Bahagian C</Button>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                                <div className='flex-justify-space-around flex-items-align-center padding-top-md'>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/0/bm') }}>Bahagian A</Button>
                                </div>
                                <div className='flex-justify-space-around flex-items-align-center padding-top-md'>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/1/bm') }}>Bahagian B</Button>
                                </div>
                                <div className='flex-justify-space-around flex-items-align-center padding-top-md'>
                                    <Button className='border-ccar-yellow background-ccar-yellow white font-weight-bold' onClick={(e) => { props.router.push('/kpp/kpp-revision/2/bm') }}>Bahagian C</Button>
                                </div>
                            </Col>

                        </Row>
                    </div>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KPPIndex));