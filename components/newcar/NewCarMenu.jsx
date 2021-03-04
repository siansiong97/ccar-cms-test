import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';



const NewCarMenu = (props) => {

    const [view, setView] = useState('overview');

    useEffect(() => {
        if (props.onChange) {
            props.onChange(view);
        }
    }, [view])

    useEffect(() => { 
    
        setView(props.view)
    } , [props.view])


    return (
        <React.Fragment>
            <div style={{ position: 'sticky', top: props.app.menuHeight, zIndex: 99 }} className=" flex-items-align-center flex-justify-start background-white padding-y-sm">
                <span className={view == 'overview' ? 'd-inline-block margin-x-md  subtitle1 font-weight-bold cursor-pointer yellow hover-yellow padding-sm' : 'd-inline-block margin-x-md grey-darken-3 subtitle1 font-weight-bold cursor-pointer hover-yellow padding-sm'} onClick={(e) => { setView('overview') }} >
                    Overview
            </span>
                {/* <span className='d-inline-block margin-x-md grey-darken-3 subtitle1 font-weight-bold' >
                    |
            </span>
                <span className={view == 'news' ? 'd-inline-block margin-x-md subtitle1 font-weight-bold cursor-pointer white hover-white padding-sm' : 'd-inline-block margin-x-md grey-darken-3 subtitle1 font-weight-bold cursor-pointer hover-white padding-sm'} onClick={(e) => { setView('news') }}>
                    News
            </span> */}
                <span className='d-inline-block margin-x-md grey-darken-3 subtitle1 font-weight-bold' >
                    |
            </span>
                <span className={view == 'specs' ? 'd-inline-block margin-x-md subtitle1 font-weight-bold cursor-pointer yellow  hover-yellow padding-sm' : 'd-inline-block margin-x-md grey-darken-3 subtitle1 font-weight-bold cursor-pointer hover-yellow padding-sm'} onClick={(e) => { setView('specs') }}>
                    Specs
            </span>
                {/* <span className='d-inline-block margin-x-md grey-darken-3 subtitle1 font-weight-bold' >
                    |
            </span>
                <span className={view == 'reviews' ? 'd-inline-block margin-x-md subtitle1 font-weight-bold cursor-pointer yellow hover-yellow padding-sm' : 'd-inline-block margin-x-md grey-darken-3 subtitle1 font-weight-bold cursor-pointer hover-yellow padding-sm'} onClick={(e) => { setView('reviews') }}>
                    Reviews
            </span> */}
            </div>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(NewCarMenu)));