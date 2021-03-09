import _ from 'lodash'
import { withRouter } from 'next/dist/client/router'
import { connect } from 'react-redux'
import brandFilterTotal from '../../../../api/brandFilterTotal'
import carAdsFilter from '../../../../api/carAdsFilter'
import CarMarketPage from '../../../../components/product-list/page/CarMarketPage'
import { loading } from '../../../../redux/actions/app-actions'
import { convertProductRouteParamsToFilterObject } from '../../../../common-function'
import ReduxPersistWrapper from '../../../../components/general/ReduxPersistWrapper'

const modals = ['make', 'model', 'state', 'area', 'bodyType', 'color', 'fuelType'];
const antIcon = <img src="/assets/Ccar-logo.png" style={{ fontSize: 60 }} />;
const PAGESIZE = 30;
const searchBarRef = React.createRef();
const Index = (props) => {

    return (
        <ReduxPersistWrapper cookie={props.cookie}>
            <CarMarketPage
                productList={props.productList || {}}
                config={props.config || {}}
                availableOptions={props.availableOptions || {}}
                productListTotal={props.productListTotal || 0}
                filterGroup={props.filterGroup || {}} />
        </ReduxPersistWrapper>
    )
}


export async function getServerSideProps(context) {

    const { parameter1, parameter2, parameter3 } = context.params;

    let filterObj = context.query || {};
    if (filterObj.data) {
        try {
            filterObj.data = JSON.parse(filterObj.data) || {};
            filterObj = {
                ...filterObj.data,
                ...filterObj,
            }
        } catch (error) {

        }
        delete filterObj.data;
    }
    if (filterObj.sorting) {
        try {
            filterObj.sorting = JSON.parse(filterObj.sorting) || {};
        } catch (error) {

        }
    }
    filterObj = convertProductRouteParamsToFilterObject(filterObj);
    if (_.get(filterObj, ['filterGroup'])) {
        filterObj.filterGroup.condition = 'recon';
    }

    let promises = [];
    promises.push(carAdsFilter(_.cloneDeep(filterObj), PAGESIZE));
    promises.push(brandFilterTotal(modals, filterObj));

    let [carAdsRes, brandFilterRes] = await Promise.all(promises)

    return {
        props: {
            cookie: _.get(context, ['req', 'headers', 'cookie']) || null,
            productList: _.get(carAdsRes, ['data']) || [],
            productListTotal: _.get(carAdsRes, ['total']) || 0,
            filterGroup: _.get(filterObj, ['filterGroup']) || {},
            config: _.get(filterObj, ['config']) || {},
            availableOptions : brandFilterRes || {},
        }
    }
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    productsList: state.productsList,
});


const mapDispatchToProps = {
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Index))