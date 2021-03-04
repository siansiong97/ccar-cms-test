import { Form } from 'antd';
import _ from 'lodash';
import { withRouter } from 'next/router';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { notEmptyLength } from '../../common-function';
import { loading } from '../../redux/actions/app-actions';
import { setUser } from '../../redux/actions/user-actions';



const CustomTabs = (props) => {

    const [tabIndex, setTabIndex] = useState(0)


    function handleChangeTab(index){
        setTabIndex(index);
        if(props.handleChange){
            props.handleChange(index);
        }
    }
    return (
        <React.Fragment>
            <Tabs
                className={props.className ? props.className : ''}
                style={{ ...props.style }}
                selectedTabClassName={props.selectedTabClassName ? props.selectedTabClassName : ''}
                selectedTabPanelClassName={props.selectedTabPanelClassName ? props.selectedTabPanelClassName : ''}
                selectedIndex={tabIndex}
                onSelect={(index) => {handleChangeTab(index)}}
                >
                <TabList>
                    <div className={props.tabContainerClassName ? props.tabContainerClassName : ''} style={{ ...props.tabContainerStyle }}>
                        {
                            notEmptyLength(props.tabs) ?
                                _.map(props.tabs, function (tab, index) {
                                    return (
                                        <Tab key={`tab-${index}`} className={props.tabClassName ? props.tabClassName : null} style={{ ...props.tabStyle, listStyleType : 'none' }}>
                                            {tab}
                                        </Tab>
                                    )
                                })
                                :
                                null
                        }
                    </div>
                </TabList>
                {
                    notEmptyLength(props.tabPanels) ?
                        _.map(props.tabPanels, function (tabPanel,index) {
                            return (
                                <TabPanel  key={`tab-panel-${index}`}>
                                    <div className={props.panelContainerClassName ? props.panelContainerClassName : ''} style={{ ...props.panelContainerStyle }}>
                                        {tabPanel}
                                    </div>
                                </TabPanel>
                            )
                        })
                        :
                        null
                }
            </Tabs>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(CustomTabs)));