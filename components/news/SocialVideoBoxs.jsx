import { Col, Empty, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import YouTube from 'react-youtube';
import { formatDate, notEmptyLength } from '../../common-function';
import { withRouter } from 'next/router';


let opts = {
    height: '390',
    width: '640',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        enablejsapi : 1,
    },
};
const AUTHORSIZE = 10
const SocialVideoBoxs = (props) => {

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        opts.playerVars.origin = window.location.host;
        console.log(opts.playerVars.origin);
    }, [])

    useEffect(() => {

        if (notEmptyLength(props.data)) {
            setVideos(props.data);
        } else {
            setVideos([]);
        }
    }, [props.data])


    return (


        <React.Fragment>
            {
                notEmptyLength(videos) ?
                    <Row gutter={[10, 10]}>
                        <div className="padding-x-md" style={{ height: '700px' }}>
                            {videos.map(function (item, i) {
                                return (
                                    <Col key={item._id} xs={24} sm={24} md={12} lg={8} xl={8} key={`video-${i}`}>
                                        <div className="wrap">
                                            <div className="video">

                                                <YouTube videoId={item.youtubeId} opts={opts} />
                                                {/* <iframe controls autoplay src="https://www.youtube.com/watch?v=gV7YudrTmQ4" style={{width: "100%"}} > */}
                                                {/* </iframe> */}
                                            </div>

                                            <div className="flex-items-align-start">
                                                <span>
                                                    <div className="icon">
                                                        <img src={item.channelThumbnailUrl} />
                                                    </div>
                                                </span>
                                                <span>
                                                    <div className="title">
                                                        <div className="text-truncate-twoline margin-bottom-sm font-weight-bold">
                                                            {item.title}
                                                        </div>
                                                        <div className="text-truncate">
                                                            {item.authorId ? item.authorId.name : null}
                                                        </div>
                                                        <div className="text-truncate">
                                                            {formatDate(item.publishedAt, "DD-MM-YYYY")}
                                                        </div>
                                                    </div>

                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })
                            }
                        </div>
                    </Row>
                    :
                    <div className="fill-parent">
                        <Empty></Empty>
                    </div>
            }
        </React.Fragment>

    );
}


const mapStateToProps = state => ({
    app: state.app,
    newCars: state.newCars,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(SocialVideoBoxs)));