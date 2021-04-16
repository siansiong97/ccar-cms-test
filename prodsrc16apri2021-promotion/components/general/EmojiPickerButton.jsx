import { Form, Icon } from 'antd';
import { Picker } from 'emoji-mart';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { notEmptyLength, objectRemoveEmptyValue } from '../../common-function';


const emojiRef = React.createRef();
const EmojiPickerButton = (props) => {

    const [emojiVisible, setEmojiVisible] = useState(false);

    useEffect(() => {

        function handleClickOutside(event) {

            if ((!emojiRef.current || !emojiRef.current.contains(event.target))) {
                setEmojiVisible(false)
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiRef.current])

    function handleOnSelect(emoji) {
        if (props.onSelect) {
            props.onSelect(emoji);
        }
    }


    return (
        <React.Fragment>
            <span className='d-inline-block relative-wrapper' >
                <span onClick={(e) => { setEmojiVisible(true) }} >
                    {
                        props.children ?
                            props.children
                            :
                            <Icon type="smile" className='cursor-pointer' />
                    }
                </span>
                {
                    emojiVisible ?
                        <span className={`d-inline-block ${props.className || ''}`} ref={emojiRef} style={notEmptyLength(objectRemoveEmptyValue(props.position)) ? { position: 'absolute', ...props.position, zIndex : 999999 } : { position: 'absolute', top: -380, left: -200, zIndex : 999999 }}>
                            <Picker enableFrequentEmojiSort useButton theme='auto' showPreview={false} showSkinTones={false} perLine={6} onClick={(emoji) => {
                                handleOnSelect(emoji);
                            }} />
                        </span>
                        :
                        null
                }
            </span>

        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(EmojiPickerButton)));