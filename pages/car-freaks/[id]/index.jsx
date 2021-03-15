import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper';
import CarFreakDetailsPage from '../../../components/carFreak/page/car-freak-details-page';
import { getCarFreakSeoData } from '../../../common-function';
import client from '../../../feathers';


const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            {
                props.app.initedRedux ?
                    <CarFreakDetailsPage />
                    :
                    null
            }
        </ReduxPersistWrapper>
    )
}


export async function getServerSideProps(context) {


    const { id } = context.req.params;
    let data = {};
    let seoData = {};
    if (id) {
        data = await client.service('chats').find({
            query: {
                _id: id,
                chatType : 'carfreaks',
                $populate : 'userId'
            }
        })
        data = _.get(data, 'data[0]') || {}
    }

    if (_.isPlainObject(data) && !_.isEmpty(data)) {
        seoData = getCarFreakSeoData(data);
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