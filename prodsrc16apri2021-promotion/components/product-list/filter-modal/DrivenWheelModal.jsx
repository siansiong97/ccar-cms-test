import { CloseOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Form, Icon, Input, Modal, Row } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';
import { formatNumber, isValidNumber, notEmptyLength } from '../../../common-function';
import { drivenWheelList } from '../../../params/drivenWheelList';

const drivenwheelModalSearchRef = React.createRef();

const DrivenWheelModal = (props) => {
    const [options, setOptions] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const [filteredOptions, setFilteredOptions] = useState([])

    useEffect(() => {
        if (props.options != null && _.isArray(props.options)) {

            let data = _.compact(_.map(drivenWheelList, function (drivenWheel) {
                let selectedOption = _.find(props.options, function (item) {
                    return _.toLower(item.value) == _.toLower(drivenWheel.value);
                })
                if (selectedOption) {
                    drivenWheel.count = selectedOption.count;
                    return drivenWheel;
                } else {
                    return null;
                }
            }))
            setOptions(data)
        } else {
            setOptions([]);
        }
    }, [props.options])

    useEffect(() => {

        if (props.visible == true && drivenwheelModalSearchRef.current) {
            drivenwheelModalSearchRef.current.focus();
        }

        if (!props.visible) {
            setSearchKeyword('');
        }

    }, [props.visible, drivenwheelModalSearchRef.current])

    useEffect(() => {
        if (_.isArray(options) && notEmptyLength(options)) {
            let data = _.filter(options, function (option) {
                if (searchKeyword) {
                    let keyword = new RegExp(searchKeyword, 'i');
                    return keyword.test(option.value) && option.count > 0;
                } else {
                    return true;
                }
            })
            setFilteredOptions(data)
        } else {
            setFilteredOptions([]);
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
                id={props.id ? props.id : 'driven-wheel-modal'}
                zIndex={isValidNumber(parseInt(props.zIndex)) ? parseInt(props.zIndex) : 1000}
                footer={null}>
                <Card
                    title={props.title ? props.title : "Select Car Driven Wheel"}
                    size="small"
                    style={{ zIndex: 1001 }}
                >
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="thin-border round-border-big padding-sm">
                                <Input ref={drivenwheelModalSearchRef} autoFocus value={searchKeyword} onChange={(e) => { setSearchKeyword(e.target.value) }} className='no-border-input' size="small" compact
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
                            <div style={{ ...props.bodyStyle, overflowY: 'auto' }}>
                                {
                                    filteredOptions.length > 0 ?
                                        filteredOptions.map((item, index) => {
                                            return (
                                                <div style={{ margin: '10px 0px' }} key={index}>
                                                    <Row
                                                        key={index}
                                                        // gutter={[10, 10]} 
                                                        className={_.toLower(props.selectedValue) == _.toLower(item.value) ? "selectedRow" : "selectRow"}
                                                        onClick={() => selectedValue(item.value, index)}
                                                        style={{ height: '3.5em', lineHeight: '3.5em' }}>
                                                        <Col span={5} style={{ height: '100%', padding: 5, lineHeight: 0 }}>
                                                            <img className="w-100 h-100 obj-fit-c" src={item.icon} />
                                                        </Col>
                                                        <Col span={12} style={{ height: '100%' }}>
                                                            <Highlighter
                                                                style={{ padding: '0px 10px', textTransform: 'capitalize', whiteSpace: 'noWrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                                                searchWords={[searchKeyword]}
                                                                autoEscape
                                                                textToHighlight={item.value}
                                                            />
                                                        </Col>
                                                        <Col span={7} style={{ height: '100%' }}>
                                                            <div className="fill-parent flex-justify-end flex-items-align-center">
                                                                {`(${isValidNumber(item.count) ? formatNumber(item.count, null, false, 0, true) : 0})`}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            );
                                        })
                                        :
                                        <div style={{ height: '100%' }}>
                                            <Empty
                                                style={{ position: 'relative' }}
                                                image="/empty.png"
                                                imageStyle={{
                                                    height: 60,
                                                }
                                                }
                                                description={<span>No Result</span>}
                                            >
                                            </Empty>
                                        </div>
                                }
                            </div>
                        </Col>
                    </Row>
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(DrivenWheelModal)));