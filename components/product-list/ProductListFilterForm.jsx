import { CloseOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Card, Col, Form, Icon, Input, Radio, Row, Select, Tooltip } from 'antd';
import axios from 'axios';
import _, { isObject } from 'lodash';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { convertRangeFormatBack, convertToRangeFormat, formatNumber, isValidNumber, notEmptyLength, objectRemoveEmptyValue } from '../../common-function';
import client from '../../feathers';
import { carspecNotFoundImage, cnyLionHead } from '../../icon';
import { getBodyType } from '../../params/bodyTypeList';
import { getCarBrand } from '../../params/carBrandsList';
import { getColor } from '../../params/colorList';
import { getDrivenWheel } from '../../params/drivenWheelList';
import { getFuelType } from '../../params/fuelTypeList';
import { getState } from '../../params/stateList';
import { clearProductFilterOptions, fetchFilterModalState, fetchProductFilterOptions } from '../../redux/actions/productsList-actions';
import { withRouter } from 'next/dist/client/router';
import MakeModal from './filter-modal/MakeModal';
import ModelModal from './filter-modal/ModelModal';
import StateModal from './filter-modal/StateModal';
import AreaModal from './filter-modal/AreaModal';
import BodyTypeModal from './filter-modal/BodyTypeModal';
import FuelTypeModal from './filter-modal/FuelTypeModal';
import DrivenWheelModal from './filter-modal/DrivenWheelModal';
import ColorModal from './filter-modal/ColorModal';
import moment from 'moment';



const { Option } = Select;
const modalWidth = 250;
const moreOptionModalWidth = 200;
const modalMargin = 20;
const containerRef = React.createRef();
const formRef = React.createRef();
const moreOptionButtonRef = React.createRef();
const moreOptionModalRef = React.createRef();
const makeInputRef = React.createRef();
const modelInputRef = React.createRef();
const stateInputRef = React.createRef();
const bodyTypeInputRef = React.createRef();
const drivenwheelInputRef = React.createRef();
const colorInputRef = React.createRef();
const fuelTypeInputRef = React.createRef();

const makeCloseInputRef = React.createRef();
const modelCloseInputRef = React.createRef();
const stateCloseInputRef = React.createRef();
const areaCloseInputRef = React.createRef();
const bodyTypeCloseInputRef = React.createRef();
const drivenwheelCloseInputRef = React.createRef();
const colorCloseInputRef = React.createRef();
const fuelTypeCloseInputRef = React.createRef();

let latestYear = moment().year();
let yearRange = latestYear - 1990 + 1;
let years = [];
_.forEach(_.range(0, yearRange), function (index) {
    years.push(`${latestYear - index}`);
})
// const years = [2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990]

const prices = ['5000000', '4000000', '3000000', '2000000', '1000000', '950000', '900000', '850000', '800000', '750000', '700000', '650000', '600000', '550000', '500000', '450000', '400000', '350000', '300000', '275000', '250000', '225000', '200000', '175000', '150000', '125000', '100000', '90000', '80000', '70000', '60000', '50000', '40000', '30000', '20000', '10000']

const mileages = ['500000', '450000', '400000', '350000', '300000', '275000', '250000', '225000', '200000', '175000', '150000', '125000', '100000', '90000', '80000', '70000', '60000', '50000', '40000', '30000', '20000', '10000']

const engineCapacities = ['4', '3.5', '3', '2.5', '2', '1.5', '1', '0.1']

const modals = ['make', 'model', 'state', 'area', 'bodyType', 'color', 'fuelType'];
const optionsFields = ['title', 'transmission', 'make', 'model', 'state', 'area', 'year', 'price', 'mileage', 'engineCapacity', 'bodyType', 'color', 'fuelType'];
let inputRefs = {};
for (let index = 0; index < optionsFields.length; index++) {
    inputRefs[optionsFields[index] + 'Ref'] = React.createRef();
}


