import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import LayoutV2 from '../Layout-V2';

import PrivacyPolicy from './privacyPolicy'
import TermsConditionsAdvertisers from './termsConditionsAdvertisers'
import TermsConditionsOfUse from './termsConditionofUse'
import PersonalDataProtectionNotice from './personalDataProtectionNotice'

const { TabPane } = Tabs;

const TermOfUseIndex = () => {
    const [ index, setIndex ] = useState('2')
    
    useEffect(()=>{
        window.scrollTo(0, 0)
    })
    
    const callback = (key) => {
        setIndex((key.toString()))
    }

    const setIndexProps = (key) => {
        setIndex((key.toString()))
    }

    return (
        <LayoutV2>
            <div className="section">
                <Tabs activeKey={index} onChange={callback}>
                    <TabPane tab="Privacy Policy" key="1">
                        <PrivacyPolicy setIndexProps={setIndexProps}/>
                    </TabPane>
                    <TabPane tab="Personal Data Protection Notice" key="2">
                        <PersonalDataProtectionNotice setIndexProps={setIndexProps}/>
                    </TabPane>
                    <TabPane tab="Terms & Condition of Use" key="3">
                        <TermsConditionsOfUse setIndexProps={setIndexProps}/>
                    </TabPane>
                    <TabPane tab="Terms & Conditions for Advertisers Subscribing to CCAR.MY" key="4">
                        <TermsConditionsAdvertisers setIndexProps={setIndexProps}/>
                    </TabPane>
                </Tabs>
            </div>
        </LayoutV2>
      );
}
 
export default TermOfUseIndex;