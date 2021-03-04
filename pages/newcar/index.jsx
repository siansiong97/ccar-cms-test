import _ from 'lodash';
import { withRouter } from 'next/dist/client/router';
import { connect } from 'react-redux';
import ReduxPersistWrapper from '../../components/general/ReduxPersistWrapper';
import NewCarHomePage from '../../components/newcar/page/NewCarHomePage';


const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            <NewCarHomePage />
        </ReduxPersistWrapper>
    )
}


// export async function getServerSideProps(context) {


//     return {
//         props: {
//             cookie: _.get(context, ['req', 'headers', 'cookie']),
//         }
//     }
// }

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    productsList: state.productsList,
});


const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Index));