import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';
import { withRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loading } from '../../../../redux/actions/app-actions';
import { setUser } from '../../../../redux/actions/user-actions';
import JoinClubButton from './join-club-button';



const ClubJoinModal = (props) => {

    const [visible, setVisible] = useState(false);

    const [club, setClub] = useState({});

    useEffect(() => {
        setVisible(props.visible);
    }, [props.visible])

    useEffect(() => {
        setClub(_.isPlainObject(props.club) && !_.isEmpty(props.club) ? props.club : {});
    }, [props.club])


    function closeModal() {
        if (props.onCancel) {
            props.onCancel()
        }
    }

    return (
        <Modal
            visible={visible}
            footer={null}
            centered
            maskClosable={false}
            width={1000}
            onCancel={() => { closeModal() }}
            closable={false}
            bodyStyle={{
                height: 300,
                backgroundImage: `url("/banner/1037-[Converted].png")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
            }}
        >
            <div className="relative-wrapper fill-parent">
                <span className='flex-justify-center flex-items-align-center padding-md' style={{ position: 'absolute', left: 0, right: 0, margin: 'auto', height: '63%', width: '33%' }} >
                    <div className="width-100">
                        <div className="h6 grey flex-items-align-center flex-justify-center font-weight-bold">
                            Join The Club
                        </div>
                        <div className="headline grey text-align-center">
                            For further interesting informations and posts!
                        </div>
                        <div className="flex-justify-center flex-items-align-center margin-top-md">
                            <JoinClubButton club={club} clubId={_.get(club, ['_id'])} userId={_.get(props.user, ['info', 'user', '_id'])}
                                onSuccess={(res) => {
                                    if (_.get(res, ['type']) == 'approved') {
                                        window.location.reload();
                                    }
                                }}
                                joinButton={(joinAction) => {
                                    return (
                                        <Button className="padding-x-xl border-ccar-button-yellow background-ccar-button-yellow round-border-big" style={{ boxShadow: '0px 0px 15px rgba(255, 204, 50, 1)' }}>Join</Button>
                                    )
                                }}
                                joinedButton={() => {
                                    return (
                                        <Button className="padding-x-xl border-ccar-button-yellow background-ccar-button-yellow round-border-big" style={{ boxShadow: '0px 0px 15px rgba(255, 204, 50, 1)' }}>Joined</Button>
                                    )
                                }}
                                pendingButton={() => {
                                    return (
                                        <Button className="padding-x-xl border-ccar-button-yellow background-ccar-button-yellow round-border-big" style={{ boxShadow: '0px 0px 15px rgba(255, 204, 50, 1)' }}>Pending Approval</Button>
                                    )
                                }}
                            />
                        </div>
                    </div>
                </span>
                <span className='d-inline-block ' style={{ position: 'absolute', top: 0, right: 0 }} >
                    <CloseOutlined className="white cursor-pointer" style={{ fontSize: 20 }} onClick={(e) => { closeModal() }} ></CloseOutlined>
                </span>
            </div>

        </Modal>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
    sellerProfile: state.sellerProfile,
});

const mapDispatchToProps = {
    loading: loading,
    setUser: setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ClubJoinModal)));