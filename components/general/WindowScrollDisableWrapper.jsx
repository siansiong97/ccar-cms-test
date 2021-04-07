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
const WindowScrollDisableWrapper = (props) => {

    const [scrollY, setScrollY] = useState(100);

    useEffect(() => {

        if (typeof (document) != undefined) {
            if (props.disabled) {
                document.body.style.position = 'fixed';
                console.log(scrollY);
                document.body.style.top = `-${scrollY}px`;
            } else {
                document.body.style.position = '';
                console.log(parseInt(document.body.style.top || '0') * -1);
                window.scrollTo({
                    top : parseInt(document.body.style.top || '0') * -1,
                    behavior : 'auto'
                });
            }
        }

    }, [props.disabled])

    useEffect(() => {

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    })

    function handleScroll(e) {
        if (typeof (window) != undefined) {
            setScrollY(window.scrollY);
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
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(WindowScrollDisableWrapper)));