import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper';
import CarFreakDetailsPage from '../../../components/carFreak/page/car-freak-details-page';


const searchBarRef = React.createRef();
const Index = (props) => {

    console.log(props.router.query);

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


    console.log(context.req);
    return {
        props: {
            cookie: _.get(context, ['req', 'headers', 'cookie']),
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