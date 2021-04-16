import { Divider } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

const FAQFeatureBox = (props) => {


    return (
        <React.Fragment>
            <div className="thin-border round-border padding-md" id="features-topic-1">
                <div className="subtitle1 font-weight-bold">
                    What Are The Features Available In CCAR?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">
                        As an user, here are what you can do in CCAR :
                    </span>
                    <br></br>
                    
                    1. CarMarket: View, compare and buy your dream car.
                    <br></br>
                    2. CarFreaks: A social platform where you could share and gain their insights. There are 3 main functions in CarFreaks which are shown <a href={`/car-freaks`} target="_blank">here</a>.
                    <br></br>
                    3. LIVE (Live Streaming): Watch, like and share others’ live streaming.
                    <br></br>
                    4. Social News: Read the latest news related to automobiles.
                    <br></br>
                    5. Social Videos: Watch interesting car-related videos from trusted car influencers.
                    <br></br>
                    6. Driving Test Revision: Do revision on your upcoming driving test.
                    <br></br>
                    7. Petrol Price: Check out the weekly petrol price.
                    <br></br>
                    8. Contact Us: Submit your request or give your feedback to us.
                    <br></br>


                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    productsList: state.productsList,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(FAQFeatureBox);