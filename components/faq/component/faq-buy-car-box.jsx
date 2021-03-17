import { Divider } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { convertParameterToProductListUrl } from '../../../common-function';
import { allNewCarImg, carBrandImg, carMoreInfoImg, filterFormImg, newCarFilterFormImg, searchBoxImg, sortingImg } from '../../../icon';


const FAQBuyCarBox = (props) => {


    return (
        <React.Fragment>
            <div className="thin-border round-border padding-md" id="buyCar-topic-1">
                <div className="subtitle1 font-weight-bold">
                    How To Search My Dream Car?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    1st way:
                    <br></br>
                    1. Type the keyword for your desired car make or model in the Search Box.
                    <br></br>
                    2. Click the models which are available.
                    <br></br>
                    3. Have fun exploring!
                    <br></br>
                    <img src={searchBoxImg} />
                    <br></br>
                    2nd way:
                    <br></br>
                    1. For more filter options, please go to <a href={`/${convertParameterToProductListUrl()}`}>CarMarket</a>.
                    <br></br>
                    2. You could sort the available car ads through our sorting function. Besides, you could switch on the registration card filter and the 360 degree view filter as well.
                    <br></br>
                    <img src={sortingImg} />
                    <br></br>
                    3. If you would like to have more filters in finding your dream car, feel free to go to CarMarket and then filter them with the available options in Quick Filter Box.
                    <br></br>
                    <img src={filterFormImg} />
                    <br></br>
                    4. You could just key in the details you want and our system would do the filter for you.
                    <br></br>
                    5. Have fun exploring!
                    <br></br>
                    3rd way:
                    <br></br>
                    1. If you are looking for a brand new car, you could go to All-NewCar platform from our menu bar on the home page.
                    <br></br>
                    <img src={allNewCarImg} />
                    <br></br>
                    2. Choose your favourite brand.
                    <br></br>
                    <img src={carBrandImg} />
                    <br></br>
                    3. Utilize our search filter to find your dream car easily.
                    <br></br>
                    <img src={newCarFilterFormImg} />
                    <br></br>
                    4. Enjoy!
                    <br></br>

                </div>
            </div>
            <div className="thin-border round-border padding-md margin-top-md" id="buyCar-topic-2"> 
                <div className="subtitle1 font-weight-bold">
                    How Can I Get More Information About The Car?
                </div>
                <Divider style={{ margin: '5px 0' }} />
                <div className="subtitle1 text-overflow-break " style={{ lineHeight: 1.75 }}>
                    <span className="font-weight-bold">You could get more information about the car from the following features:</span>
                    <br></br>
                    <img src={carMoreInfoImg}></img>
                    <br></br>
                    1. Whatsapp: For the dealer who is available on whatsapp, you are welcomed to give him/her a text.
                    <br></br>
                    2. Call: Give the dealer a call for more information.
                    <br></br>
                    3. Compare: Compare the specifications of your preferable cars.
                    <br></br>
                    4. 360 degree view: View the car in 360 degree from different seat views such as driver seat, passenger seat and center seat.
                    <br></br>
                    5. Registration card: Get to know the identification details of the car
                    <br></br>
                    6. Car Loan Calculator: Calculate your estimated car loan for different loan periods and interest rate
                    <br></br>

                    Note: Do make sure you have enough information before making any decision. :)



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

export default connect(mapStateToProps, mapDispatchToProps)(FAQBuyCarBox);