const ProductsListFilterForm = (props) => {

    const [title, setTitle] = useState('')
    const [moreOptionModalVisible, setMoreOptionModalVisible] = useState(false)
    const [makeModalVisible, setMakeModalVisible] = useState(false)
    const [modelModalVisible, setModelModalVisible] = useState(false)
    const [stateModalVisible, setStateModalVisible] = useState(false)
    const [areaModalVisible, setAreaModalVisible] = useState(false)
    const [bodyTypeModalVisible, setBodyTypeModalVisible] = useState(false)
    const [drivenwheelModalVisible, setDrivenWheelModalVisible] = useState(false)
    const [colorModalVisible, setColorModalVisible] = useState(false)
    const [fuelTypeModalVisible, setFuelTypeModalVisible] = useState(false)

    const [fieldThatShowRangeTitle, setFieldThatShowRangeTitle] = useState('year')
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const [collapseFields, setCollapseFields] = useState([])
    const [containerHeight, setContainerHeight] = useState(400)
    const [formActualHeight, setFormActualHeight] = useState();
    const [filterGroup, setFilterGroup] = useState({})
    const [dropDownSearchValue, setDropDownSearchValue] = useState({});
    const [dropDownOptions, setDropDownOptions] = useState({
        minYears: _.reverse(_.cloneDeep(years)),
        maxYears: years,
        minPrices: _.reverse(_.cloneDeep(prices)),
        maxPrices: prices,
        minMileages: _.reverse(_.cloneDeep(mileages)),
        maxMileages: mileages,
        minEngineCapacities: _.reverse(_.cloneDeep(engineCapacities)),
        maxEngineCapacities: engineCapacities,

    });
    const [origOptions, setOrigOptions] = useState({
        makeList: [],
        modelList: [],
        stateList: [],
        areaList: [],
        conditionList: [],
        transmissionList: [],
        yearList: [],
        priceList: [],
        mileageList: [],
        bodyTypeList: [],
        drivenWheelList: [],
        colorList: [],
        fuelTypeList: [],
    })
    const [modelOptions, setModelOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const [modelLoading, setModelLoading] = useState(false);
    //Use for collapse filter fields
    const [initFormConfig, setInitFormConfig] = useState();
    const [startWatching, setStartWatching] = useState(false);

    useEffect(() => {
        setStartWatching(false);
        setFilterGroup(_.isPlainObject(props.initFilterGroup) && !_.isEmpty(props.initFilterGroup) ? props.initFilterGroup : {});
        setTimeout(() => {
            setStartWatching(true);
        }, 500);
    }, [props.initFilterGroup])

    useEffect(() => {
        if (!_.isPlainObject(props.productsList.filterOptions) || _.isEmpty(props.productsList.filterOptions)) {
            getOrigOptions();
        }
    }, []);
    
    useEffect(() => {

        if (filterGroup.title) {
            setTitle(filterGroup.title);
        } else {
            setTitle('');
        }

        let dropdownsearch = {};

        if (_.get(filterGroup, 'yearRange[0]')) {
            dropdownsearch.minYear = `${_.get(filterGroup, 'yearRange[0]')}`;
        }
        if (_.get(filterGroup, 'yearRange[1]')) {
            dropdownsearch.maxYear = `${_.get(filterGroup, 'yearRange[1]')}`;
        }

        if (_.get(filterGroup, 'priceRange[0]')) {
            dropdownsearch.minPrice = `${_.get(filterGroup, 'priceRange[0]')}`;
        }
        if (_.get(filterGroup, 'priceRange[1]')) {
            dropdownsearch.maxPrice = `${_.get(filterGroup, 'priceRange[1]')}`;
        }

        if (_.get(filterGroup, 'mileageRange[0]')) {
            dropdownsearch.minMileage = `${_.get(filterGroup, 'mileageRange[0]')}`;
        }
        if (_.get(filterGroup, 'mileageRange[1]')) {
            dropdownsearch.maxMileage = `${_.get(filterGroup, 'mileageRange[1]')}`;
        }

        if (_.get(filterGroup, 'engineCapacityRange[0]')) {
            dropdownsearch.minEngineCapacity = `${_.get(filterGroup, 'engineCapacityRange[0]')}`;
        }
        if (_.get(filterGroup, 'engineCapacityRange[1]')) {
            dropdownsearch.maxEngineCapacity = `${_.get(filterGroup, 'engineCapacityRange[1]')}`;
        }
        setDropDownSearchValue(dropdownsearch);
        setDropDownOptions(getFilteredDropDownOptions() || []);



        if (props.onChange && startWatching) {
            controlModalOpen();
            let data = _.cloneDeep(filterGroup);
            data = objectRemoveEmptyValue(data)
            props.onChange(data);
        }


    }, [filterGroup])

    useEffect(() => {
        setOrigOptions(_.isPlainObject(props.productsList.filterOptions) && !_.isEmpty(props.productsList.filterOptions) ? props.productsList.filterOptions : {});
    }, [props.productsList.filterOptions]);

    useEffect(() => {

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [makeModalVisible, modelModalVisible, stateModalVisible, areaModalVisible, bodyTypeModalVisible, colorModalVisible, fuelTypeModalVisible, drivenwheelModalVisible, isDropDownOpen])

    useEffect(() => {
        props.fetchFilterModalState(isModalOpen())
    }, [makeModalVisible, modelModalVisible, stateModalVisible, areaModalVisible, bodyTypeModalVisible, colorModalVisible, fuelTypeModalVisible, drivenwheelModalVisible])



    useEffect(() => {
        if (filterGroup.make) {
            getModelOptions(!_.isPlainObject(props.availableFilterOption) || !_.isArray(props.availableFilterOption.modelList) || _.isEmpty(props.availableFilterOption.modelList) ? [] : props.availableFilterOption.modelList);
        }
    }, [props.availableFilterOption, filterGroup])



    useEffect(() => {
    }, [moreOptionModalVisible])


    function handleClickOutside(event) {

        if ((!moreOptionModalRef.current || !moreOptionModalRef.current.contains(event.target)) && (!containerRef.current || !containerRef.current.contains(event.target)) && !isModalOpen() && !isDropDownOpen) {
            setMoreOptionModalVisible(false)
        }
    }

    function getFilteredDropDownOptions() {
        let newDropDownOptions = {
            minYears: _.reverse(_.cloneDeep(years)),
            maxYears: years,
            minPrices: _.reverse(_.cloneDeep(prices)),
            maxPrices: prices,
            minMileages: _.reverse(_.cloneDeep(mileages)),
            maxMileages: mileages,
            minEngineCapacities: _.reverse(_.cloneDeep(engineCapacities)),
            maxEngineCapacities: engineCapacities,
        };
        if (_.get(filterGroup, 'yearRange[0]')) {
            newDropDownOptions.maxYears = _.filter(newDropDownOptions.maxYears || [], function (item) {
                let value = parseFloat(_.get(filterGroup, 'yearRange[0]'));
                return parseFloat(item) > value;
            })

        }
        if (_.get(filterGroup, 'yearRange[1]')) {
            newDropDownOptions.minYears = _.filter(newDropDownOptions.minYears || [], function (item) {
                let value = parseFloat(_.get(filterGroup, 'yearRange[1]'));
                return parseFloat(item) < value;
            })
        }

        if (_.get(filterGroup, 'priceRange[0]')) {
            newDropDownOptions.maxPrices = _.filter(newDropDownOptions.maxPrices || [], function (item) {
                let value = parseFloat(_.get(filterGroup, 'priceRange[0]'));
                return parseFloat(item) > value;
            })
        }
        if (_.get(filterGroup, 'priceRange[1]')) {
            newDropDownOptions.minPrices = _.filter(newDropDownOptions.minPrices || [], function (item) {
                let value = parseFloat(_.get(filterGroup, 'priceRange[1]'));
                return parseFloat(item) < value;
            })
        }

        if (_.get(filterGroup, 'mileageRange[0]')) {
            newDropDownOptions.maxMileages = _.filter(newDropDownOptions.maxMileages || [], function (item) {
                let value = parseFloat(_.get(filterGroup, 'mileageRange[0]'));
                return parseFloat(item) > value;
            })
        }
        if (_.get(filterGroup, 'mileageRange[1]')) {
            newDropDownOptions.minMileages = _.filter(newDropDownOptions.minMileages || [], function (item) {
                let value = parseFloat(_.get(filterGroup, 'mileageRange[1]'));
                return parseFloat(item) < value;
            })
        }

        if (_.get(filterGroup, 'engineCapacityRange[0]')) {
            newDropDownOptions.maxEngineCapacities = _.filter(newDropDownOptions.maxEngineCapacities || [], function (item) {
                let value = parseFloat(_.get(filterGroup, 'engineCapacityRange[0]'));
                return parseFloat(item) > value;
            })
        }
        if (_.get(filterGroup, 'engineCapacityRange[1]')) {
            newDropDownOptions.minEngineCapacities = _.filter(newDropDownOptions.minEngineCapacities || [], function (item) {
                let value = parseFloat(_.get(filterGroup, 'engineCapacityRange[1]'));
                return parseFloat(item) < value;
            })
        }

        return newDropDownOptions

    }

    function getOrigOptions() {

        let promises = [];
        _.forEach(modals, function (modal) {
            promises.push(
                axios.get(`${client.io.io.uri}brandFilterTotalV3`, {
                    params: { filterType: modal },
                    headers: { 'Authorization': client.settings.storage.storage.storage['feathers-jwt'] }
                })
            )
        })

        Promise.all(promises).then((responses) => {
            if (_.isArray(responses) && !_.isEmpty((responses))) {
                let options = {}
                _.forEach(responses, function (response, index) {
                    options[`${modals[index]}List`] = response.data.uniqueInfo[`${modals[index]}List`];
                })

                props.fetchProductFilterOptions(options);
            }
        }).catch((err) => {
            // message.error(err.message);
        })

    }

    function getModelOptions(models) {

        if (_.isArray(models) && notEmptyLength(models) && filterGroup.make) {
            setModelOptions([]);
            setModelLoading(true);

            axios.get(`${client.io.io.uri}priceRangeSearchUsed`,
                {
                    params: {
                        match: {
                            make: filterGroup.make
                        },
                    }
                }
            ).then((res) => {
                setModelLoading(false);
                if (notEmptyLength(res.data.usedCarPrice)) {
                    let uniqModels = _.filter(_.cloneDeep(_.uniqBy(res.data.usedCarPrice, 'model')));
                    uniqModels = _.compact(_.map(uniqModels, function (model) {
                        let selectedOption = _.find(_.get(props.availableFilterOption, ['modelList']) || [], function (item) {
                            return _.toLower(item.value) == _.toLower(model.model);
                        })
                        if (selectedOption) {
                            model.count = selectedOption.count;
                            model.uri = model.uri || carspecNotFoundImage;
                            return model;
                        } else {
                            return null;
                        }
                    }))
                    setModelOptions(_.isArray(uniqModels) && notEmptyLength(uniqModels) ? uniqModels : []);
                } else {
                    setModelOptions([])
                }
            })
                .catch((err) => {
                    console.log(err);
                    setModelLoading(false);
                    setModelOptions([]);
                })
        } else {
            setModelOptions([]);
        }
    }


    function controlModalOpen(selectedModal) {
        _.forEach(modals, function (modal) {
            switch (modal) {
                case 'make':
                    setMakeModalVisible(selectedModal == modal);
                    break;
                case 'model':
                    setModelModalVisible(selectedModal == modal);
                    break;
                case 'state':
                    setStateModalVisible(selectedModal == modal);
                    break;
                case 'area':
                    setAreaModalVisible(selectedModal == modal);
                    break;
                case 'bodyType':
                    setBodyTypeModalVisible(selectedModal == modal);
                    break;
                case 'drivenwheel':
                    setDrivenWheelModalVisible(selectedModal == modal);
                    break;
                case 'color':
                    setColorModalVisible(selectedModal == modal);
                    break;
                case 'fuelType':
                    setFuelTypeModalVisible(selectedModal == modal);
                    break;
                default:
                    setMakeModalVisible(false);
                    setModelModalVisible(false);
                    setStateModalVisible(false);
                    setAreaModalVisible(false);
                    setBodyTypeModalVisible(false);
                    setDrivenWheelModalVisible(false);
                    setColorModalVisible(false);
                    setFuelTypeModalVisible(false);
                    break;
            }
        })
    }

    function isModalOpen() {
        let gotModalOpen = false;
        _.forEach(modals, function (modal, index) {
            switch (modal) {
                case 'make':
                    gotModalOpen = makeModalVisible;
                    break;
                case 'model':
                    gotModalOpen = modelModalVisible;
                    break;
                case 'state':
                    gotModalOpen = stateModalVisible;
                    break;
                case 'area':
                    gotModalOpen = areaModalVisible;
                    break;
                case 'bodyType':
                    gotModalOpen = bodyTypeModalVisible;
                    break;
                case 'drivenwheel':
                    gotModalOpen = drivenwheelModalVisible;
                    break;
                case 'color':
                    gotModalOpen = colorModalVisible;
                    break;
                case 'fuelType':
                    gotModalOpen = fuelTypeModalVisible;
                    break;
                default:
                    gotModalOpen = false;
                    break;
            }
            //Break Loop
            if (gotModalOpen) {
                return false;
            }
        });
        return gotModalOpen;
    }

    function resetFilterGroup() {
        setFilterGroup({});
    }

    const _renderRangeTitle = () => {
        return <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="width-100 flex-justify-center flex-items-align-center black headline">
                    Min
                </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="width-100 flex-justify-center flex-items-align-center black headline">
                    Max
                </div>
            </Col>
        </Row>
    }

    const _renderFormItem = (item) => {
        switch (item) {
            case 'title':
                return (
                    <React.Fragment>
                        <div className="padding-bottom-xs">
                            <Input
                                placeholder="Search Title"
                                suffix={
                                    <Icon type="search" className="cursor-pointer" onClick={(e) => {
                                        setFilterGroup({
                                            ...filterGroup,
                                            title: title,
                                        })
                                    }} />
                                }
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                }}
                                onPressEnter={(e) => {
                                    setFilterGroup({
                                        ...filterGroup,
                                        title: e.target.value
                                    })
                                }}
                            >
                            </Input>
                        </div>
                    </React.Fragment>
                );

            case 'condition':
                return (
                    <React.Fragment>

                        {/* <Row style={{ marginBottom: 5 }}>
                            <Col span={22} style={{ textAlign: "left" }}>
                                <label style={{ color: '#FBB040', fontWeight: '500', marginLeft: '10px' }}>Condition</label>
                            </Col>
                            <Col span={2}>
                                <CloseOutlined
                                    style={{ color: "grey", fontSize: '13px' }}
                                    className='cursor-pointer'
                                    onClick={(e) => { setFilterGroup({ ...filterGroup, condition: '' }) }}
                                />
                            </Col>
                        </Row> */}
                        <Form.Item style={{ margin: '0px', marginBottom: '0px', padding: '2px 2px 0px 0px' }}>
                            <Radio.Group className='condition-form ' style={{ textAlign: 'center', width: '100%', padding: '0px' }} value={filterGroup.condition || ''} onChange={(e) => { setFilterGroup({ ...filterGroup, condition: _.toLower(e.target.value) == _.toLower(filterGroup.condition) ? '' : _.toLower(e.target.value) }) }} >
                                <Row gutter={[10, 0]} type="flex" align="middle" justify="space-around" className='fill-parent'>
                                    {/* <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                <Radio.Button className="w-100" style={{ opacity: props.app.quickSearchProductadsData.condition === '' ? 1 : 0.5, backgroundColor: "", padding: 0 }} value="all">
                                                    <p style={{ fontSize: "10px", textAlign: "center", fontWeight: "bold" }}>All</p>
                                                </Radio.Button>
                                            </Col> */}
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Radio.Button className="w-100" style={{ backgroundColor: "", padding: 0 }} value="used" onClick={(e) => { if (filterGroup.condition == 'used') { setFilterGroup({ ...filterGroup, condition: '' }) } }}>
                                            <p style={{ fontSize: "10px", textAlign: "center", fontWeight: "bold" }}>USED</p>
                                        </Radio.Button>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Radio.Button className="w-100" style={{ backgroundColor: "", padding: 0 }} value="recon" onClick={(e) => { if (filterGroup.condition == 'recon') { setFilterGroup({ ...filterGroup, condition: '' }) } }}>
                                            <p style={{ fontSize: "10px", textAlign: "center", fontWeight: "bold" }}>RECON</p>
                                        </Radio.Button>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Radio.Button className="w-100" style={{ backgroundColor: "", padding: 0 }} value="new" onClick={(e) => { if (filterGroup.condition == 'new') { setFilterGroup({ ...filterGroup, condition: '' }) } }}>
                                            <p style={{ fontSize: "10px", textAlign: "center", fontWeight: "bold" }}>NEW</p>
                                        </Radio.Button>
                                    </Col>
                                </Row>
                            </Radio.Group>
                        </Form.Item>
                    </React.Fragment>
                );

            case 'transmission':
                return (
                    <React.Fragment>

                        <div className="padding-bottom-xs">
                            <Radio.Group className="w-100 condition-form" style={{ textAlign: 'center' }} value={filterGroup.transmission || ''} onChange={(e) => { setFilterGroup({ ...filterGroup, transmission: _.toLower(e.target.value) }) }} >
                                <Row type="flex" align="middle" justify="center" className='fill-parent' >
                                    <Col xs={24} sm={24} md={24} lg={10} xl={10} >
                                        {/* <Radio.Button className="w-100" style={{ padding: 0 }} value="Automatic"> <img src="/assets/transmission/Automatics.png" style={{ opacity: 0.6, width: '35%', height : '80%' }} ></img> </Radio.Button> */}
                                        <Radio.Button className={`w-100 `} style={{ padding: 0 }} value="automatic" onClick={(e) => { if (filterGroup.transmission == 'automatic') { setFilterGroup({ ...filterGroup, transmission: '' }) } }}> <p style={{ fontSize: "10px", textAlign: "center", fontWeight: "bold" }}> Automatic </p> </Radio.Button>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={{ span: 10, offset: 4 }} xl={{ span: 10, offset: 4 }} >
                                        {/* <Radio.Button className="w-100" style={{ padding: 0 }} value="Manual"> <img src="/assets/transmission/Manual.png" style={{ opacity: 0.6, width: '35%', height : '80%'  }} ></img> </Radio.Button> */}
                                        <Radio.Button className={`w-100 `} style={{ padding: 0 }} value="manual" onClick={(e) => { if (filterGroup.transmission == 'manual') { setFilterGroup({ ...filterGroup, transmission: '' }) } }}> <p style={{ fontSize: "10px", textAlign: "center", fontWeight: "bold" }}> Manual</p> </Radio.Button>
                                    </Col>
                                </Row>
                            </Radio.Group>
                        </div>
                    </React.Fragment>
                );

            case 'make':
                return (
                    <React.Fragment>
                        <div className="thin-border round-border-light border-ccar-yellow cursor-pointer flex-justify-space-between flex-items-align-center padding-x-md margin-bottom-xs"
                            style={{ height: 30 }}
                            ref={makeInputRef}
                            onClick={(e) => {
                                if (!makeCloseInputRef.current || !makeCloseInputRef.current.contains(e.target)) {
                                    controlModalOpen('make');
                                }
                            }}>
                            {
                                filterGroup.make ?
                                    <React.Fragment>
                                        <span className='d-inline-block' >
                                            {_.get(getCarBrand(filterGroup.make), ['value']) || ""}
                                        </span>
                                        <span className='d-inline-block' ref={makeCloseInputRef}>
                                            <CloseOutlined
                                                className='cursor-pointer'
                                                onClick={(e) => { setFilterGroup({ ...filterGroup, make: '', model: '' }) }} />
                                        </span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <span className='d-inline-block grey' >
                                            Brand
                                        </span>
                                        <span className='d-inline-block' >
                                            <img style={{ width: 25 }} src="/assets/carDetails/Car Maker@3x.png" />
                                        </span>
                                    </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                );

            case 'model':
                return (
                    <React.Fragment>
                        <div className={`thin-border round-border-light border-ccar-yellow ${filterGroup.make ? 'cursor-pointer' : 'cursor-not-allowed background-grey-lighten-3'} flex-justify-space-between flex-items-align-center padding-x-md  margin-bottom-xs`}
                            style={{ height: 30 }}
                            ref={modelInputRef}
                            onClick={(e) => {
                                if (filterGroup.make && (!modelCloseInputRef.current || !modelCloseInputRef.current.contains(e.target))) {
                                    controlModalOpen('model');
                                }
                            }}>
                            {
                                filterGroup.model ?
                                    <React.Fragment>
                                        <span className='d-inline-block capitalize' >
                                            {filterGroup.model || ""}
                                        </span>
                                        <span className='d-inline-block' ref={modelCloseInputRef} >
                                            <CloseOutlined
                                                className='cursor-pointer'
                                                onClick={(e) => { setFilterGroup({ ...filterGroup, model: '' }) }} />
                                        </span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <span className='d-inline-block grey' >
                                            Model
                                        </span>
                                        <span className='d-inline-block' >
                                            <img style={{ width: 25 }} src="/assets/carDetails/Car Maker@3x.png" />
                                        </span>
                                    </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                );
            case 'state':
                return (
                    <React.Fragment>
                        <div className={`thin-border round-border-light border-ccar-yellow cursor-pointer flex-justify-space-between flex-items-align-center padding-x-md  margin-bottom-xs`}
                            style={{ height: 30 }}
                            ref={stateInputRef}
                            onClick={(e) => {
                                if (!stateCloseInputRef.current || !stateCloseInputRef.current.contains(e.target)) {
                                    controlModalOpen('state');
                                }
                            }}>
                            {
                                filterGroup.state ?
                                    <React.Fragment>
                                        <span className='d-inline-block capitalize' >
                                            {_.get(getState(filterGroup.state), ['value']) || ""}
                                        </span>
                                        <span className='d-inline-block' ref={stateCloseInputRef} >
                                            <CloseOutlined
                                                className='cursor-pointer'
                                                onClick={(e) => { setFilterGroup({ ...filterGroup, state: '', area: '' }) }} />
                                        </span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <span className='d-inline-block grey' >
                                            State
                                        </span>
                                        <span className='d-inline-block' >
                                            <img style={{ width: 25 }} src="/assets/carDetails/Location@3x.png" />
                                        </span>
                                    </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                );
            case 'area':
                return (
                    <React.Fragment>
                        <div className={` ${filterGroup.state ? 'cursor-pointer' : 'cursor-not-allowed background-grey-lighten-3'} thin-border round-border-light border-ccar-yellow flex-justify-space-between flex-items-align-center padding-x-md  margin-bottom-xs`}
                            style={{ height: 30 }}
                            onClick={(e) => {
                                if (filterGroup.state && (!areaCloseInputRef.current || !areaCloseInputRef.current.contains(e.target))) {
                                    controlModalOpen('area');
                                }
                            }}>
                            {
                                filterGroup.area ?
                                    <React.Fragment>
                                        <span className='d-inline-block capitalize' >
                                            {filterGroup.area || ""}
                                        </span>
                                        <span className='d-inline-block' ref={areaCloseInputRef} >
                                            <CloseOutlined
                                                className='cursor-pointer'
                                                onClick={(e) => { setFilterGroup({ ...filterGroup, area: '' }) }} />
                                        </span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <span className='d-inline-block grey' >
                                            Area
                                            </span>
                                        <span className='d-inline-block' >
                                            <img style={{ width: 25 }} src="/assets/carDetails/Location@3x.png" />
                                        </span>
                                    </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                );
            case 'bodyType':
                return (
                    <React.Fragment>
                        <div className={`thin-border round-border-light border-ccar-yellow cursor-pointer flex-justify-space-between flex-items-align-center padding-x-md  margin-bottom-xs`}
                            style={{ height: 30 }}
                            ref={bodyTypeInputRef}
                            onClick={(e) => {
                                if (!bodyTypeCloseInputRef.current || !bodyTypeCloseInputRef.current.contains(e.target)) {
                                    controlModalOpen('bodyType');
                                }
                            }}>
                            {
                                filterGroup.bodyType ?
                                    <React.Fragment>
                                        <span className='d-inline-block' >
                                            {_.get(getBodyType(filterGroup.bodyType), ['value']) || ""}
                                        </span>
                                        <span className='d-inline-block' ref={bodyTypeCloseInputRef} >
                                            <CloseOutlined
                                                className='cursor-pointer'
                                                onClick={(e) => { setFilterGroup({ ...filterGroup, bodyType: '' }); }} />
                                        </span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <span className='d-inline-block grey' >
                                            Body Type
                                    </span>
                                        <span className='d-inline-block'>
                                            <img style={{ width: 25 }} src="/assets/carDetails/Body Type@3x.png" />
                                        </span>
                                    </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                );

            case 'color':
                return (
                    <React.Fragment>
                        <div className={`thin-border round-border-light border-ccar-yellow cursor-pointer flex-justify-space-between flex-items-align-center padding-x-md  margin-bottom-xs`}
                            style={{ height: 30 }}
                            ref={colorInputRef}
                            onClick={(e) => {
                                if (!colorCloseInputRef.current || !colorCloseInputRef.current.contains(e.target)) {
                                    controlModalOpen('color');
                                }
                            }}>
                            {
                                filterGroup.color ?
                                    <React.Fragment>
                                        <span className='d-inline-block capitalize'  >
                                            {_.capitalize(_.get(getColor(filterGroup.color), ['value'])) || ""}
                                        </span>
                                        <span className='d-inline-block' ref={colorCloseInputRef}>
                                            <CloseOutlined
                                                className='cursor-pointer'
                                                onClick={(e) => { setFilterGroup({ ...filterGroup, color: '' }) }} />
                                        </span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <span className='d-inline-block grey' >
                                            Color
                                    </span>
                                        <span className='d-inline-block' >
                                            <img style={{ width: 25 }} src="/assets/carDetails/Car Color@3x.png" />
                                        </span>
                                    </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                );

            case 'drivenwheel':
                return (
                    <React.Fragment>
                        <div className={`thin-border round-border-light border-ccar-yellow cursor-pointer flex-justify-space-between flex-items-align-center padding-x-md  margin-bottom-xs`}
                            style={{ height: 30 }}
                            ref={drivenwheelInputRef}
                            onClick={(e) => {
                                if (!drivenwheelCloseInputRef.current || !drivenwheelCloseInputRef.current.contains(e.target)) {
                                    controlModalOpen('drivenwheel');
                                }
                            }}>
                            {
                                filterGroup.drivenwheel ?
                                    <React.Fragment>
                                        <span className='d-inline-block capitalize' >
                                            {_.capitalize(_.get(getDrivenWheel(filterGroup.drivenwheel), ['value'])) || ""}
                                        </span>
                                        <span className='d-inline-block' ref={drivenwheelCloseInputRef} >
                                            <CloseOutlined
                                                className='cursor-pointer'
                                                onClick={(e) => { setFilterGroup({ ...filterGroup, drivenwheel: '' }) }} />
                                        </span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <span className='d-inline-block grey' >
                                            Driven Wheel
                                </span>
                                        <span className='d-inline-block' >
                                            <img style={{ width: 25 }} src="/assets/carDetails/Wheel@3x.png" />
                                        </span>
                                    </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                );

            case 'fuelType':
                return (
                    <React.Fragment>
                        <div className={`thin-border round-border-light border-ccar-yellow cursor-pointer flex-justify-space-between flex-items-align-center padding-x-md  margin-bottom-xs`}
                            style={{ height: 30 }}
                            ref={fuelTypeInputRef}
                            onClick={(e) => {
                                if (!fuelTypeCloseInputRef.current || !fuelTypeCloseInputRef.current.contains(e.target)) {
                                    controlModalOpen('fuelType');
                                }
                            }}>
                            {
                                filterGroup.fuelType ?
                                    <React.Fragment>
                                        <span className='d-inline-block capitalize' >
                                            {_.capitalize(_.get(getFuelType(filterGroup.fuelType), ['value'])) || ""}
                                        </span>
                                        <span className='d-inline-block' ref={fuelTypeCloseInputRef}>
                                            <CloseOutlined
                                                className='cursor-pointer'
                                                onClick={(e) => { setFilterGroup({ ...filterGroup, fuelType: '' }) }} />
                                        </span>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <span className='d-inline-block grey' >
                                            Fuel Type
                            </span>
                                        <span className='d-inline-block' >
                                            <img style={{ width: 25 }} src="/assets/carDetails/Fuel Type.png" />
                                        </span>
                                    </React.Fragment>
                            }
                        </div>
                    </React.Fragment>
                );

            case 'year':
                return (
                    <React.Fragment>

                        {/* <Row>
                                <Col span={22}>
                                    <label style={{ color: '#FBB040', fontWeight: '500', marginLeft: '12px' }}>Year</label>
    
                                </Col>
                                <Col span={2}>
                                    <CloseOutlined
                                        style={{ color: "grey", fontSize: '13px', marginBottom: '10px' }}
                                        className='cursor-pointer'
                                        onClick={(e) => { setFilterGroup({ ...filterGroup, yearRange: [undefined, undefined] }) }}
                                    />
                                </Col>
                            </Row> */}

                        {
                            fieldThatShowRangeTitle == item ?
                                _renderRangeTitle()
                                :
                                null
                        }

                        <Row style={{ width: '100%', padding: '2px 0px' }}>
                            <Col span={11}>
                                <div id="yearPopUpContainer-1">
                                    <AutoComplete
                                        allowClear
                                        placeholder="Year"
                                        dropdownMatchSelectWidth={false}
                                        dropdownMenuStyle={{ height: "130px" }}
                                        value={_.get(dropDownSearchValue, 'minYear') || undefined}
                                        onSelect={(e) => {
                                            setFilterGroup({ ...filterGroup, yearRange: [e, _.get(filterGroup, 'yearRange[1]')] })
                                        }}
                                        onDropdownVisibleChange={(open) => {
                                            setIsDropDownOpen(open)
                                        }}
                                        onBlur={() => {
                                            setDropDownSearchValue({
                                                ...dropDownSearchValue,
                                                minYear: _.get(filterGroup, 'yearRange[0]'),
                                            })
                                        }}
                                        onChange={(v) => {
                                            //On clear
                                            if (!v && _.indexOf(_.get(getFilteredDropDownOptions(), 'minYears') || [], dropDownSearchValue.minYear) != -1 && _.get(filterGroup, 'yearRange[0]') == dropDownSearchValue.minYear) {
                                                setFilterGroup({ ...filterGroup, yearRange: [v, !_.isArray(filterGroup.yearRange) || !isValidNumber(filterGroup.yearRange[1]) ? undefined : parseInt(filterGroup.yearRange[1])] })
                                            } else {
                                                setDropDownSearchValue({
                                                    ...dropDownSearchValue,
                                                    minYear: v
                                                })
                                            }
                                        }}
                                        onSearch={(v) => {
                                            if (!v || _.get(filterGroup, 'yearRange[0]') == v) {
                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    minYears: _.get(getFilteredDropDownOptions(), 'minYears'),
                                                })
                                            } else {
                                                let newData = _.filter(_.get(getFilteredDropDownOptions(), 'minYears') || [], function (item) {
                                                    let regex = new RegExp(`^${v}`, 'i')
                                                    return regex.test(`${item}`);
                                                })

                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    minYears: newData,
                                                })
                                            }

                                        }}
                                        getPopupContainer={() => document.getElementById('yearPopUpContainer-1')}
                                    >
                                        {
                                            _.isArray(_.get(dropDownOptions, 'minYears')) && !_.isEmpty(_.get(dropDownOptions, 'minYears')) ?
                                                _.map(dropDownOptions.minYears, function (item, index) {
                                                    return (
                                                        <AutoComplete.Option key={`minYear-${index}`} value={`${item}`}>
                                                            {item}
                                                        </AutoComplete.Option>
                                                    )
                                                })
                                                :
                                                null
                                        }
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col span={11} offset={2}>
                                <div id="yearPopUpContainer-2">
                                    <AutoComplete
                                        allowClear
                                        placeholder="Year"
                                        dropdownMatchSelectWidth={false}
                                        dropdownMenuStyle={{ height: "130px" }}
                                        value={_.get(dropDownSearchValue, 'maxYear') || undefined}
                                        onSelect={(v) => { setFilterGroup({ ...filterGroup, yearRange: [_.get(filterGroup, 'yearRange[0]'), v] }) }}
                                        onDropdownVisibleChange={(open) => {
                                            setIsDropDownOpen(open)
                                        }}
                                        onBlur={() => {
                                            setDropDownSearchValue({
                                                ...dropDownSearchValue,
                                                maxYear: _.get(filterGroup, 'yearRange[1]'),
                                            })
                                        }}
                                        onChange={(v) => {
                                            //On clear
                                            if (!v && _.indexOf(_.get(getFilteredDropDownOptions(), 'maxYears') || [], dropDownSearchValue.maxYear) != -1 && _.get(filterGroup, 'yearRange[1]') == dropDownSearchValue.maxYear) {
                                                setFilterGroup({ ...filterGroup, yearRange: [_.get(filterGroup, 'yearRange[0]'), v] })
                                            } else {
                                                setDropDownSearchValue({
                                                    ...dropDownSearchValue,
                                                    maxYear: v
                                                })
                                            }
                                        }}
                                        onSearch={(v) => {
                                            if (!v || _.get(filterGroup, 'yearRange[1]') == v) {
                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    maxYears: _.get(getFilteredDropDownOptions(), 'maxYears'),
                                                })
                                            } else {
                                                let newData = _.filter(_.get(getFilteredDropDownOptions(), 'maxYears') || [], function (item) {
                                                    let regex = new RegExp(`^${v}`, 'i')
                                                    return regex.test(`${item}`);
                                                })

                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    maxYears: newData,
                                                })
                                            }

                                        }}
                                        getPopupContainer={() => document.getElementById('yearPopUpContainer-2')}
                                    >
                                        {
                                            _.isArray(_.get(dropDownOptions, 'maxYears')) && !_.isEmpty(_.get(dropDownOptions, 'maxYears')) ?
                                                _.map(dropDownOptions.maxYears, function (item, index) {
                                                    return (
                                                        <AutoComplete.Option key={`maxYear-${index}`} value={`${item}`}>
                                                            {item}
                                                        </AutoComplete.Option>
                                                    )
                                                })
                                                :
                                                null
                                        }
                                    </AutoComplete>
                                </div>
                            </Col>
                        </Row>
                    </React.Fragment>
                );

            case 'price':
                return (
                    <React.Fragment>
                        {/* <Row>
                                <Col span={22}>
                                    <label style={{ color: '#FBB040', fontWeight: '500', marginLeft: '12px' }}>Price</label>
                                </Col>
                                <Col span={2}>
                                    <CloseOutlined
                                        style={{ color: "grey", fontSize: '13px', marginBottom: '10px' }}
                                        className='cursor-pointer'
                                        onClick={(e) => { setFilterGroup({ ...filterGroup, priceRange: [undefined, undefined] }) }}
                                    />
                                </Col>
                            </Row> */}

                        {
                            fieldThatShowRangeTitle == item ?
                                _renderRangeTitle()
                                :
                                null
                        }
                        <Row style={{ width: '100%', padding: '2px 0px' }}>
                            <Col span={11}>
                                <div id="pricePopUpContainer-1">
                                    <AutoComplete
                                        allowClear
                                        placeholder="Price"
                                        dropdownMenuStyle={{ height: "130px" }}
                                        dropdownMatchSelectWidth={false}
                                        value={dropDownSearchValue.minPrice || undefined}
                                        onSelect={(e) => {
                                            setFilterGroup({ ...filterGroup, priceRange: [e, _.get(filterGroup, 'priceRange[1]')] })
                                        }}
                                        onDropdownVisibleChange={(open) => {
                                            setIsDropDownOpen(open)
                                        }}
                                        dataSource={
                                            _.map(dropDownOptions.minPrices, function (item, index) {
                                                return <AutoComplete.Option key={`minPrice-${index}`} value={item}>
                                                    {_.upperCase(formatNumber(item, 'auto', true, 0))}
                                                </AutoComplete.Option>

                                            })}
                                        onBlur={() => {
                                            setDropDownSearchValue({
                                                ...dropDownSearchValue,
                                                minPrice: `${_.get(filterGroup, 'priceRange[0]') || ''}`,
                                            })
                                        }}
                                        onChange={(v) => {
                                            //On clear
                                            if (!v && _.indexOf(_.get(getFilteredDropDownOptions(), 'minPrices') || [], dropDownSearchValue.minPrice) != -1 && _.get(filterGroup, 'priceRange[0]') == dropDownSearchValue.minPrice) {
                                                setFilterGroup({ ...filterGroup, priceRange: [v, !_.isArray(filterGroup.priceRange) || !isValidNumber(filterGroup.priceRange[1]) ? undefined : parseInt(filterGroup.priceRange[1])] })
                                            } else {
                                                setDropDownSearchValue({
                                                    ...dropDownSearchValue,
                                                    minPrice: parseFloat(v) || 0,
                                                })
                                            }
                                        }}
                                        onSearch={(v) => {
                                            if (!v || _.get(filterGroup, 'priceRange[0]') == v) {
                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    minPrices: _.get(getFilteredDropDownOptions(), 'minPrices'),
                                                })
                                            } else {

                                                let newData = _.compact([_.find(_.get(getFilteredDropDownOptions(), 'minPrices') || [], function (item) {
                                                    return parseFloat(v) <= parseFloat(item);
                                                })])

                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    minPrices: newData,
                                                })
                                            }
                                        }}
                                        getPopupContainer={() => document.getElementById('pricePopUpContainer-1')}
                                    >
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col span={11} offset={2}>
                                <div id="pricePopUpContainer-2">
                                    <AutoComplete
                                        allowClear
                                        placeholder="Price"
                                        dropdownMenuStyle={{ height: "130px" }}
                                        dropdownMatchSelectWidth={false}
                                        value={dropDownSearchValue.maxPrice || undefined}
                                        onSelect={(e) => {
                                            setFilterGroup({ ...filterGroup, priceRange: [_.get(filterGroup, 'priceRange[0]'), e] })
                                        }}
                                        onDropdownVisibleChange={(open) => {
                                            setIsDropDownOpen(open)
                                        }}
                                        dataSource={
                                            _.map(dropDownOptions.maxPrices, function (item, index) {
                                                return <AutoComplete.Option key={`maxPrice-${index}`} value={item}>
                                                    {_.upperCase(formatNumber(item, 'auto', true, 0))}
                                                </AutoComplete.Option>

                                            })}
                                        onBlur={() => {
                                            setDropDownSearchValue({
                                                ...dropDownSearchValue,
                                                maxPrice: `${_.get(filterGroup, 'priceRange[1]') || ''}`,
                                            })
                                        }}
                                        onChange={(v) => {
                                            //On clear
                                            if (!v && _.indexOf(_.get(getFilteredDropDownOptions(), 'maxPrices') || [], dropDownSearchValue.maxPrice) != -1 && _.get(filterGroup, 'priceRange[1]') == dropDownSearchValue.maxPrice) {
                                                setFilterGroup({ ...filterGroup, priceRange: [_.get(filterGroup, 'priceRange[0]'), v] })
                                            } else {
                                                setDropDownSearchValue({
                                                    ...dropDownSearchValue,
                                                    maxPrice: parseFloat(v) || 0,
                                                })
                                            }
                                        }}
                                        onSearch={(v) => {
                                            if (!v || _.get(filterGroup, 'priceRange[1]') == v) {
                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    maxPrices: _.get(getFilteredDropDownOptions(), 'maxPrices'),
                                                })
                                            } else {

                                                let newData = _.compact([_.find(_.reverse(_.get(getFilteredDropDownOptions(), 'maxPrices')) || [], function (item) {
                                                    return parseFloat(v) <= parseFloat(item);
                                                })])

                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    maxPrices: newData,
                                                })
                                            }
                                        }}
                                        getPopupContainer={() => document.getElementById('pricePopUpContainer-2')}
                                    >
                                    </AutoComplete>
                                </div>
                            </Col>
                        </Row>
                    </React.Fragment>
                );

            case 'engineCapacity':
                return (
                    <React.Fragment>
                        {/* <Row>
                                    <Col span={22}>
                                        <label style={{ color: '#FBB040', fontWeight: '500', marginLeft: '12px' }}>Price</label>
                                    </Col>
                                    <Col span={2}>
                                        <CloseOutlined
                                            style={{ color: "grey", fontSize: '13px', marginBottom: '10px' }}
                                            className='cursor-pointer'
                                            onClick={(e) => { setFilterGroup({ ...filterGroup, priceRange: [undefined, undefined] }) }}
                                        />
                                    </Col>
                                </Row> */}

                        {
                            fieldThatShowRangeTitle == item ?
                                _renderRangeTitle()
                                :
                                null
                        }
                        <Row style={{ width: '100%', padding: '2px 0px' }}>
                            <Col span={11}>
                                <div className="margin-bottom-xs" id="engineCapacityPopUpContainer-1">
                                    <AutoComplete
                                        allowClear
                                        placeholder="Engine Capacity"
                                        dropdownMenuStyle={{ height: "130px" }}
                                        dropdownMatchSelectWidth={false}
                                        value={dropDownSearchValue.minEngineCapacity || undefined}
                                        onSelect={(e) => {
                                            setFilterGroup({ ...filterGroup, engineCapacityRange: [e, _.get(filterGroup, 'engineCapacityRange[1]')] })
                                        }}
                                        onDropdownVisibleChange={(open) => {
                                            setIsDropDownOpen(open)
                                        }}
                                        dataSource={
                                            _.map(dropDownOptions.minEngineCapacities, function (item, index) {
                                                return {
                                                    text : `${formatNumber(item, null, true, 1)} cc`,
                                                    value : item,
                                                }

                                            })}
                                        onBlur={() => {
                                            setDropDownSearchValue({
                                                ...dropDownSearchValue,
                                                minEngineCapacity: `${_.get(filterGroup, 'engineCapacityRange[0]') || ''}`,
                                            })
                                        }}
                                        onChange={(v) => {
                                            //On clear
                                            if (!v && _.indexOf(_.get(getFilteredDropDownOptions(), 'minEngineCapacities') || [], dropDownSearchValue.minEngineCapacity) != -1 && _.get(filterGroup, 'engineCapacityRange[0]') == dropDownSearchValue.minEngineCapacity) {
                                                setFilterGroup({ ...filterGroup, engineCapacityRange: [v, !_.isArray(filterGroup.engineCapacityRange) || !isValidNumber(filterGroup.engineCapacityRange[1]) ? undefined : parseInt(filterGroup.engineCapacityRange[1])] })
                                            } else {
                                                setDropDownSearchValue({
                                                    ...dropDownSearchValue,
                                                    minEngineCapacity: parseFloat(v) || 0,
                                                })
                                            }
                                        }}
                                        onSearch={(v) => {
                                            if (!v || _.get(filterGroup, 'engineCapacityRange[0]') == v) {
                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    minEngineCapacities: _.get(getFilteredDropDownOptions(), 'minEngineCapacities'),
                                                })
                                            } else {

                                                let newData = _.compact([_.find(_.get(getFilteredDropDownOptions(), 'minEngineCapacities') || [], function (item) {
                                                    return parseFloat(v) <= parseFloat(item);
                                                })])

                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    minEngineCapacities: newData,
                                                })
                                            }
                                        }}
                                        getPopupContainer={() => document.getElementById('engineCapacityPopUpContainer-1')}
                                    >
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col span={11} offset={2}>
                                <div id="engineCapacityPopUpContainer-2">
                                    <AutoComplete
                                        allowClear
                                        placeholder="Engine Capacity"
                                        dropdownMenuStyle={{ height: "130px" }}
                                        dropdownMatchSelectWidth={false}
                                        value={dropDownSearchValue.maxEngineCapacity || undefined}
                                        onSelect={(e) => {
                                            setFilterGroup({ ...filterGroup, engineCapacityRange: [_.get(filterGroup, 'engineCapacityRange[0]'), e] })
                                        }}
                                        onDropdownVisibleChange={(open) => {
                                            setIsDropDownOpen(open)
                                        }}
                                        dataSource={
                                            _.map(dropDownOptions.maxEngineCapacities, function (item, index) {
                                                return {
                                                    text : `${formatNumber(item, null, true, 1)} cc`,
                                                    value : item,
                                                }
                                            })}
                                        onBlur={() => {
                                            setDropDownSearchValue({
                                                ...dropDownSearchValue,
                                                maxEngineCapacity: `${_.get(filterGroup, 'engineCapacityRange[1]') || ''}`,
                                            })
                                        }}
                                        onChange={(v) => {
                                            //On clear
                                            if (!v && _.indexOf(_.get(getFilteredDropDownOptions(), 'maxEngineCapacities') || [], dropDownSearchValue.maxEngineCapacity) != -1 && _.get(filterGroup, 'engineCapacityRange[1]') == dropDownSearchValue.maxEngineCapacity) {
                                                setFilterGroup({ ...filterGroup, engineCapacityRange: [_.get(filterGroup, 'engineCapacityRange[0]'), v] })
                                            } else {
                                                setDropDownSearchValue({
                                                    ...dropDownSearchValue,
                                                    maxEngineCapacity: parseFloat(v) || 0,
                                                })
                                            }
                                        }}
                                        onSearch={(v) => {
                                            if (!v || _.get(filterGroup, 'engineCapacityRange[1]') == v) {
                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    maxEngineCapacities: _.get(getFilteredDropDownOptions(), 'maxEngineCapacities'),
                                                })
                                            } else {

                                                let newData = _.compact([_.find(_.reverse(_.get(getFilteredDropDownOptions(), 'maxEngineCapacities')) || [], function (item) {
                                                    return parseFloat(v) <= parseFloat(item);
                                                })])

                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    maxEngineCapacities: newData,
                                                })
                                            }
                                        }}
                                        getPopupContainer={() => document.getElementById('engineCapacityPopUpContainer-2')}
                                    >
                                    </AutoComplete>
                                </div>
                            </Col>
                        </Row>
                    </React.Fragment>
                );

            case 'mileage':
                return (
                    <React.Fragment>
                        {/* <Row>
                                <Col span={22}>
                                    <label style={{ color: '#FBB040', fontWeight: '500', marginLeft: '12px' }}>Mileage</label>
                                </Col>
                                <Col span={2}>
                                    <CloseOutlined
                                        style={{ color: "grey", fontSize: '13px', marginBottom: '10px' }}
                                        className='cursor-pointer'
                                        onClick={(e) => { setFilterGroup({ ...filterGroup, mileageRange: [undefined, undefined] }) }}
                                    />
                                </Col>
                            </Row> */}

                        {
                            fieldThatShowRangeTitle == item ?
                                _renderRangeTitle()
                                :
                                null
                        }
                        <Row style={{ width: '100%', padding: '2px 0px' }}>
                            <Col span={11}>
                                <div id="mileagePopUpContainer-1">
                                    <AutoComplete
                                        allowClear
                                        placeholder="Mileage"
                                        dropdownMenuStyle={{ height: "130px" }}
                                        dropdownMatchSelectWidth={false}
                                        value={dropDownSearchValue.minMileage || undefined}
                                        onSelect={(e) => {
                                            setFilterGroup({ ...filterGroup, mileageRange: [e, _.get(filterGroup, 'mileageRange[1]')] })
                                        }}
                                        onDropdownVisibleChange={(open) => {
                                            setIsDropDownOpen(open)
                                        }}
                                        dataSource={
                                            _.map(dropDownOptions.minMileages, function (item, index) {
                                                return {
                                                    text : `${formatNumber(item, null, true, 0)} KM`,
                                                    value : item,
                                                }
                                            })}
                                        onBlur={() => {
                                            setDropDownSearchValue({
                                                ...dropDownSearchValue,
                                                minMileage: `${_.get(filterGroup, 'mileageRange[0]') || ''}`,
                                            })
                                        }}
                                        onChange={(v) => {
                                            //On clear
                                            if (!v && _.indexOf(_.get(getFilteredDropDownOptions(), 'minMileages') || [], dropDownSearchValue.minMileage) != -1 && _.get(filterGroup, 'mileageRange[0]') == dropDownSearchValue.minMileage) {
                                                setFilterGroup({ ...filterGroup, mileageRange: [v, !_.isArray(filterGroup.mileageRange) || !isValidNumber(filterGroup.mileageRange[1]) ? undefined : parseInt(filterGroup.mileageRange[1])] })
                                            } else {
                                                setDropDownSearchValue({
                                                    ...dropDownSearchValue,
                                                    minMileage: parseFloat(v) || 0,
                                                })
                                            }
                                        }}
                                        onSearch={(v) => {
                                            if (!v || _.get(filterGroup, 'mileageRange[0]') == v) {
                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    minMileages: _.get(getFilteredDropDownOptions(), 'minMileages'),
                                                })
                                            } else {

                                                let newData = _.compact([_.find(_.get(getFilteredDropDownOptions(), 'minMileages') || [], function (item) {
                                                    return parseFloat(v) <= parseFloat(item);
                                                })])

                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    minMileages: newData,
                                                })
                                            }
                                        }}
                                        getPopupContainer={() => document.getElementById('mileagePopUpContainer-1')}
                                    >
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col span={11} offset={2}>
                                <div id="mileagePopUpContainer-2">
                                    <AutoComplete
                                        allowClear
                                        placeholder="Mileage"
                                        dropdownMenuStyle={{ height: "130px" }}
                                        dropdownMatchSelectWidth={false}
                                        value={dropDownSearchValue.maxMileage || undefined}
                                        onSelect={(e) => {
                                            setFilterGroup({ ...filterGroup, mileageRange: [_.get(filterGroup, 'mileageRange[0]'), e] })
                                        }}
                                        onDropdownVisibleChange={(open) => {
                                            setIsDropDownOpen(open)
                                        }}
                                        dataSource={
                                            _.map(dropDownOptions.maxMileages, function (item, index) {
                                                return {
                                                    text : `${formatNumber(item, null, true, 0)} KM`,
                                                    value : item,
                                                }
                                            })}
                                        onBlur={() => {
                                            setDropDownSearchValue({
                                                ...dropDownSearchValue,
                                                maxMileage: `${_.get(filterGroup, 'mileageRange[1]') || ''}`,
                                            })
                                        }}
                                        onChange={(v) => {
                                            //On clear
                                            if (!v && _.indexOf(_.get(getFilteredDropDownOptions(), 'maxMileages') || [], dropDownSearchValue.maxMileage) != -1 && _.get(filterGroup, 'mileageRange[1]') == dropDownSearchValue.maxMileage) {
                                                setFilterGroup({ ...filterGroup, mileageRange: [_.get(filterGroup, 'mileageRange[0]'), v] })
                                            } else {
                                                setDropDownSearchValue({
                                                    ...dropDownSearchValue,
                                                    maxMileage: parseFloat(v) || 0,
                                                })
                                            }
                                        }}
                                        onSearch={(v) => {
                                            if (!v || _.get(filterGroup, 'mileageRange[1]') == v) {
                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    maxMileages: _.get(getFilteredDropDownOptions(), 'maxMileages'),
                                                })
                                            } else {

                                                let newData = _.compact([_.find(_.reverse(_.get(getFilteredDropDownOptions(), 'maxMileages')) || [], function (item) {
                                                    return parseFloat(v) <= parseFloat(item);
                                                })])

                                                setDropDownOptions({
                                                    ...dropDownOptions,
                                                    maxMileages: newData,
                                                })
                                            }
                                        }}
                                        getPopupContainer={() => document.getElementById('mileagePopUpContainer-2')}
                                    >
                                    </AutoComplete>
                                </div>
                            </Col>
                        </Row>
                    </React.Fragment>
                );

            default:
                return null;
        }
    }



    return (
        <span className='d-inline-block width-100' ref={containerRef} style={{ ...props.style, position: 'relative' }}>
            <Card
                bordered={false}
                title="Quick Filter"
                size="small"
                className='width-100 card-padding-0'
            >
                <div>
                    <div ref={formRef} className='padding-sm' >
                        <Form
                            // {...layout}
                            name="basic"
                        // onSubmit={handleSubmit}
                        >
                            {
                                notEmptyLength(optionsFields) ?
                                    _.map(optionsFields, function (option, i) {
                                        return (
                                            <div key={'optionsFields' + i} ref={inputRefs[`${option}Ref`]} className=''>
                                                {_renderFormItem(option)}
                                            </div>
                                        )
                                    })
                                    :
                                    null
                            }
                        </Form>
                    </div>
                </div>
                <div className='background-white' ref={moreOptionButtonRef}>
                    {
                        notEmptyLength(collapseFields) ?
                            <Button type="primary" className="w-100" onClick={null} style={{ marginTop: '10px' }} id="moreOptions" onClick={(e) => { setMoreOptionModalVisible(true) }}>
                                More Options
                        </Button>
                            :
                            null
                    }
                </div>
            </Card>

            {/* <img src={cnyLionHead} style={{ width: 55, height: 90, position: 'absolute', right: -15, top: -60, }}></img> */}

            <span className='d-inline-block cursor-pointer' style={{ position: 'absolute', right: 18, top: 7, }}>
                <Tooltip title="Reset Filter">
                    <Button
                        style={{
                            border: 'none',
                            background: 'none',
                            color: 'red',
                            padding: 0,
                            fontSize: 12,
                            fontWeight: 500
                        }} className="w-100 h-100"
                        onClick={(e) => { resetFilterGroup() }} >
                        {/* <img src="/assets/General/reset.png" style={{ width: '16px', marginRight: 4, paddingBottom: 2 }} /> */}

                        <Icon type="reload" />
                    </Button>
                </Tooltip>
            </span>
            <div
                id="moreOptionModal"
                className={`background-white ${moreOptionModalVisible ? 'd-inline-block' : 'd-none'}`}
                ref={moreOptionModalRef}
                style={
                    {
                        position: 'absolute',
                        right: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().width) ? `250px` : `${containerRef.current.getBoundingClientRect().width + modalMargin}px`,
                        top: 0,
                        bottom: 0,
                        margin: 0,
                        width: `${moreOptionModalWidth}px`,
                        height: 'fit-content'
                    }
                }
            >
                {
                    moreOptionModalVisible ?
                        <Card
                            bordered={false}
                            title="More Options"
                            size="small"
                            className={`width-100 thin-border`}
                        >
                            <Form
                                // {...layout}
                                name="basic"
                            // onSubmit={handleSubmit}
                            >
                                {
                                    notEmptyLength(collapseFields) ?
                                        _.map(collapseFields, function (option) {
                                            return isCollapse(option) ? _renderFormItem(option) : null
                                        })
                                        :
                                        null
                                }
                            </Form>
                        </Card>
                        :
                        null
                }

            </div>

            {
                containerRef.current ?
                    <React.Fragment>

                        <MakeModal
                            visible={makeModalVisible}
                            onCancel={(e) => { setMakeModalVisible(false) }}
                            style={
                                {
                                    left: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().left) ? 0 : notEmptyLength(collapseFields) && moreOptionModalVisible ? `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin - moreOptionModalWidth - modalMargin}px` : `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin}px`,
                                    top: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().top) ? 0 : `${containerRef.current.getBoundingClientRect().top < props.app.menuHeight ? props.app.menuHeight : containerRef.current.getBoundingClientRect().top}px`,
                                    margin: 0,
                                }
                            }
                            closable={false}
                            maskClosable={true}
                            className='no-padding-modal-body'
                            width={`${modalWidth}px`}
                            onChange={(data) => { setFilterGroup({ ...filterGroup, make: _.toLower(data), model: undefined }) }}
                            bodyStyle={{ maxHeight: containerHeight }}
                            selectedValue={filterGroup.make}
                            id="make-modal"
                            options={notEmptyLength(origOptions.makeList) ? origOptions.makeList : []} />

                        <ModelModal
                            visible={modelModalVisible}
                            onCancel={(e) => { setModelModalVisible(false) }}
                            style={
                                {
                                    left: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().left) ? 0 : notEmptyLength(collapseFields) && moreOptionModalVisible ? `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin - moreOptionModalWidth - modalMargin}px` : `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin}px`,
                                    top: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().top) ? 0 : `${containerRef.current.getBoundingClientRect().top < props.app.menuHeight ? props.app.menuHeight : containerRef.current.getBoundingClientRect().top}px`,
                                    margin: 0
                                }
                            }
                            closable={false}
                            maskClosable={true}
                            className='no-padding-modal-body'
                            width={`${modalWidth}px`}
                            onChange={(data) => { setFilterGroup({ ...filterGroup, model: _.toLower(data) }) }}
                            bodyStyle={{ maxHeight: containerHeight }}
                            selectedValue={filterGroup.model}
                            id="model-modal"
                            options={_.isArray(modelOptions) && notEmptyLength(modelOptions) && filterGroup.make ? modelOptions : null}
                            loading={modelLoading}
                        />

                        <StateModal
                            visible={stateModalVisible}
                            onCancel={(e) => { setStateModalVisible(false) }}

                            style={
                                {
                                    left: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().left) ? 0 : notEmptyLength(collapseFields) && moreOptionModalVisible ? `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin - moreOptionModalWidth - modalMargin}px` : `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin}px`,
                                    top: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().top) ? 0 : `${containerRef.current.getBoundingClientRect().top < props.app.menuHeight ? props.app.menuHeight : containerRef.current.getBoundingClientRect().top}px`,
                                    margin: 0
                                }
                            }
                            closable={false}
                            maskClosable={true}
                            className='no-padding-modal-body'
                            width={`${modalWidth}px`}
                            onChange={(data) => { setFilterGroup({ ...filterGroup, state: _.toLower(data), area: undefined }) }}
                            bodyStyle={{ maxHeight: containerHeight }}
                            selectedValue={filterGroup.state}
                            id="state-modal"
                            options={isObject(props.availableFilterOption) ? props.availableFilterOption.stateList : notEmptyLength(origOptions.stateList) ? origOptions.stateList : null} />

                        <AreaModal
                            visible={areaModalVisible}
                            onCancel={(e) => { setAreaModalVisible(false) }}
                            style={
                                {
                                    left: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().left) ? 0 : notEmptyLength(collapseFields) && moreOptionModalVisible ? `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin - moreOptionModalWidth - modalMargin}px` : `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin}px`,
                                    top: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().top) ? 0 : `${containerRef.current.getBoundingClientRect().top < props.app.menuHeight ? props.app.menuHeight : containerRef.current.getBoundingClientRect().top}px`,
                                    margin: 0
                                }
                            }
                            closable={false}
                            maskClosable={true}
                            className='no-padding-modal-body'
                            width={`${modalWidth}px`}
                            onChange={(data) => { setFilterGroup({ ...filterGroup, area: _.toLower(data) }) }}
                            bodyStyle={{ maxHeight: containerHeight }}
                            selectedValue={filterGroup.area}
                            id="area-modal"
                            options={_.isArray(_.get(props.availableFilterOption, ['areaList'])) && !_.isEmpty(_.get(props.availableFilterOption, ['areaList'])) ? _.get(props.availableFilterOption, ['areaList']) : []}
                            loading={modelLoading}
                        />

                        <BodyTypeModal
                            visible={bodyTypeModalVisible}
                            onCancel={(e) => { setBodyTypeModalVisible(false) }}

                            style={
                                {
                                    left: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().left) ? 0 : notEmptyLength(collapseFields) && moreOptionModalVisible ? `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin - moreOptionModalWidth - modalMargin}px` : `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin}px`,
                                    top: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().top) ? 0 : `${containerRef.current.getBoundingClientRect().top < props.app.menuHeight ? props.app.menuHeight : containerRef.current.getBoundingClientRect().top}px`,
                                    margin: 0
                                }
                            }
                            closable={false}
                            maskClosable={true}
                            className='no-padding-modal-body'
                            width={`${modalWidth}px`}
                            onChange={(data) => { setFilterGroup({ ...filterGroup, bodyType: data != "all" && data != null ? _.toLower(data) : '' }) }}
                            bodyStyle={{ maxHeight: containerHeight }}
                            selectedValue={filterGroup.bodyType}
                            id="body-type-modal"
                            options={isObject(props.availableFilterOption) ? props.availableFilterOption.bodyTypeList : notEmptyLength(origOptions.bodyTypeList) ? origOptions.bodyTypeList : null} />

                        <DrivenWheelModal
                            visible={drivenwheelModalVisible}
                            onCancel={(e) => { setDrivenWheelModalVisible(false) }}

                            style={
                                {
                                    left: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().left) ? 0 : notEmptyLength(collapseFields) && moreOptionModalVisible ? `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin - moreOptionModalWidth - modalMargin}px` : `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin}px`,
                                    top: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().top) ? 0 : `${containerRef.current.getBoundingClientRect().top < props.app.menuHeight ? props.app.menuHeight : containerRef.current.getBoundingClientRect().top}px`,
                                    margin: 0
                                }
                            }
                            closable={false}
                            maskClosable={true}
                            className='no-padding-modal-body'
                            width={`${modalWidth}px`}
                            onChange={(data) => { setFilterGroup({ ...filterGroup, drivenwheel: _.toLower(data) }) }}
                            bodyStyle={{ maxHeight: containerHeight }}
                            selectedValue={filterGroup.drivenwheel}
                            id="driven-wheel-modal"
                            options={isObject(props.availableFilterOption) ? props.availableFilterOption.drivenWheelList : notEmptyLength(origOptions.drivenWheelList) ? origOptions.drivenWheelList : null} />

                        <ColorModal
                            visible={colorModalVisible}
                            onCancel={(e) => { setColorModalVisible(false) }}

                            style={
                                {
                                    left: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().left) ? 0 : notEmptyLength(collapseFields) && moreOptionModalVisible ? `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin - moreOptionModalWidth - modalMargin}px` : `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin}px`,
                                    top: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().top) ? 0 : `${containerRef.current.getBoundingClientRect().top < props.app.menuHeight ? props.app.menuHeight : containerRef.current.getBoundingClientRect().top}px`,
                                    margin: 0
                                }
                            }
                            closable={false}
                            maskClosable={true}
                            className='no-padding-modal-body'
                            width={`${modalWidth}px`}
                            onChange={(data) => { setFilterGroup({ ...filterGroup, color: _.toLower(data) }) }}
                            bodyStyle={{ maxHeight: containerHeight }}
                            selectedValue={filterGroup.color}
                            id="color-modal"
                            options={isObject(props.availableFilterOption) ? props.availableFilterOption.colorList : notEmptyLength(origOptions.colorList) ? origOptions.colorList : null} />

                        <FuelTypeModal
                            visible={fuelTypeModalVisible}
                            onCancel={(e) => { setFuelTypeModalVisible(false) }}

                            style={
                                {
                                    left: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().left) ? 0 : notEmptyLength(collapseFields) && moreOptionModalVisible ? `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin - moreOptionModalWidth - modalMargin}px` : `${containerRef.current.getBoundingClientRect().left - modalWidth - modalMargin}px`,
                                    top: !containerRef || !containerRef.current || !isValidNumber(containerRef.current.getBoundingClientRect().top) ? 0 : `${containerRef.current.getBoundingClientRect().top < props.app.menuHeight ? props.app.menuHeight : containerRef.current.getBoundingClientRect().top}px`,
                                    margin: 0
                                }
                            }
                            closable={false}
                            maskClosable={true}
                            className='no-padding-modal-body'
                            width={`${modalWidth}px`}
                            onChange={(data) => { setFilterGroup({ ...filterGroup, fuelType: _.toLower(data) }) }}
                            bodyStyle={{ maxHeight: containerHeight }}
                            selectedValue={filterGroup.fuelType}
                            id="fuel-type-modal"
                            options={isObject(props.availableFilterOption) ? props.availableFilterOption.fuelTypeList : notEmptyLength(origOptions.fuelTypeList) ? origOptions.fuelTypeList : null} />

                    </React.Fragment>
                    :
                    null
            }
        </span >
    );
}

const mapStateToProps = state => ({
    app: state.app,
    productsList: state.productsList,
});


const mapDispatchToProps = {
    fetchProductFilterOptions,
    clearProductFilterOptions,
    fetchFilterModalState,

};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ProductsListFilterForm)));