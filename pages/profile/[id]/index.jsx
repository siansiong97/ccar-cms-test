import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import { getProfileSeoData } from '../../../common-function';
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper';
import ProfileHomePage from '../../../components/profile/page/ProfileHomePage';
import client from '../../../feathers';


const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            {
                props.app.initedRedux ?
                    <ProfileHomePage />
                    :
                    null
            }
        </ReduxPersistWrapper>
    )
}


export async function getServerSideProps(context) {

    let id = _.get(context, `req.params.id`) || _.get(context, `req.query.id`);
    let profile = {};
    let seoData = {};
    if (id) {
        profile = await client.service('users').find({
            query: {
                userurlId: id,
            }
        })
        profile = _.get(profile, 'data[0]') || {}
    }

    if (_.isPlainObject(profile) && !_.isEmpty(profile)) {
        seoData = getProfileSeoData(profile);
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