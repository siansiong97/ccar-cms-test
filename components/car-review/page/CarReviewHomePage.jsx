import { AutoComplete, Button, Col, Divider, Form, Input, message, Rate, Row } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import client from '../../../feathers';
import { ccarLogo, ratingBanner } from '../../../icon';
import { loading, loginMode, updateActiveMenu } from '../../../redux/actions/app-actions';
import LayoutV2 from '../../general/LayoutV2';



const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}
const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
}
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
}


const carspecRatingCategories = [
    {
        name: 'Performance',
        value: 'performance',
    },
    {
        name: 'Safety',
        value: 'safety',
    },
    {
        name: 'Interior Design',
        value: 'interior',
    },
    {
        name: 'Exterior Design',
        value: 'exterior',
    },
]

const CarReviewHomePage = (props) => {


    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, isFieldValidating } = props.form;
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [years, setYears] = useState([]);
    const [origOptions, setOrigOptions] = useState({})
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        getBrands();
    }, [])

    function getBrands() {
        client.service('carspecs').find({
            query: {
                distinct: 'make'
            }
        }).then(res => {
            setBrands(_.compact(res) || [])
            setOrigOptions({
                ...origOptions,
                brands: _.compact(res) || [],
            })
        })
    }

    function getModels() {
        if (props.form.getFieldValue('make')) {
            client.service('carspecs').find({
                query: {
                    distinctFilter: {
                        make: props.form.getFieldValue('make'),
                        variant: {
                            $ne: null,
                            $ne: undefined,
                            $ne: '',
                        }
                    },
                    distinct: 'model'
                }
            }).then(res => {
                setModels(_.compact(res) || [])
                setOrigOptions({
                    ...origOptions,
                    models: _.compact(res) || [],
                })

            })
        } else {
            setModels([])
        }
    }
    function getYears() {
        if (props.form.getFieldValue('make') && props.form.getFieldValue('model')) {
            client.service('carspecs').find({
                query: {
                    distinctFilter: {
                        make: props.form.getFieldValue('make'),
                        model: props.form.getFieldValue('model'),
                        variant: {
                            $ne: null,
                            $ne: undefined,
                            $ne: '',
                        }
                    },
                    distinct: 'year'
                }
            }).then(res => {
                setYears(_.compact(res) || [])
                setOrigOptions({
                    ...origOptions,
                    years: _.compact(res) || [],
                })
            })
        } else {
            setYears([])
        }
    }
    function getVariants() {
        if (props.form.getFieldValue('make') && props.form.getFieldValue('model') && props.form.getFieldValue('year')) {
            client.service('carspecs').find({
                query: {
                    distinctFilter: {
                        make: props.form.getFieldValue('make'),
                        model: props.form.getFieldValue('model'),
                        year: props.form.getFieldValue('year'),
                        variant: {
                            $ne: null,
                            $ne: undefined,
                            $ne: '',
                        }
                    },
                    distinct: 'variant'
                }
            }).then(res => {
                setVariants(_.compact(res) || [])
                setOrigOptions({
                    ...origOptions,
                    variants: _.compact(res) || [],
                })
            })
        } else {
            setVariants([]);
        }
    }

    function handleSubmit() {

        if (_.get(props.user, ['authenticated']) && _.get(props.user, ['info', 'user', '_id'])) {

            props.loading(true);
            props.form.validateFields((err, values) => {
                if (!err) {

                    client.service('carspecs').find({
                        query: {
                            make: _.get(values, ['make']),
                            model: _.get(values, ['model']),
                            year: _.get(values, ['year']),
                            variant: _.get(values, ['variant']),
                            $sort: {
                                createdAt: 1,
                            },
                            $limit: 1,
                        }
                    }).then(res => {

                        let selectedCarspec = _.get(res, ['data', 0]) || {};
                        if (!_.get(selectedCarspec, ['_id'])) {
                            message.error('Car Spec Not Found!')
                            props.loading(false);
                            return;
                        } else {

                            let carspecRating = {};

                            _.forEach(Object.entries(values), function (value) {
                                if ((value[0] || '').indexOf('carspecRating') != -1) {
                                    let key = value[0].split('-');
                                    key[0] = undefined;
                                    key = _.compact(key).join('-');
                                    carspecRating[key] = value[1];
                                }
                            });

                            let finalData = {
                                type: 'carspec',
                                carspecId: selectedCarspec._id,
                                title: values.title,
                                comment: values.comment,
                                rating: values.rating,
                                reviewerId: _.get(props.user, ['info', 'user', '_id']),
                                carspecRating,
                            };

                            client.service('rating').create(finalData).then(res => {
                                message.success('Submited! Thanks for the review.')
                                props.form.resetFields();
                                props.loading(false);
                                window.scrollTo(0, 0);
                            }).catch(err => {
                                props.loading(false);
                                message.error(err.message)
                            });
                        }

                    }).catch(err => {
                        props.loading(false);
                        message.error(err.message)
                    });


                } else {
                    props.loading(false);
                    _.map(err, function (err) {
                        return message.error(err.errors[0].message)
                    })
                }
            })
        } else {
            message.error('Please Login First!');
            props.loginMode(true);
        }

    }
    return (
        <LayoutV2>
            <Desktop>
                <div className="section">
                    <div style={{ padding: "0px 200px" }}>
                        <div className="flex-justify-center font-weight-bold h6 grey-darken-1 padding-md">
                            Your review matters!
                            </div>
                        <div className="flex-justify-center flex-items-align-center padding-md">
                            <img src={ratingBanner} style={{ width: 585, height: 315 }} />
                        </div>
                        <div className="body1 font-weight-light flex-justify-center grey-darken-1 flex-wrap text-overflow-break">
                            Do you know that your small act of kindness can help other buyers to make better decision?
                            </div>
                        <div className="body1 font-weight-light flex-justify-center grey-darken-1 flex-wrap text-overflow-break">
                            Share your feeling and experience about your car now!
                            </div>

                        <Divider ></Divider>
                        <div className="flex-justify-start font-weight-bold h6 grey-darken-1">
                            Select Car to Review
                            </div>

                        <Form >
                            <div className="flex-justify-space-around flex-items-align-center padding-x-md padding-top-lg padding-bottom-md">
                                <span className='d-inline-block width-20 margin-right-md' >
                                    <Form.Item
                                        className="w-100" style={{ margin: 0, padding: 0 }}
                                        validateStatus={(isFieldTouched('make') || !isFieldValidating('make')) && getFieldError('make') ? 'error' : ''}
                                        help={(isFieldTouched('make') || !isFieldValidating('make')) && getFieldError('make')}
                                    >
                                        {getFieldDecorator('make', {
                                            rules: [{ required: true, message: 'Please select a brand' }],
                                            initialValue: undefined,
                                        })(
                                            <AutoComplete
                                                placeholder="Brand"
                                                dataSource={brands}
                                                onSelect={(value) => {
                                                    props.form.setFieldsValue({
                                                        make: value,
                                                        model: undefined,
                                                        year: undefined,
                                                        variant: undefined,
                                                    })
                                                    getModels();
                                                }}
                                                onSearch={(value) => {
                                                    if (value) {
                                                        setBrands(_.filter(_.get(origOptions, ['brands']) || [], function (item) {
                                                            let regex = new RegExp(`^${value}`, 'i')
                                                            return regex.test(item);
                                                        }))
                                                    } else {
                                                        setBrands(_.get(origOptions, ['brands']) || [])
                                                    }
                                                }}
                                            >
                                            </AutoComplete>
                                        )}
                                    </Form.Item>
                                </span>
                                <span className='d-inline-block width-20 margin-right-md' >
                                    <Form.Item className="w-100" style={{ margin: 0, padding: 0 }}
                                        validateStatus={(isFieldTouched('model') || !isFieldValidating('model')) && getFieldError('model') ? 'error' : ''}
                                        help={(isFieldTouched('model') || !isFieldValidating('model')) && getFieldError('model')}
                                    >
                                        {getFieldDecorator('model', {
                                            rules: [{ required: true, message: 'Please select a model' }],
                                            initialValue: undefined,
                                        })(<AutoComplete
                                            disabled={!props.form.getFieldValue('make')}
                                            placeholder="Model"
                                            dataSource={models}
                                            onSelect={(value) => {
                                                props.form.setFieldsValue({
                                                    model: value,
                                                    year: undefined,
                                                    variant: undefined,
                                                })
                                                getYears();
                                            }}
                                            onSearch={(value) => {
                                                if (value) {
                                                    setModels(_.filter(_.get(origOptions, ['models']) || [], function (item) {
                                                        let regex = new RegExp(`^${value}`, 'i')
                                                        return regex.test(item);
                                                    }))
                                                } else {
                                                    setModels(_.get(origOptions, ['models']) || [])
                                                }
                                            }}
                                        >
                                        </AutoComplete>
                                        )}
                                    </Form.Item>
                                </span>

                                <span className='d-inline-block width-20 margin-right-md' >
                                    <Form.Item className="w-100" style={{ margin: 0, padding: 0 }}
                                        validateStatus={(isFieldTouched('year') || !isFieldValidating('year')) && getFieldError('year') ? 'error' : ''}
                                        help={(isFieldTouched('year') || !isFieldValidating('year')) && getFieldError('year')}
                                    >
                                        {getFieldDecorator('year', {
                                            rules: [{ required: true, message: 'Please select a year' }],
                                            initialValue: undefined,
                                        })(
                                            <AutoComplete
                                                disabled={!props.form.getFieldValue('make') || !props.form.getFieldValue('model')}
                                                placeholder="Manufactured Year"
                                                dataSource={years}
                                                onSelect={(value) => {
                                                    props.form.setFieldsValue({
                                                        year: value,
                                                        variant: undefined,
                                                    })
                                                    getVariants();
                                                }}
                                                onSearch={(value) => {
                                                    if (value) {
                                                        setYears(_.filter(_.get(origOptions, ['years']) || [], function (item) {
                                                            let regex = new RegExp(`^${value}`, 'i')
                                                            return regex.test(item);
                                                        }))
                                                    } else {
                                                        setYears(_.get(origOptions, ['years']) || [])
                                                    }
                                                }}
                                            >
                                            </AutoComplete>
                                        )}
                                    </Form.Item>
                                </span>
                                <span className='d-inline-block width-20 margin-right-md' >
                                    <Form.Item className="w-100" style={{ margin: 0, padding: 0 }}
                                        validateStatus={(isFieldTouched('variant') || !isFieldValidating('variant')) && getFieldError('variant') ? 'error' : ''}
                                        help={(isFieldTouched('variant') || !isFieldValidating('variant')) && getFieldError('variant')}
                                    >
                                        {getFieldDecorator('variant', {
                                            rules: [{ required: true, message: 'Please select a variant' }],
                                            initialValue: undefined,
                                        })(
                                            <AutoComplete
                                                disabled={!props.form.getFieldValue('make') || !props.form.getFieldValue('model') || !props.form.getFieldValue('year')}
                                                placeholder="Variant"
                                                dataSource={variants}
                                                onSelect={(value) => {
                                                    props.form.setFieldsValue({
                                                        variant: value,
                                                    })
                                                }}
                                                onSearch={(value) => {
                                                    if (value) {
                                                        setVariants(_.filter(_.get(origOptions, ['variants']) || [], function (item) {
                                                            let regex = new RegExp(`^${value}`, 'i')
                                                            return regex.test(item);
                                                        }))
                                                    } else {
                                                        setVariants(_.get(origOptions, ['variants']) || [])
                                                    }
                                                }}
                                            >
                                            </AutoComplete>
                                        )}
                                    </Form.Item>
                                </span>
                            </div>
                            <Divider />
                            <div className="flex-justify-start font-weight-bold h6 grey-darken-1 ">
                                Rating
                            </div>
                            <div className="body1 font-weight-light flex-justify-start grey-darken-1 flex-wrap text-overflow-break padding-y-sm">
                                How would you rate your car on the following aspects?
                            </div>
                            <Form.Item className="w-100" style={{ margin: 0, padding: 0 }}
                                validateStatus={(isFieldTouched('rating') || !isFieldValidating('rating')) && getFieldError('rating') ? 'error' : ''}
                                help={(isFieldTouched('rating') || !isFieldValidating('rating')) && getFieldError('rating')}
                            >
                                {getFieldDecorator('rating', {
                                    rules: [{ required: true, message: 'Please fill in your rate' }],
                                    initialValue: 0,
                                })(
                                    <Rate style={{ fontSize: 30 }} allowHalf />
                                )}
                            </Form.Item>
                            <div className="body1 font-weight-light flex-justify-start grey-darken-1 flex-wrap text-overflow-break padding-y-sm">
                                Overall Rating
                            </div>
                            <div className="padding-top-md">
                                {
                                    _.map(carspecRatingCategories, function (carspecRatingCategory) {
                                        return (
                                            <div className="flex-justify-start flex-items-align-center">
                                                <span className='d-inline-block headline font-weight-light grey-darken-1 text-overflow-break margin-right-md' style={{ width: 200 }} >
                                                    {carspecRatingCategory.name}
                                                </span>
                                                <span className='d-inline-block' >
                                                    <Form.Item className="w-100 form-line-height-unset" style={{ margin: 0, padding: 0, lineHeight: '30px' }}
                                                        validateStatus={(isFieldTouched(`carspecRating-${carspecRatingCategory.value}`) || !isFieldValidating(`carspecRating-${carspecRatingCategory.value}`)) && getFieldError(`carspecRating-${carspecRatingCategory.value}`) ? 'error' : ''}
                                                        help={(isFieldTouched(`carspecRating-${carspecRatingCategory.value}`) || !isFieldValidating(`carspecRating-${carspecRatingCategory.value}`)) && getFieldError(`carspecRating-${carspecRatingCategory.value}`)}
                                                    >
                                                        {getFieldDecorator(`carspecRating-${carspecRatingCategory.value}`, {
                                                            rules: [{ required: true, message: `Please rate for ${carspecRatingCategory.name}` }],
                                                            initialValue: 0,
                                                        })(
                                                            <Rate style={{ fontSize: 20 }} allowHalf></Rate>
                                                        )}
                                                    </Form.Item>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="padding-top-md">
                                <div className="body1 font-weight-light flex-justify-start grey-darken-1 flex-wrap text-overflow-break padding-y-sm">
                                    Review Title
                            </div>
                                <div className="thin-border round-border no-border-input padding-x-sm padding-y-md">
                                    <Form.Item className="w-100 form-line-height-unset" style={{ margin: 0, padding: 0, }}
                                    >
                                        {getFieldDecorator(`title`, {
                                            initialValue: undefined,
                                        })(
                                            <Input placeholder="Please summarise your review in a statement" ></Input>
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="padding-top-md">
                                <div className="body1 font-weight-light flex-justify-start grey-darken-1 flex-wrap text-overflow-break padding-y-sm">
                                    Details
                            </div>
                                <div className="thin-border round-border no-border-input padding-x-sm padding-y-md">
                                    <Form.Item className="w-100 form-line-height-unset" style={{ margin: 0, padding: 0, }}
                                    >
                                        {getFieldDecorator(`comment`, {
                                            initialValue: undefined,
                                        })(
                                            <Input.TextArea rows={4} placeholder="Please write in detail of your review and experience of this car." ></Input.TextArea>
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="padding-y-md">
                                <Button size="large" className=" padding-x-xl border-ccar-button-yellow background-ccar-button-yellow black" onClick={(e) => { handleSubmit() }}>Submit</Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Desktop>

        </LayoutV2>
    )

}

const mapStateToProps = state => ({
    app: state.app,
    user: state.user,
});


const mapDispatchToProps = {
    loading,
    loginMode,
    updateActiveMenu: updateActiveMenu,
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CarReviewHomePage));