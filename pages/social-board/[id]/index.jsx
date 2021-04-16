import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import { getSocialBoardSeoData } from '../../../common-function';
import SocialBoardDetailsPage from '../../../components/carFreak/page/social-board-details-page';
import ReduxPersistWrapper from '../../../components/general/ReduxPersistWrapper';
import client from '../../../feathers';


const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            {
                props.app.initedRedux ?
                    <SocialBoardDetailsPage />
                    :
                    null
            }
        </ReduxPersistWrapper>
    )
}


export async function getServerSideProps(context) {

    let id = _.get(context, `req.params.id`) || _.get(context, `req.query.id`);
    let data = {};
    let seoData = {};
    if (id) {
        data = await client.service('chats').find({
            query: {
                _id: id,
                chatType: 'socialboard',
                $populate: 'userId'
            }
        })
        data = _.get(data, 'data[0]') || {}
    }

    if (_.isPlainObject(data) && !_.isEmpty(data)) {
        seoData = getSocialBoardSeoData(data);
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