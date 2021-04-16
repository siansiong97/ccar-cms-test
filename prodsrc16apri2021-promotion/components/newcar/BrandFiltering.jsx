import React, { useState, useEffect } from 'react';
import { Row, Col, Menu } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { carBrandsList } from '../../params/carBrandsList';
import _ from 'lodash';
import { notEmptyLength } from '../../common-function';
import Link from 'next/link';


function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}


const BrandFiltering = (props) => {
    const { height, width } = useWindowDimensions();
    const [groupedCarBrandsList, setGroupedCarBrandsList] = useState([])


    useEffect(() => {

        if (notEmptyLength(props.brands)) {
            groupCarBrandsList(props.brands)
        } else {
            if (props.default) {
                groupCarBrandsList(carBrandsList);
            } else {
                groupCarBrandsList(null);
            }
        }
    }, [props.brands]);

    function onSelect(value) {
        if (props.onSelect) {
            props.onSelect(value);
        }
    }
    function groupCarBrandsList(data) {

        let start = 'A';
        let end = 'Z';
        let groupedData = [];


        if (notEmptyLength(data)) {
            for (let index = start.charCodeAt(0); index <= end.charCodeAt(0); index++) {
                let selectedCarBrands = data.filter(function (brand) {
                    let firstLetter = _.upperCase(brand.value.substr(0, 1));
                    return firstLetter == String.fromCharCode(index);
                })

                if (notEmptyLength(selectedCarBrands)) {
                    let item = {
                        title: String.fromCharCode(index),
                        index: index,
                        data: selectedCarBrands,
                    }
                    groupedData.push(item);
                }
            }

            setGroupedCarBrandsList(groupedData);
        } else {
            setGroupedCarBrandsList([]);
        }
    }

    return (
        <Row>
            {/* <div>
            width: {width} ~ height: {height}
            </div> */}
            <Col span={3}>
                <div className="list" style={{ height: height - 80, }}>
                    {groupedCarBrandsList.map(function (item, i) {
                        return (
                            <div className="list-hover">
                                <div onClick={() => {
                                    var elmnt = document.getElementById(i + 'direction');
                                    elmnt.scrollIntoView();
                                }}>
                                    <p style={{ color: '#FFCC32' }}>{item.title} </p>
                                </div>
                                {/* <a href={"#" + i}><p style={{color:'black'}}>{item.title} </p></a>  */}
                            </div>
                        )
                    })}
                </div>
            </Col>

            <Col span={21}>
                <div className="demo-infinite-container" style={{ height: height - 80, }}>
                    {/* <InfiniteScroll initialLoad={false} pageStart={0} loadMore={this.carBrandsList} hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}> */}

                    <Menu className="brand" style={{ width: 256 }} defaultOpenKeys={['sub1']} mode="inline">
                        {groupedCarBrandsList.map(function (item, parentsIndex) {
                            return (
                                <Menu.ItemGroup title={item.title} className="newcar-menu-header" id={parentsIndex + 'direction'}>
                                    {item.data.map(function (row2, childIndex) {
                                        return (
                                            <Menu.Item className={props.selected == _.toLower(row2.value) ? 'brandpics background-yellow-lighten-5' : "brandpics"} id={parentsIndex + '' + childIndex} key={parentsIndex + '' + childIndex}>
                                                <Link shallow={false}  href={`/newcar/maker/${_.toLower(row2.value)}`} passHref>
                                                    <a>
                                                        <div className={props.selected == _.toLower(row2.value) ? 'flex-items-align-center cursor-pointer ccar-yellow' : 'flex-items-align-center cursor-pointer'}
                                                        // onClick={(e) => { onSelect(row2.value) }}
                                                        >
                                                            <img src={row2.icon} />
                                                            {row2.value}
                                                        </div>
                                                    </a>
                                                </Link>
                                            </Menu.Item>
                                        )
                                    })
                                    }
                                </Menu.ItemGroup>
                            )
                        })
                        }
                    </Menu>
                    {/* </InfiniteScroll> */}
                </div>
            </Col>
        </Row>
    );
}

export default BrandFiltering;