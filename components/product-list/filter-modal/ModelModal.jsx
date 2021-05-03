import { CloseOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Form, Icon, Input, Modal, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { formatNumber, isValidNumber, notEmptyLength } from '../../../common-function';
import Loading from '../../general/Loading';


const modelModalSearchRef = React.createRef();

const ModelModal = (props) => {
    const [options, setOptions] = useState([])
    const [filteredOptions, setFilteredOptions] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')

    useEffect(() => {

        if (props.options != null && _.isArray(props.options) && notEmptyLength(props.options)) {
            let uniqBodyTypes = _.cloneDeep(_.uniqBy(props.options, 'bodyType').map((v, i) => {
                v.data = []
                return v
            }))

            uniqBodyTypes = uniqBodyTypes.map((v) => {
                props.options.map((v1) => {
                    if (v.bodyType == v1.bodyType) {
                        v.data.push(v1)
                    }
                })
                v.data = _.reverse(_.sortBy(v.data, ['count', 'model']))
                return v;
            })
            setOptions(uniqBodyTypes)
        } else {
            setOptions([]);
        }
    }, [props.options])

    useEffect(() => {

        if (props.visible == true && modelModalSearchRef.current) {
            modelModalSearchRef.current.focus();
        }

        if (!props.visible) {
            setSearchKeyword('');
        }

    }, [props.visible, modelModalSearchRef.current])

    useEffect(() => {

        if (searchKeyword) {
            let keyword = new RegExp(searchKeyword, 'i');
            let temp = _.cloneDeep(options).filter(function (item) {
                item.data = item.data.filter(function (item1) {
                    return keyword.test(item1.model) && item1.count > 0;
                });
                return notEmptyLength(item.data);
            })
            setFilteredOptions(temp)
        } else {
            setFilteredOptions(options)
        }
    }, [options, searchKeyword])

    const selectedValue = (item, alphaIndex, index) => {
        if (props.onChange) {
            props.onChange(item, alphaIndex, index);
        }
    }

    return (
        <React.Fragment>
            <Modal
                closable={props.closable != null ? props.closable ? true : false : false}
                maskClosable={props.maskClosable != null ? props.maskClosable ? true : false : false}
                visible={props.visible != null ? props.visible ? true : false : false}
                style={{ ...props.style }} onCancel={props.onCancel}
                className={`${props.className ? props.className : ''}`}
                width={props.width ? props.width : '100%'}
                id={props.id ? props.id : 'model-modal'}
                zIndex={isValidNumber(parseInt(props.zIndex)) ? parseInt(props.zIndex) : 1000}
                footer={null}>
                <Card
                    bordered={false}
                    title={props.title ? props.title : "Select Car Model"}
                    size="small"
                    style={{ zIndex: 1001 }}
                >
                    <Loading spinning={props.loading}>

                        <Row>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="thin-border round-border-big padding-sm">
                                    <Input ref={modelModalSearchRef} autoFocus value={searchKeyword} onChange={(e) => { setSearchKeyword(e.target.value) }} className='no-border-input' size="small" compact
                                        suffix={
                                            searchKeyword ?
                                                <CloseOutlined
                                                    className='cursor-pointer'
                                                    onClick={(e) => { setSearchKeyword('') }} />
                                                :
                                                <Icon type="search" />
                                        } placeholder="Search Here..." />
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[15, 15]}>
                            <Col className="gutter-row" xs={0} sm={0} md={24} lg={24} xl={24}>
                                <Scrollbars autoHide autoHeight autoHeightMax={_.get(props, ['bodyStyle', 'maxHeight']) || 500}>
                                    <div>
                                        {
                                            filteredOptions.length > 0 ?
                                                filteredOptions.map((item, index) => {
                                                    return (
                                                        <div style={{ margin: '10px 0px' }} key={index} >
                                                            <p className="font-weight-bold black" style={{ fontSize: '16px', textAlign: 'left', textTransform: 'capitalize' }}>{item.bodyType}</p>
                                                            {item.data.map((v, i) => {
                                                                return (
                                                                    <div className="flex-justify-space-between flex-items-align-center cursor-pointer"
                                                                        key={i}
                                                                        onClick={() => selectedValue(v.model, index, i)}>
                                                                        <span className='flex-justify-start flex-items-align-center width-70 padding-right-md' >
                                                                            <img className="obj-fit-c margin-right-md" style={{ width: 50, height: 50 }} src={v.uri} />
                                                                            <span className='d-inline-block text-overflow-break uppercase' >
                                                                                <Highlighter
                                                                                    style={{ textTransform: 'uppercase', textOverflow: 'break-word' }}
                                                                                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                                                                    searchWords={[searchKeyword]}
                                                                                    autoEscape
                                                                                    textToHighlight={v.model}
                                                                                />
                                                                            </span>
                                                                        </span>
                                                                        <span className='d-inline-block width-30 text-align-right' >
                                                                            {`(${isValidNumber(v.count) ? formatNumber(v.count, null, false, 0, true) : 0})`}
                                                                        </span>
                                                                    </div>
                                                                    // <Row
                                                                    //     // gutter={[10, 10]} 
                                                                    //     className={_.toLower(props.selectedValue) == _.toLower(v.model) ? "selectedRow" : "selectRow"}
                                                                    //     onClick={() => selectedValue(v.model, index, i)}
                                                                    //     style={{ height: '5em', lineHeight: '5em' }}>
                                                                    //     <Col span={8} style={{ height: '100%', padding: 5, lineHeight: 0 }}>
                                                                    //         <img className="w-100 h-100 obj-fit-c" src={v.uri} />
                                                                    //     </Col>
                                                                    //     <Col span={10} style={{ height: '100%' }}>
                                                                    //     </Col>
                                                                    //     <Col span={4} style={{ height: '100%' }}>
                                                                    //         <div className="fill-parent flex-justify-end flex-items-align-center">
                                                                    //         </div>
                                                                    //     </Col>
                                                                    // </Row>
                                                                )
                                                            })}
                                                        </div>
                                                    );
                                                })
                                                :
                                                <div style={{ height: '100%' }}>
                                                    <Empty
                                                        style={{ position: 'relative' }}
                                                        image="/empty.png"
                                                        imageStyle={{ height: 60 }}
                                                        description={<span>{props.loading ? 'Getting Result' : 'No Result'}</span>}
                                                    >
                                                    </Empty>
                                                </div>
                                        }
                                    </div>
                                </Scrollbars>
                            </Col>

                        </Row>
                    </Loading>
                </Card>
            </Modal>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    productsList: state.productsList,
    app: state.app,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ModelModal)));