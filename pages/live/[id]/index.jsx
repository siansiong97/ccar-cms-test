import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import { getLiveSeoData } from '../../../common-function';
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper';
import LivePage from '../../../components/live/LivePage';


const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            {
                props.app.initedRedux ?
                    <LivePage />
                    :
                    null
            }
        </ReduxPersistWrapper>
    )
}


export async function getServerSideProps(context) {


    console.log(context.req.params);
    console.log(context.req.query);
    const { id } = context.req.params 
    const { user, title, companyName } = context.req.query
    let broadCastInfo = {user, title, id, companyName}

    let seoData = getLiveSeoData(broadCastInfo);
    return {
        props: {
            cookie: _.get(context, ['req', 'headers', 'cookie']) || null,
            seoData,
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