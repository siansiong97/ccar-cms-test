import { ShareAltOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal } from 'antd';
import copy from "copy-to-clipboard";
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { notEmptyLength } from '../../common-function';
import SocialShareButton from './SocialShareButton';



const ShareButtonDialog = (props) => {

    const [visible, setVisible] = useState(false);
    const [link, setLink] = useState();
    const [title, setTitle] = useState('');
    const [iconSize, setIconSize] = useState(38);
    const [shape, setShape] = useState('square');
    const [network, setNetwork] = useState([
        // 'email',
        'facebook',
        // 'messenger',
        // 'hatena',
        // 'instapaper',
        // 'linkedin',
        'line',
        // 'livejournal',
        // 'mailru',
        // 'ok',
        // 'pinterest',
        // 'pocket',
        // 'reddit',
        'telegram',
        // 'tumblr',
        'twitter',
        // 'viber',
        // 'vk',
        // 'weibo',
        'whatsapp',
        // 'workplace',
    ]);


    useEffect(() => {
        if(!props.link){
            setLink(window.location.href)
        }
    } , [])

    function close(e) {
        setVisible(false);
    }

    function copyToClipboard() {
        copy(link);
        message.info('Copied link. Share it to others now!');
    }

    useEffect(() => {
        let link;
        try {
            if (props.link) {
                link = props.link;
            } else {
                link = window.location.href;
            }

            if (!link.includes('http://') && !link.includes('https://')) {
                let prefix = window.location.href.split('//');
                let naming = prefix[1].split('/')[0]
                link = prefix[0] + '//' + naming + link;
            }
            link = link.split('//')
            let surfix = link[1].split('/');
            // surfix[0] = `share.${surfix[0]}`;
            surfix[0] = `${surfix[0]}`;
            surfix = surfix.join('/');
            link[1] = surfix; 
            link = link.join('//');
        } catch (error) {
            link = window.location.href;
        }
        
        setLink(link);

    }, [props.link, props.router.asPath])

    useEffect(() => {

        if (props.title) {
            setTitle(props.title)
        }
    }, [props.title])

    useEffect(() => {

    }, [title])

    useEffect(() => {
        if (props.iconSize) {
            setIconSize(props.iconSize)
        }
    }, [props.iconSize])

    useEffect(() => {
        if (notEmptyLength(props.network)) {
            setNetwork(props.network)
        }
    }, [props.network])

    useEffect(() => {
        if (notEmptyLength(props.shape)) {
            setShape(props.shape)
        }
    }, [props.shape])


    return (

        <React.Fragment>
            <Modal
                visible={visible}
                centered
                maskClosable={true}
                closable={false}
                footer={null}
                onCancel={close}
            >
                <div className="flex-justify-center flex-items-align-center flex-wrap padding-sm ">
                    <div className="flex-justify-center flex-items-align-center padding-sm width-100 margin-bottom-sm ">
                        <span className="d-inline-block margin-x-sm " style={{ width: '30px', height: '30px' }}>
                            <img src="https://img.icons8.com/ios-filled/26/000000/forward-arrow.png" className="fill-parent" />
                        </span>
                        <span className="d-inline-block subtitle1 font-weight-bold text-overflow-break margin-x-sm" >
                            Share to...
                        </span>
                    </div>

                    <div className='padding-sm width-100'>
                        {
                            notEmptyLength(network) ?
                                <div className='flex-justify-center flex-items-align-center flex-wrap'>
                                    <SocialShareButton link={link} title={title} network={network} iconSize={iconSize} shape={shape} />
                                </div>
                                :
                                null
                        }
                        <div className="flex-justify-center flex-items-align-center flex-wrap">

                            <a onClick={copyToClipboard}>
                                <span className="d-inline-block flex-justify-center flex-items-align-center background-transparent thin-border margin-md" style={{ width: "auto", height: '40px', padding: 12, borderRadius: 4 }}>
                                    <span className="d-inline-block margin-x-sm relative-wrapper" style={{ width: '22px', height: '22px' }}>
                                        <img src="https://img.icons8.com/ios/50/000000/copy-link.png" className="fill-parent absolute-center" />
                                    </span>
                                    <span className="d-inline-block headline   font-weight-bold text-overflow-break grey-darken-3">
                                        Copy Link
                                </span>
                                </span>
                            </a>
                        </div>
                    </div>

                </div>
            </Modal>

            <a onClick={(e) => props.readOnly ? null : setVisible(true)}>
                {
                    props.children ?
                        props.children
                        :
                        <Button className={props.className ? props.className : "padding-x-sm"} style={props.style ? props.style : null}><ShareAltOutlined />Share</Button>
                }
            </a>

        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ShareButtonDialog)));