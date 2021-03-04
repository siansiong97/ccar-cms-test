import { Form, Icon } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import { isValidNumber } from '../../common-function';
import { withRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';


let uid = v4();
let containerRef = {};
containerRef[uid] = React.createRef();

let triggerFunction;
const InfiniteScrollWrapper = (props) => {

    const [htmlWindow, setHtmlWindow] = useState(true);

    useEffect(() => {
        if (window) {
            setHtmlWindow(window);
        }
    }, [])

    return (
        <React.Fragment>
            <InfiniteScroll
                loadMore={() => {
                    if (props.onScrolledBottom) {
                        clearTimeout(triggerFunction)
                        triggerFunction = setTimeout(() => {
                            props.onScrolledBottom();
                        }, 500);
                    }
                }}
                hasMore={props.hasMore != null ? props.hasMore : true}
                useWindow
                loader={
                    <div className="width-100 flex-justify-center" style={{ height: 50 }}>
                        <Icon type="loading" style={{ fontSize: 50 }} />
                    </div>
                }
                threshold={(htmlWindow.innerHeight || 500) * 0.5}
            >
                {props.children}
            </InfiniteScroll>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(InfiniteScrollWrapper)));