import { Form } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, HatenaIcon, HatenaShareButton, InstapaperIcon, InstapaperShareButton, LineIcon, LineShareButton, LinkedinIcon, LinkedinShareButton, LivejournalIcon, LivejournalShareButton, MailruIcon, MailruShareButton, OKIcon, OKShareButton, PocketIcon, PocketShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TumblrIcon, TumblrShareButton, TwitterIcon, TwitterShareButton, ViberIcon, ViberShareButton, VKIcon, VKShareButton, WeiboIcon, WeiboShareButton, WhatsappIcon, WhatsappShareButton, WorkplaceIcon, WorkplaceShareButton } from "react-share";
import { withRouter } from 'next/router';
import { notEmptyLength } from '../../common-function';


const SocialShareButton = (props) => {

    const [link, setLink] = useState(window.location.href);
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
        if (props.link) {
            setLink(props.link)
        }
    }, [props.link])

    useEffect(() => {

        if (props.title) {
            setTitle(props.title)
        }
    }, [props.title])

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
        if (props.shape) {
            setShape(props.shape)
        }
    }, [props.shape])




    const _renderSocialShareButton = (value) => {
        switch (value) {
            case 'email':
                return (
                    <EmailShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <EmailIcon size={iconSize} round={shape == 'square' ? false : true}  />
                    </EmailShareButton>
                )
            case 'facebook':
                return (
                    <FacebookShareButton url={link} quote={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <FacebookIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </FacebookShareButton>
                )
            // case 'messenger':
            //     return (
            //         <FacebookMessengerShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
            //             <FacebookMessengerIcon size={iconSize} round={shape == 'square' ? false : true} />
            //         </FacebookMessengerShareButton>
            //     )
            case 'hatena':
                return (
                    <HatenaShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <HatenaIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </HatenaShareButton>
                )
            case 'instapaper':
                return (
                    <InstapaperShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <InstapaperIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </InstapaperShareButton>
                )
            case 'linkedin':
                return (
                    <LinkedinShareButton edinShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <Link shallow={false} passHref edinIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </LinkedinShareButton>
                )
            case 'line':
                return (
                    <LineShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <LineIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </LineShareButton>
                )
            case 'livejournal':
                return (
                    <LivejournalShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <LivejournalIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </LivejournalShareButton>
                )
            case 'mailru':
                return (
                    <MailruShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <MailruIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </MailruShareButton>
                )
            case 'ok':
                return (
                    <OKShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <OKIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </OKShareButton>
                )
            // case 'pinterest':
            //     return (
            //         <PinterestShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
            //             <PinterestIcon size={iconSize} round={shape == 'square' ? false : true} />
            //         </PinterestShareButton>
            //     )
            case 'pocket':
                return (
                    <PocketShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <PocketIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </PocketShareButton>
                )
            case 'reddit':
                return (
                    <RedditShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <RedditIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </RedditShareButton>
                )
            case 'telegram':
                return (
                    <TelegramShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <TelegramIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </TelegramShareButton>
                )
            case 'tumblr':
                return (
                    <TumblrShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <TumblrIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </TumblrShareButton>
                )
            case 'twitter':
                return (
                    <TwitterShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <TwitterIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </TwitterShareButton>
                )
            case 'viber':
                return (
                    <ViberShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <ViberIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </ViberShareButton>
                )
            case 'vk':
                return (
                    <VKShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <VKIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </VKShareButton>
                )
            case 'weibo':
                return (
                    <WeiboShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <WeiboIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </WeiboShareButton>
                )
            case 'whatsapp':
                return (
                    <WhatsappShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <WhatsappIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </WhatsappShareButton>
                )
            case 'workplace':
                return (
                    <WorkplaceShareButton url={link} title={title} className='margin-sm flex-justify-center flex-items-align-center round-border'>
                        <WorkplaceIcon size={iconSize} round={shape == 'square' ? false : true} />
                    </WorkplaceShareButton>
                )
            default:
                break;
        }
    }

    return (

        <React.Fragment>

            {
                notEmptyLength(network) ?
                    _.map(network, function (v) {
                        return _renderSocialShareButton(v);
                    })
                    :
                    null
            }
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialShareButton)));