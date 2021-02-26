import '@brainhubeu/react-carousel/lib/style.css';
import { Col, Form, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/dist/client/router';
import { notEmptyLength } from '../../../profile/common-function';
import { imageNotFound } from '../../../userProfile/config';
import axios from 'axios';
import client from '../../../../feathers';

const PAGE_SIZE = 3;

const OtherClubsBox = (props) => {

    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        if (props.userId || props.clubId) {
            getOtherClubs(props.userId, props.clubId);
        }
    }, [props.userId, props.clubId])

    function getOtherClubs(userId, clubId) {
        if (userId || clubId) {
            let query = {
                userId,
                clubId,
            }
            if(!userId){
                delete query.userId;
            }
            if(!clubId){
                delete query.clubId;
            }
            axios.get(`${client.io.io.uri}getOtherClubs`, {
                params: {
                    limit: PAGE_SIZE,
                    ...query,
                }
            }).then(res => {
                setClubs(_.isArray(_.get(res, ['data', 'data'])) && !_.isEmpty(_.get(res, ['data', 'data'])) ? _.get(res, ['data', 'data']) : [])
            }).catch(err => {
            });
        } else {
            setClubs([]);
        }
    }

    return (
        <React.Fragment>
            {
                _.isArray(clubs) && notEmptyLength(clubs) ?
                    <React.Fragment>
                        <div className="flex-justify-space-around flex-items-align-center flex-wrap padding-md">
                            {
                                _.map(clubs, function (club) {
                                    return (
                                        <span className='d-inline-block relative-wrapper flex-items-no-shrink margin-md cursor-pointer' style={{ height: 150, width: '100%', overflow: 'hidden' }} onClick={() => {
                                            if (_.get(club, ['_id'])) {
                                                props.router.push(`/social-club/${club._id}`)
                                            }
                                        }} >
                                            <img className=" img-cover fill-parent absolute-center" src={_.get(club, ['clubAvatar']) || imageNotFound} />
                                            <div className="fill-parent background-black-opacity-50 flex-items-align-center flex-justify-center padding-md absolute-center stack-element-opacity-100">
                                                <span className='d-inline-block white h6 text-truncate-threeline' >
                                                    {_.get(club, ['clubName']) || ''}
                                                </span>
                                            </div>
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </React.Fragment>
                    :
                    null
            }
        </React.Fragment >
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    userlikes: state.userlikes,
    carFreak: state.carFreak,
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(OtherClubsBox)));