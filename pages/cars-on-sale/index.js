import axios from 'axios'
import _ from 'lodash'
import { withRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import LayoutV2 from '../../components/general/LayoutV2'
import ReduxPersistWrapper from '../../components/general/ReduxPersistWrapper'
import client from '../../feathers'
import { convertParameterToProductListUrl } from '../../common-function'
import redirect from 'nextjs-redirect'


const searchBarRef = React.createRef();
const Index = (props) => {


    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            <LayoutV2>
            </LayoutV2>
        </ReduxPersistWrapper>
    )
}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    productsList: state.productsList,
});


const mapDispatchToProps = {
};
let path = convertParameterToProductListUrl();

export default redirect(path);