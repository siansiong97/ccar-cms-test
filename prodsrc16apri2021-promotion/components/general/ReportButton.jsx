import { Button, Form, Input, message, Modal } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { loading, loginMode } from '../../redux/actions/app-actions';
import client from '../../feathers';


const ReportButton = (props) => {


    const { form } = props;
    const { getFieldDecorator } = form;
    const [report, setReport] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isReported, setIsReported] = useState(false);
    const [type, setType] = useState();

    useEffect(() => {
        getReport();
    }, [props.reporterId, type, props[type + 'Id']])

    useEffect(() => {
        if (props.type) {
            setType(props.type);
        } else {
            setType('');
        }
    }, [props.type])

    useEffect(() => {
        setIsReported(_.isPlainObject(report) && !_.isEmpty(report))
    }, [report])

    function getReport() {
        if (props.reporterId && props[type + 'Id'] && type) {
            let query = {
                $limit: 1,
            };
            query[type + 'Id'] = props[type + 'Id'];
            query.type = type;
            query.reporterId = props.reporterId

            client.service('report').find({
                query: query
            }).then(res => {
                setReport(_.isArray(res.data) && !_.isEmpty(res.data) ? res.data[0] : {});
                setIsReported(_.isArray(res.data) && !_.isEmpty(res.data) ? _.isPlainObject(res.data[0]) && !_.isEmpty(res.data[0]) : false);
            }).catch(err => {
                message.error(err.message)
            });
        }
    }

    function handleSuccess(success) {
        setVisible(false);
        if (props.handleSuccess) {
            props.handleSuccess(success);
        }
    }


    function handleError(error) {
        setVisible(false);
        if (props.handleError) {
            props.handleError(error);
        }
    }

    function handleSubmit() {

        if (!_.get(props.user, ['authenticated']) || !_.get(props.user, ['info', 'user', '_id'])) {
            message.error('Please Login First!');
            props.loginMode(true);
            return;
        }

        switch (type) {
            case 'chat':
                break;
            case 'user':
                break;
            case 'message':
                break;
            default:
                message.error('Invalid type');
                return;
                break;
        }


        if (!props[type + 'Id']) {
            message.error('Content Not Found');
            return;
        }

        if (!props.reporterId) {
            message.error('Reporter Not Found');
            return;
        }


        form.validateFields((err, values) => {

            if (!err) {
                let promises = [];
                promises.push(client.authenticate());
                if (!isReported) {
                    let data = {}
                    data.type = type;
                    data.reporterId = props.reporterId;
                    data[type + 'Id'] = props[type + 'Id'];

                    //For Activity Logs;
                    data.actionType = 'createReport';
                    promises.push(client.service('report').create({ ...data, ...values }))
                } else {
                    promises.push(client.service('report').remove(report._id))
                }

                props.loading(true);
                //Write in report model
                Promise.all(promises).then(([auth, res]) => {
                    props.loading(false);
                    handleSuccess({
                        type: isReported ? 'cancel' : 'reported',
                        data: res
                    });
                    setReport(isReported ? {} : res);
                    setVisible(false);

                }).catch(error => {
                    props.loading(false);
                    setVisible(false);
                    handleError({ message: "Report Failed" })
                })
            }
        });


    };



    return (

        <span className={props.className ? props.className : null} style={props.style ? props.style : null}>
            <Modal
                visible={visible}
                title="Report Form"
                maskClosable={true}
                centered={true}
                onOk={(e) => { handleSubmit(); }}
                okText="Submit"
                onCancel={(e) => { setVisible(false) }}
            >

                <Form layout="vertical">
                    <Form.Item>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input title.' }],
                        })(
                            <Input placeholder="Title(max 200)" maxLength={200}
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: 'Please input description.' }],
                        })(
                            <Input.TextArea autoSize={{ minRows: 6, maxRows: 6 }} showCount placeholder="Description(max 900)" maxLength={900}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>

            <span onClick={() => { setVisible(true) }}>
                {
                    isReported ?
                        props.cancelButton ?
                            props.cancelButton()
                            :
                            <Button type="danger" icon="flag">
                                Report
                            </Button>
                        :
                        props.reportButton ?
                            props.reportButton()
                            :
                            <Button type="danger" icon="flag" disabled>
                                Reported
                            </Button>
                }
            </span>

        </span>
    );
}


const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});

const mapDispatchToProps = {
    loginMode: loginMode,
    loading: loading,
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(withRouter(ReportButton)));