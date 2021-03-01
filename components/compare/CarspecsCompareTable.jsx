import { Card, message, Switch, Table } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchDetails, filteredCompareData } from '../../redux/actions/newcars-actions';
import { isValidNumber, notEmptyLength } from '../../common-function';
import client from '../../feathers';
import { loading } from '../../redux/actions/app-actions';

loading
const CarspecsCompareTable = (props) => {
    const [carspecs, setCarspecs] = useState([])
    const [filteredCompareData, setFilteredCompareData] = useState([])
    const [expandedRow, setExpandedRow] = useState([])
    const [columns, setColumns] = useState([])

    const [mainCategory, setMainCategory] = useState([
        { key: 'engineCapacity', name: 'Engine Capacity' },
        { key: 'transmission', name: 'Transmission' },
        { key: 'year', name: 'Year' },
        { key: 'mileage', name: 'Mileage' },
        { key: 'bodyType', name: 'Body Type' },
    ])

    function updateTableCols(data) {

        let colObj = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '250px',
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
                        title: `${_.capitalize(item.make)} ${_.capitalize(item.model)} ${_.capitalize(item.variant)}`,
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

        if (notEmptyLength(props.data)) {
            let data = props.data;
            if (!isNaN(parseInt(props.limit)) && props.data.length > parseInt(props.limit)) {
                data = _.slice(data, 0, parseInt(props.limit));
                message.warning(`Maximum ${parseInt(props.limit)} items to compare. Removed overflow items.`)
            }

            if (props.findById) {
                props.loading(true);
                client.service('carspecs').find({
                    query: {
                        _id: {
                            $in: props.data,
                        }
                    }
                }).then(res => {
                    props.loading(false);
 
                    if (notEmptyLength(res.data)) {
                        setCarspecs(res.data);
                    } else {
                        setCarspecs([]);
                    }

                }).catch(err => {
                    props.loading(false);
                    message.error(err.message)
                });

            } else {
                setCarspecs(props.data);
            }
        } else {
            setCarspecs([]);
        }
    }, [props.data, props.findById])

    useEffect(() => {
        if (notEmptyLength(carspecs)) {
            filteringCompareData(carspecs)
            updateTableCols(carspecs);
        }
    }, [carspecs])

    useEffect(() => {

        expandAllRow();
    }, [filteredCompareData])



    function filteringCompareData(data) {

        let baseCategory = _.cloneDeep(mainCategory)
        let rows = []


        if (notEmptyLength(data)) {

            let allCategory = [];

            //Restruct data
            _.map(data, function (item) {
                //prepare base field row
                let mainCategoryRow = [];
                let splitObj = Object.entries(item);

                //IF it is main category data push into specification
                _.forEach(splitObj, function (splitValue) {
                    let selectedBase = _.find(baseCategory, ['key', splitValue[0]])

                    if (notEmptyLength(selectedBase)) {
                        mainCategoryRow.push({
                            category: 'Main Category',
                            field: selectedBase.name,
                            value: splitValue[1],
                        })
                    }
                });
                if(!item.specification){
                    return item
                }
                //Push Main Category to Specification
                item.specification = _.compact(_.concat(mainCategoryRow, item.specification));

                //Find all distinct category
                allCategory = _.unionBy(
                    _.map(_.uniqBy(item.specification, 'category'), 'category')
                    ,
                    allCategory
                );

                return item;
            });

            if(isValidNumber(parseInt(props.groupLimit))){
                allCategory = _.take(allCategory, parseInt(props.groupLimit))
            }

            //prepare expandable rows
            if (notEmptyLength(allCategory)) {
                _.forEach(allCategory, function (category) {
                    let rowData = {
                        key: category,
                        name: category,
                        children: [],
                    }

                    _.forEach(_.compact(data), function (item, compareCarIndex) {
                        _.forEach(_.compact(item.specification), function (specItem, specificationIndex) {
                            //Found record then push to children
                            if (_.toLower(category) == _.toLower(specItem.category)) {

                                let selectedRowChildren = {};

                                //find if children already inserted
                                selectedRowChildren = _.find(rowData.children, function (child) {
                                    return child.name == specItem.field;
                                })

                                if (notEmptyLength(selectedRowChildren)) {
                                    //inserted
                                    selectedRowChildren[`compare${compareCarIndex}`] = specItem.value;
                                } else {
                                    //haven't insert yet
                                    let temp = { name: specItem.field, key: `${specItem.field}-${specificationIndex}` };
                                    temp[`compare${compareCarIndex}`] = specItem.value;
                                    rowData.children.push(temp)
                                }
                            }


                        })

                    });

                    rows.push(rowData);

                })

            }


        }

        setFilteredCompareData(rows)
    }

    function onChange(checked) {
        if (checked) {
            hideSameDetails(filteredCompareData)
        } else {
            filteringCompareData(carspecs);
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
                <div className=' flex-justify-start w-100 flex-items-align-center '>
                    {
                        props.rowExpandControl == null || props.rowExpandControl == true ?
                            <span className='d-inline-block margin-x-sm' >
                                <Switch onChange={(e) => { e ? expandAllRow() : shrinkAllRow() }} defaultChecked unCheckedChildren="Expand Rows" checkedChildren="Shrink Rows" />
                            </span>
                            :
                            null
                    }
                    {
                        props.hideExpandControl == null || props.hideExpandControl == true ?
                            <span className='d-inline-block margin-x-sm' >
                                <Switch onChange={onChange} unCheckedChildren="Hide Same Items" checkedChildren="Show All Items" />
                            </span>
                            :
                            null
                    }
                </div>
            </React.Fragment>
        )
    }

    return (

        <React.Fragment>
            <Card className="card-padding-0" >
                <Table
                    bordered
                    row="key"
                    className="compare-table"
                    title={props.showTitle == null || props.showTitle == true ? () => _renderTableTitle() : null}
                    scroll={{ x: 1000, y: 1000 }}
                    expandedRowKeys={expandedRow}
                    onExpandedRowsChange={(e) => { setExpandedRow(e); }}
                    columns={columns}
                    pagination={false}
                    dataSource={filteredCompareData} />
            </Card>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    newCars: state.newCars,
});

const mapDispatchToProps = {
    loading: loading,
    filteredCompareData: filteredCompareData,
    fetchDetails: fetchDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(CarspecsCompareTable);