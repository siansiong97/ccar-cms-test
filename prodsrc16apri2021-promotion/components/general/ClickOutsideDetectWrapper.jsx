import { Form } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import { withRouter } from 'next/router';


let uid = v4();
let ref = {};
ref[uid] = React.createRef();



const ClickOutsideDetectWrapper = (props) => {

    useEffect(() => {

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    useEffect(() => { 
    
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    })

    function handleClickOutside(event) {

        if ((!ref[uid].current || !ref[uid].current.contains(event.target))) {
            if (props.onClickedOutside) {
                props.onClickedOutside();
            }
        }
    }


    return (
        <span className={`${props.className || ''}`} style={{ ...props.style }} id={props.id || uid} ref={ref[uid]}>
            {props.children}
        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClickOutsideDetectWrapper)));