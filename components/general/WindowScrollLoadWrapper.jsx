import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import { isValidNumber } from '../../common-function';
import { withRouter } from 'next/router';


let uid = v4();
let containerRef = {};
containerRef[uid] = React.createRef();

let triggerFunction;
const WindowScrollLoadWrapper = (props) => {

    const [scrollRange, setScrollRange] = useState(100);

    useEffect(() => {
        setScrollRange(isValidNumber(props.scrollRange) ? parseFloat(props.scrollRange) : 100)
    }, [props.scrollRange])

    useEffect(() => {

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    })

    function handleScroll(e) {
        clearTimeout(triggerFunction)
        let scrollBarHeight = window.innerHeight * (window.innerHeight / document.body.offsetHeight);
        if (window.scrollY + scrollBarHeight + scrollRange >= document.body.scrollHeight) {
            if (props.onScrolledBottom) {
                triggerFunction = setTimeout(() => {
                    props.onScrolledBottom();
                }, 100);
            }
        }

    };

    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(WindowScrollLoadWrapper)));