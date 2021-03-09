import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper';
import SocialClubProfilePage from '../../../components/carFreak/page/social-club-profile-page';

const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            {
                props.app.initedRedux ?
                    <SocialClubProfilePage />
                    :
                    null
            }
        </ReduxPersistWrapper>
    )
}


export async function getServerSideProps(context) {


    return {
        props: {
            cookie: _.get(context, ['req', 'headers', 'cookie']) || null,
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