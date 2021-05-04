
import { Button, Col, Row } from 'antd';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { errorBanner } from '../../../icon';
import { loading } from '../../../redux/actions/app-actions';


const Error404Page = (props) => {

    return (
        <div className="section">
            <div className="container" >
                <Row style={{ height: '90vh' }} type="flex" align="middle">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="relative-wrapper width-100" style={{ height: '30vh' }}>
                            <img src={errorBanner} className="absolute-center-img-no-stretch" />
                        </div>
                        <div className="font-weight-bold h4 text-align-center uppercase margin-top-md blue-grey-darken-3">
                            SOMETHING WENT WRONG
                        </div>
                        <div className="margin-top-xl flex-items-no-shrink flex-justify-center">
                            <Link href={'/'} passHref >
                                <Button className=" border-ccar-button-yellow background-ccar-button-yellow padding-x-xl" >
                                    <div className="blue-grey-darken-3  font-weight-bold">
                                        Back To Home Page
                                </div>
                                </Button>
                            </Link>
                        </div>
                    </Col>

                </Row>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes
});

const mapDispatchToProps = {
    loading
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Error404Page));