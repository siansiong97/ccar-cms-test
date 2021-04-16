import { Button, Col, Empty, message, Row, Switch } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loading } from '../../redux/actions/app-actions';
import { fetchDetails, filteredCompareData } from '../../redux/actions/newcars-actions';
import { notEmptyLength } from '../../common-function';
import client from '../../feathers';
import CarspecsCompareTable from '../compare/CarspecsCompareTable';


const CompareNewCarIndex = (props) => {
    const [variants, setVariants] = useState([])
    const [filteredCompareData, setFilteredCompareData] = useState([])
    const [expandedRow, setExpandedRow] = useState([])
    const [columns, setColumns] = useState([])

    const [compareArray, setCompareArray] = useState([
        { key: 'price', name: 'Price' },
        { key: 'condition', name: 'Condition' },
        { key: 'make', name: 'Make' },
        { key: 'model', name: 'Model' },
        { key: 'engineCapacity', name: 'Engine Capacity' },
        { key: 'transmission', name: 'Transmission' },
        { key: 'year', name: 'Year' },
        { key: 'mileage', name: 'Mileage' },
        { key: 'bodyType', name: 'Body Type' },
        //drivenWheel
        { key: 'color', name: 'Color' },
        //businessType
    ])

    function updateTableCols(data) {

        let colObj = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                fixed: 'left',
                render: (text, row) => {
                    if (notEmptyLength(row.children)) {
                        return {
                            children: <span><strong>{row.name}</strong></span>,
                            props: {
                                colSpan: notEmptyLength(data) ? data.length + 1 : 1,
                            },
                        };
                    } else {
                        if (row.name) {
                            return {
                                children: <span>{row.name}</span>,
                            };
                        } else {
                            return {
                                children: <span>{row.field}</span>,
                            };
                        }
                    }
                },
            }
        ];
        if (notEmptyLength(data)) {

            data.forEach(function (item, index) {
                colObj.push(
                    {
                        title: `${_.capitalize(item.model)} ${_.capitalize(item.make)} ${_.capitalize(item.variant)}`,
                        dataIndex: `compare${index}`,
                        key: `compare${index}`,
                        render: (text, row) => {
                            if (notEmptyLength(row.children)) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            } else {
                                if (row[`compare${index}`]) {
                                    return {
                                        children: <span>{row[`compare${index}`]}</span>,
                                    };
                                } else {
                                    return {
                                        children: <span>-</span>,
                                    };
                                }
                            }
                        },
                    },
                )
            })

        }
        setColumns(colObj);
    }

    useEffect(() => {

        if (notEmptyLength(props.newCars.compareIds)) {
 
            props.loading(true);
            client.service('carspecs').find({
                query: {
                    _id: {
                        $in: props.newCars.compareIds
                    },
                    newCar: 'on',
                    carmodelId: {
                        $ne: ''
                    },
                    $populate: ['carmodelId'],
                }
            }).then((res1) => {
                props.loading(false);
                if (notEmptyLength(res1.data)) {
                    let temp = _.map(res1.data, (v) => {
                        v.condition = 'new'
                        v.carUrl = v.carmodelId ? v.carmodelId.url : null
                        v.price = v.price ? v.price : 0
                        v.carspecsAll = v
                        return v
                    })
                    setVariants(temp);
                } else {
                    setVariants([]);
                }
            }).catch(err => {
                props.loading(false);
                message.error(err.message)
            });
        } else {
            setVariants([]);
        }
    }, [props.newCars.compareIds])

    useEffect(() => {
        if (notEmptyLength(variants)) {
            filteringCompareData(variants)
            updateTableCols(variants);
        }
    }, [variants])



    function filteringCompareData(data) {

        let baseFieldRows = _.cloneDeep(compareArray)
        let addOnFieldRows = []



        if (notEmptyLength(data)) {

            let allCategory = [];
            _.forEach(data, function (item, compareCarIndex) {
                //prepare base field row
                let splitObj = Object.entries(item);
                _.forEach(splitObj, function (splitValue) {
                    let selectedRow = _.find(baseFieldRows, function (row) {
                        return _.toLower(row.key) == _.toLower(splitValue[0]);
                    })

                    if (notEmptyLength(selectedRow)) {
                        _.map(baseFieldRows, function (row) {
                            if (row.key == selectedRow.key) {
                                row[`compare${compareCarIndex}`] = splitValue[1];
                            }
                            return row;
                        })
                    }
                });

                //prepare expandable rows' fields
                allCategory = _.unionBy(
                    _.uniqBy(item.carspecsAll.specification, 'category')
                    ,
                    allCategory,
                    'category'
                );
            });


            //prepare expandable rows
            if (notEmptyLength(allCategory)) {

                _.forEach(allCategory, function (category) {
                    let rowData = {
                        key: category.category,
                        name: category.category,
                        children: [],
                    }

                    _.forEach(data, function (item, compareCarIndex) {
                        _.forEach(item.specification, function (specItem, specificationIndex) {

                            //Found record then push to children
                            if (_.toLower(category.category) == _.toLower(specItem.category)) {

                                let selectedRowChildren = {};

                                //find if children already inserted
                                selectedRowChildren = _.find(rowData.children, function (child) {
                                    return child.name == specItem.field;
                                })

                                //haven't insert yet
                                if (notEmptyLength(selectedRowChildren)) {
                                    selectedRowChildren[`compare${compareCarIndex}`] = specItem.value;
                                } else {
                                    //insert
                                    let temp = { name: specItem.field, key: `${specItem.field}-${specificationIndex}` };
                                    temp[`compare${compareCarIndex}`] = specItem.value;
                                    rowData.children.push(temp)
                                }
                            }


                        })

                    });

                    addOnFieldRows.push(rowData);

                })

            }


        }

        setFilteredCompareData(baseFieldRows.concat(addOnFieldRows))
    }

    function onChange(checked) {
        if (checked) {
            hideSameDetails(filteredCompareData)
        } else {
            filteringCompareData(variants);
        }
    }

    function hideSameDetails(data) {

        if (notEmptyLength(data)) {
            let finalData = _.cloneDeep(data);

            data.forEach(function (rowData) {

                let compareFields = findRowCompareFields(rowData, true);

                if (notEmptyLength(compareFields)) {

                    //Check only more than 1 data
                    if (compareFields.length > 1) {
                        let uniqValue = _.uniq(compareFields);

                        //Is same
                        if (uniqValue.length <= 1) {
                            finalData = removeRowData(finalData, rowData.key);
                        }

                    }
                } else {

                    if (notEmptyLength(rowData.children)) {

                        _.forEach(rowData.children, function (childrenRowData) {
                            compareFields = findRowCompareFields(childrenRowData, true);
                            if (notEmptyLength(compareFields)) {
                                if (compareFields.length > 1) {
                                    let uniqValue = _.uniq(compareFields);

                                    //Is same
                                    if (uniqValue.length <= 1) {
                                        finalData = removeRowData(finalData, childrenRowData.key);
                                    }
                                }
                            } else {
                                finalData = removeRowData(finalData, childrenRowData.key);
                            }
                        })

                    } else {
                        finalData = removeRowData(finalData, rowData.key);
                    }
                }

            })


            setFilteredCompareData(finalData);

        } else {
            return data;
        }
    }

    function findRowCompareFields(row, returnDataOnly) {
        if (notEmptyLength(row)) {
            let splitObj = Object.entries(row);
            let compareFields = _.filter(splitObj, function (obj) {
                let regex = new RegExp('^compare', 'i');
                return regex.test(obj[0]);
            })
            if (returnDataOnly) {
                return _.map(compareFields, function (item) {
                    return item[1];
                });
            } else {
                return compareFields;
            }

        } else {
            return [];
        }
    }

    function removeRowData(data, key) {
        if (key) {
            let finalData = _.cloneDeep(data);

            //Check for non expandable row first
            finalData = _.filter(finalData, function (row) {
                return row.key != key;
            })

            //Check for expandable row
            finalData = _.compact(
                _.map(finalData, function (row) {

                    if (notEmptyLength(row.children)) {
                        let filteredChildren = _.filter(row.children, function (childrenRow) {
                            return childrenRow.key != key;
                        })

                        //Dont have any children now
                        if (!notEmptyLength(filteredChildren)) {
                            return null;
                        } else {
                            row.children = filteredChildren
                            return row;
                        }
                    }

                    return row;
                })
            )


            return finalData;
        } else {
            return null;
        }
    }

    function expandAllRow() {
        if (notEmptyLength(filteredCompareData)) {
            let keys = _.map(filteredCompareData, 'key');
            if (notEmptyLength(keys)) {
                setExpandedRow(keys);
            }
        } else {
            setExpandedRow([]);
        }
    }

    function shrinkAllRow() {
        setExpandedRow([]);
    }

    const _renderTableTitle = () => {
        return (
            <React.Fragment>

                <div className=' flex-justify-space-between w-100 flex-items-align-center '>
                    <span className='d-inline-block' >

                        <Button icon="arrows-alt" onClick={expandAllRow} className="background-ccar-yellow margin-x-sm">
                            Expand All
                        </Button>
                        <Button icon="shrink" onClick={shrinkAllRow} className="margin-x-sm">
                            Shrink All
                        </Button>
                    </span>
                    <Switch onChange={onChange} className="margin-x-sm" unCheckedChildren="Hide Same Items" checkedChildren="Show All Items" />
                </div>
            </React.Fragment>
        )
    }

    return (
        <div className="section">
            <Row >
                <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                    <div className=' flex-items-align-center w-100 '>
                        <span className='d-inline-block font-weight-bold h5 uppercase' >
                            {_.upperCase(!props.newCars || !props.newCars.CarName ? null : props.newCars.CarName.make)} {_.capitalize(!props.newCars || !props.newCars.CarName ? null : props.newCars.CarName.model)} specification
                          </span>
                    </div>
                </Col>
            </Row>

            <div style={{ width: '100%', overflowX: 'scroll', display: 'flex' }}>
                {variants.length > 0 ?
                    <Col span={24}>
                        <div className="relative-wrapper" style={{ height: '200px' }}>
                            <img src={variants[0].carUrl} className="absolute-center" style={{ maxWidth: '300px', maxHeight: '90%' }} />
                        </div>
                    </Col>
                    : <Empty style={{ margin: 30 }} />
                }

                {/* {
                    [0,1,2,3,4,5].map((v, i) => {
                        return (
                            <Col key={i} className="gutter-row col-centered" xs={24} sm={24} md={5} lg={5} xl={5}>
                                <p style={{ fontSize: 18, fontWeight: 600, color: 'black' }}>Perodua Aruz 2019 1.5 X</p>
                                <Button type="primary">Ask for Reserve</Button>
                            </Col>
                        )
                    })
                } */}
            </div>
        <Row></Row>
          <CarspecsCompareTable data={notEmptyLength(_.compact(_.map(variants , '_id'))) ? _.compact(_.map(variants , '_id')) : []} findById />
        </div>
    );
}

const mapStateToProps = state => ({
    newCars: state.newcars || state.newCars,
});

const mapDispatchToProps = {
    loading : loading,
    filteredCompareData: filteredCompareData,
    fetchDetails: fetchDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(CompareNewCarIndex);