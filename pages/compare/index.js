import { withRouter } from 'next/dist/client/router'
import { connect } from 'react-redux'
import LayoutV2 from '../../components/general/LayoutV2'
import ReduxPersistWrapper from '../../components/general/ReduxPersistWrapper'
import SocialNewsAndVideosPage from '../../components/news/page/SocialNewsAndVideosPage';
import _ from 'lodash';
import ComparePage from '../../components/compare/page/ComparePage';


const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            <ComparePage />
        </ReduxPersistWrapper>
    )
}


export async function getServerSideProps(context) {


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