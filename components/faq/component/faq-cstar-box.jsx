import { Divider } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { cstarAnimationImg, cstarListImg } from '../../../icon';

const FAQCstarBox = (props) => {


    return (
        <React.Fragment>
            <div className="thin-border round-border padding-md" id="cstar-topic-1">
                <div className="subtitle1 font-weight-bold">
                    What Is CSTAR?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">
                        CSTAR is an In-App Currency which can be used to purchase different gifts for livestreamers. The virtual gifts will be in the form of animations and the live streamers will be notified once they have received your gifts.
                    </span>
                    <br></br>

                </div>
            </div>
            <div className="thin-border round-border padding-md margin-top-md" id="cstar-topic-2">
                <div className="subtitle1 font-weight-bold">
                    How To Buy CSTAR?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">
                        To get your CSTAR, you could go to
                    </span>
                    <br></br>
                        1. Your profile
                    <br></br>
                        2. Click the “Manage your profile” tab.
                    <br></br>
                        3. Go to CSTAR and all of the packages would be shown here.
                    <br></br>
                        4. Purchase the available packages through our payment gateway
                    <br></br>

                        Congratulations! You could give your virtual gift for the livestreamer now hooray!
                </div>
            </div>
            <div className="thin-border round-border padding-md margin-top-md" id="cstar-topic-3">
                <div className="subtitle1 font-weight-bold">
                    How To Use CSTAR?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">
                        In order to be able to use CSTAR, you are required to:
                    </span>
                    <br></br>
                        1. Click our CSTAR icon in LIVE for animations that are available.
                    <br></br>
                        2. Click the animation and purchase by using your CSTAR.
                    <br></br>
                        3. Once you have bought your animation, your virtual gift will be shown on the live streaming and the live streamer will be notified.
                    <br></br>

                    For more information on buying CSTAR, please refer <a>here</a>.
                </div>
            </div>
            <div className="thin-border round-border padding-md margin-top-md" id="cstar-topic-4">
                <div className="subtitle1 font-weight-bold">
                    What Can Live Streamer Do With CSTAR?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">
                        Once the live streamer has received CSTAR, the CSTAR could be used to convert to CCOIN with the following rules:
                    </span>
                    <br></br>
                    <ul>
                        <li>
                            Every CSTAR = 0.045 CCOIN
                        </li>
                        <li>
                            Every 200 CSTAR will be converted to 9 CCOIN automatically.
                        </li>
                    </ul>
                    <span className="font-weight-bold">
                        Note: The total CSTAR received would be finalized and notified once the livestream ends.
                    </span>

                </div>
            </div>
            <div className="thin-border round-border padding-md margin-top-md" id="cstar-topic-5">
                <div className="subtitle1 font-weight-bold">
                    Here are our available packages with price:
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <img src={cstarListImg} />
                    <br></br>
                        No worries, CSTAR has no limit on validity so you can use it anytime! :)

                </div>
            </div>
            <div className="thin-border round-border padding-md margin-top-md" id="cstar-topic-6">
                <div className="subtitle1 font-weight-bold">
                    Here are our current available packages:
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <img src={cstarAnimationImg} />
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

export default connect(mapStateToProps, mapDispatchToProps)(FAQCstarBox);