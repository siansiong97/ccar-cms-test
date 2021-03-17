import { Divider } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

const FAQAccountBox = (props) => {


    return (
        <React.Fragment>
            <div className="thin-border round-border padding-md" id="account-topic-1">
                <div className="subtitle1 font-weight-bold">
                    How To Create My CCAR Account?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">We welcome you to be part of our big family!</span>
                    <br></br>
                    If you are an user, here are the steps to create your own CCAR account:
                    <br></br>
                    1. Click the “Login” tab at the top right corner of our menu bar in the home page.
                    <br></br>
                    2. You can choose to log in with either your Google/Facebook account.
                    <br></br>
                    3. Sign in to your Google/Facebook account as your CCAR account would be automatically generated through your Google/Facebook account.
                    <br></br>
                    4. Congratulations! You are part of our family now!
                    <br></br>

                    <span className="font-weight-bold">Note: If you are a dealer, please choose the “Login as Business Owner” option and log in with your username and password.</span>
                    <br></br>
                    Have fun in CCAR! =D

                </div>
            </div>
            <div className="thin-border round-border padding-md margin-top-md" id="account-topic-2">
                <div className="subtitle1 font-weight-bold">
                    Can I Change My Freak ID?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">Yes, definitely you can! You can change your freak it by</span>
                    <br></br>
                    1. Clicking your profile icon to go to your profile tab.
                    <br></br>
                    2. Click “edit profile”.
                    <br></br>
                    3. Change your Freak ID.
                    <br></br>
                    4. Submit the request.
                    <br></br>
                    5. You’re now with your latest Freak ID! Congrats!


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

export default connect(mapStateToProps, mapDispatchToProps)(FAQAccountBox);