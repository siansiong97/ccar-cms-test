import { Divider } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

const FAQSellCarBox = (props) => {


    return (
        <React.Fragment>
            <div className="thin-border round-border padding-md" id="sellCar-topic-1">
                <div className="subtitle1 font-weight-bold">
                    How To Sell A Car?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">
                        In order to be qualified to sell a car, you are required to set up a dealer account with us. Please drop an email to us at info@ccar.my or submit a request form through contact us. We will get back to you within 24 hours. See you soon!
                    </span>
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

export default connect(mapStateToProps, mapDispatchToProps)(FAQSellCarBox);