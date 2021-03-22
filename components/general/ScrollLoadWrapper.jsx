import { Form } from 'antd';
import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import { withRouter } from 'next/router';
import { isValidNumber } from '../../common-function';



let uid = v4();
let containerRef = {};
containerRef[uid] = React.createRef();

const ScrollLoadWrapper = (props) => {


    function checkScrolledToBottom(ref) {
        try {
            if (!!ref) {

                let scrollHeight = ref.current.getScrollHeight();
                let currentPosition = ref.current.getValues();
                currentPosition = currentPosition.scrollTop + currentPosition.clientHeight;

                let scrollRange = 30;
                if(isValidNumber(props.scrollRange)){
                    if(props.scrollRangeUsePercentage){
                        scrollRange = scrollHeight * (parseFloat(props.scrollRange) / 100);
                    }else{
                        scrollRange = parseFloat(props.scrollRange);
                    }
                }
                if (scrollHeight - currentPosition <= scrollRange) {
                    if (props.onScrolledBottom) {
                        props.onScrolledBottom();
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(_.get(containerRef, [uid, 'current'])){
            if(props.getRef){
                props.getRef(containerRef[uid].current);
            }
        }
    
    } , [containerRef[uid]])



    return (
        <React.Fragment>

            <Scrollbars 
            autoHide 
            style={{ height: '100%', width: '100%', ...props.style }} 
            ref={containerRef[uid]} onScrollStop={() => { checkScrolledToBottom(containerRef[uid]) }}
            autoHeightMax={props.autoHeightMax || 'auto'}
            autoHeightMin={props.autoHeightMin || 'auto'}
            autoHeight={props.autoHeight || false}
             >
                {props.children}
            </Scrollbars>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ScrollLoadWrapper)));