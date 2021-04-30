import { LineChart, LineChartProps } from '@opd/g2plot-react';
import { Card, Col, Icon, Row, Spin, Table } from 'antd';
import { css } from '@emotion/css'
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import LayoutV2 from '../../general/LayoutV2';
import { formatNumber } from '../../../common-function';
import { updateActiveMenu } from '../../../redux/actions/app-actions';
import client from '../../../feathers';


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

const body = css({
    '& thead tr th:nth-child(2)': {
        textAlign: 'right', padding: '12px 12px',
    },
    '& thead tr th:nth-child(3)': {
        textAlign: 'right', padding: '12px 12px',
    },
    '& thead tr th:nth-child(4)': {
        textAlign: 'right', padding: '12px 12px',
    },
    '& thead tr th:nth-child(5)': {
        textAlign: 'right', padding: '12px 12px',
    },
});

var moment = require('moment');

const config = {
    height: 480,
    forceFit: true,
    xField: 'date',
    yField: 'value',
    legend: {
        position: 'top-center',
        marker: {
            symbol: 'hyphen'
        },
        text: {
            formatter: (v) => {
                return v.toUpperCase()
            },
        }
    },
    xAxis: {
        tickCount: 9,
    },
    yAxis: {
        min: 1,
        max: 3,
        tickInterval: 0.2,
        formatter: (v) => {
            return 'RM ' + parseFloat(v).toFixed(2);
        },
    },
    seriesField: 'type',
    color: ['#fbe53c', '#f82c0d', '#000000', '#bcbcb8'],
    responsive: true,
    // point: {
    //     visible: true,
    //     size: 1,
    // },
    tooltip: {
        domStyles: {
            'g2-tooltip-title': { fontSize: '16px', fontWeight: 900, textDecoration: 'underline' },
            'g2-tooltip-list': { fontSize: '14px', 'textTransform': 'uppercase' }
        }
    },
    animation: {
        appear: {
            animation: 'clipingWithData',
        },
    },
    //   label: {
    //     visible: true,
    //     type: 'point',
    //   },
}
const fuelpriceindex = (props) => {
    const chartRef = useRef()
    const [chartData, setchartData] = useState([])
    const [tableData, setTableData] = useState([])
    const [lastRecord, setLastRecord] = useState([])
    const [loading, setLoading] = useState(false)
    const [mobileRecord, setmobileRecord] = useState([])


    useEffect(() => {
        props.updateActiveMenu('7');
        setLoading(true)
        client.service('fuelprices').find({
            query: {
                $sort: { date: -1 },
                $limit: 90,

            }
        }).then((res) => {

            let dataset = []
            if (res.data.length <= 0) {
                return
            } else {
                setmobileRecord(res.data[0])
            }


            res.data = _.orderBy(res.data, ['date'], ['asc']);

            res.data.map(function (item, index) {
                let date = moment(item.date[0]).format("DD/MM/YY")
                let ron95 = {}, ron97 = {}, euro2 = {}, euro5 = {}
                ron95.date = date
                ron97.date = date
                euro2.date = date
                euro5.date = date

                ron95.value = item.ron95
                ron97.value = item.ron97
                euro2.value = item.euro2
                euro5.value = item.euro5

                if (index > 0) { item.ron95differences = parseFloat(parseFloat(res.data[index].ron95 - res.data[index - 1].ron95).toFixed(2)) }
                if (index > 0) { item.ron97differences = parseFloat(parseFloat(res.data[index].ron97 - res.data[index - 1].ron97).toFixed(2)) }
                if (index > 0) { item.euro2differences = parseFloat(parseFloat(res.data[index].euro2 - res.data[index - 1].euro2).toFixed(2)) }
                if (index > 0) { item.euro5differences = parseFloat(parseFloat(res.data[index].euro5 - res.data[index - 1].euro5).toFixed(2)) }

                ron95.type = "ron95"
                ron97.type = "ron97"
                euro2.type = "euro2"
                euro5.type = "euro5"

                dataset.push(ron95)
                dataset.push(ron97)
                dataset.push(euro2)
                dataset.push(euro5)
                return item
            })

            res.data = _.orderBy(res.data, ['date'], ['desc']);
            res.data[0].firstRecord = 'yes'
            setTableData(res.data)
            setchartData(dataset)
            let lastRecord = dataset[dataset.length - 1]
            setLastRecord(lastRecord)
            setLoading(false)
        }).catch((err) => {
            console.log(err);
            setLoading(false)
        })

    }, [])

    const diesel = [

        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '60%',
            render: (values, record) => {
                return (
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>
                        {moment(record.date[0]).format('DD-MM-YYYY') + ' ~ '}{moment(record.date[1]).format('DD-MM-YYYY')}
                    </span>
                )
            }
        },
        {
            title: (<Row><Col style={{ 'float': 'right' }}>EURO 2</Col></Row>),
            dataIndex: 'euro2',
            key: 'euro2',
            width: '20%',
            render: (values, record) => {
                return (<Row><Col style={{ 'float': 'right' }}>
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>{values}</span>
                </Col></Row>)
            }
        },
        {
            title: (<Row><Col style={{ 'float': 'right' }}>EURO 5</Col></Row>),
            dataIndex: 'euro5',
            key: 'euro5',
            width: '20%',
            render: (values, record) => {
                return (<Row><Col style={{ 'float': 'right' }}>
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>{values}</span>
                </Col></Row>)
            }
        },
    ];

    const petrol = [

        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '60%',
            render: (values, record) => {
                return (
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>
                        {moment(record.date[0]).format('DD-MM-YYYY') + ' ~ '}{moment(record.date[1]).format('DD-MM-YYYY')}
                    </span>
                )
            }
        },
        {

            title: (<Row><Col style={{ 'float': 'right' }}>RON 95</Col></Row>),
            dataIndex: 'ron95',
            key: '_id',
            width: '20%',
            render: (values, record) => {
                return (<Row><Col style={{ 'float': 'right' }}>
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>{values}</span>
                </Col></Row>)
            }
        },
        {
            title: (<Row><Col style={{ 'float': 'right' }}>RON 97</Col></Row>),
            dataIndex: 'ron97',
            key: 'ron97',
            width: '20%',
            render: (values, record) => {
                return (<Row><Col style={{ 'float': 'right' }}>
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>{values}</span>
                </Col></Row>)
            }
        },
    ];

    const columns = [

        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '20%',
            render: (values, record) => {
                return (
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>
                        {moment(record.date[0]).format('DD-MM-YYYY') + ' ~ '}{moment(record.date[1]).format('DD-MM-YYYY')}
                    </span>
                )
            }
        },
        {

            title: (<Row><Col style={{ 'float': 'right' }}>RON 95</Col></Row>),
            dataIndex: 'ron95',
            key: '_id',
            width: '20%',
            render: (values, record) => {
                return (<Row><Col style={{ 'float': 'right' }}>
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>{formatNumber(values, null, true, 2, false)}</span>{processPriceDifference(record.ron95differences)}
                </Col></Row>)
            }
        },
        {
            title: (<Row><Col style={{ 'float': 'right' }}>RON 97</Col></Row>),
            dataIndex: 'ron97',
            key: 'ron97',
            width: '20%',
            render: (values, record) => {
                return (<Row><Col style={{ 'float': 'right' }}>
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>{formatNumber(values, null, true, 2, false)}</span>{processPriceDifference(record.ron97differences)}
                </Col></Row>)
            }
        },
        {
            title: (<Row><Col style={{ 'float': 'right' }}>EURO 2</Col></Row>),
            dataIndex: 'euro2',
            key: 'euro2',
            width: '20%',
            render: (values, record) => {
                return (<Row><Col style={{ 'float': 'right' }}>
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>{formatNumber(values, null, true, 2, false)}</span>{processPriceDifference(record.euro2differences)}
                </Col></Row>)
            }
        },
        {
            title: (<Row><Col style={{ 'float': 'right' }}>EURO 5</Col></Row>),
            dataIndex: 'euro5',
            key: 'euro5',
            width: '20%',
            render: (values, record) => {
                return (<Row><Col style={{ 'float': 'right' }}>
                    <span style={{ color: record.firstRecord ? 'red' : '' }}>{formatNumber(values, null, true, 2, false)}</span>{processPriceDifference(record.euro5differences)}
                </Col></Row>)
            }
        },
        {
            dataIndex: '',
            key: '',
            width: '10%',

        },
    ];


    function processPriceDifference(value) {

        if (value) {

            if (value > 0) { return (<span>(<Icon style={{ color: 'red' }} type="arrow-up" />{value})</span>) }
            else {
                return (<span>(<Icon style={{ color: 'green' }} type="arrow-down" />{value})</span>)
            }
        }
    }
    return (
        <Spin tip={'Loading...'} spinning={loading} size="large">
            <LayoutV2>
                <div className="section">
                    <div className="container padding-x-xs padding-top-md">
                    <Desktop>
                        <Card title="Chart">
                            <LineChart {...config} chartRef={chartRef} data={chartData} description={{ visible: true, text: 'Last Update by ' + lastRecord.date }} />
                            <Table className={body} scroll={{ y: 400 }} dataSource={tableData} columns={columns} pagination={false} rowKey="_id" />
                        </Card>
                    </Desktop>

                    <Tablet>
                        <Card title="Chart" className="card-padding-0">
                            <LineChart {...config} chartRef={chartRef} data={chartData} description={{ visible: true, text: 'Last Update by ' + lastRecord.date }} />
                            <Table style={{marginTop:'10px'}} className={body} scroll={{ y: 400 }} dataSource={tableData} columns={columns} pagination={false} rowKey="_id" />
                        </Card>
                    </Tablet>

                    <Mobile>
                        <Card title="Petrol" className="card-padding-0 " >
                            <Table className={body} scroll={{ y: 400 }} dataSource={tableData} columns={petrol} pagination={false} rowKey="_id" />
                        </Card>
                        <Card title="Diesel" className="margin-top-md card-padding-0">
                            <Table className={body} scroll={{ y: 400 }} dataSource={tableData} columns={diesel} pagination={false} rowKey="_id" />
                        </Card>
                    </Mobile>
                    </div>
                </div>

            </LayoutV2>

        </Spin>

    )

}

const mapStateToProps = state => ({
    app: state.app,
});

const mapDispatchToProps = {
    updateActiveMenu: updateActiveMenu,
}

export default connect(mapStateToProps, mapDispatchToProps)(fuelpriceindex);