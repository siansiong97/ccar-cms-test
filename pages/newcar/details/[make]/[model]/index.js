import Axios from 'axios';
import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import { getAllNewCarSeoData } from '../../../../../common-function';
import ReduxPersistWrapper from '../../../../../components/general/ReduxPersistWrapper';
import NewCarDetailsPage from '../../../../../components/newcar/page/NewCarDetailsPage';
import client from '../../../../../feathers';


const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            {
                props.app.initedRedux ?
                    <NewCarDetailsPage />
                    :
                    null
            }
        </ReduxPersistWrapper>
    )
}


export async function getServerSideProps(context) {

    const { make, model } = context.req.params;
    let data = {};
    let seoData = {};
    if (make && model) {
        data = await Axios.get(`${client.io.io.uri}priceRangeSearchNew`,
            {
                params: {
                    match: { make: (make || '').toLowerCase(), model: (model || '').toLowerCase() },
                    limit: 1,
                    newCar: 'yes',
                    skip: 0,
                }
            }
        )
        data = _.get(data, 'data.data[0]') || {}
    }

    if (_.isPlainObject(data) && !_.isEmpty(data)) {
        seoData = getAllNewCarSeoData(data);
    }

    return {
        props: {
            cookie: _.get(context, ['req', 'headers', 'cookie']) || null,
            seoData: {
                ...seoData,
            }
        }
    }
}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    productsList: state.productsList,
});


const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Index));