import _ from "lodash"
import { arrayLengthCount, convertParameterToProductListUrl } from "./common-function"



export const routePaths = {
    home: {
        to: `/`,
        as: (item, query = {}) => ({
            pathname: `/`,
            query: {
                ...query
            }
        }),
    },
    aboutUs: {
        to: `/about-us`,
        as: (item, query = {}) => ({
            pathname: `/about-us`,
            query: {
                ...query
            }
        }),
    },
    carFreaks: {
        to: `/car-freaks`,
        as: (item, query = {}) => ({
            pathname: `/car-freaks`,
            query: {
                ...query
            }
        }),
    },
    viewCarFreaks: {
        to: `/car-freaks/[id]`,
        as: (item, query = {}) => ({
            pathname: `/car-freaks/${_.get(item, '_id')}`,
            query: {
                id: _.get(item, '_id'),
                ...query
            }
        })
    },
    carReview: {
        to: `/car-review`,
        as: (item, query = {}) => ({ pathname: `/car-review`, query: { ...query } })
    },
    carsOnSale: {
        to: `/cars-on-sale`,
        as: (query = {}, ...parameters) => {
            if (arrayLengthCount(parameters) < 0) {
                let url = convertParameterToProductListUrl();
                return {
                    pathname: url,
                    query: {
                        ...query,
                    }
                };
            }

            if (arrayLengthCount(parameters) > 0) {
                let url = `/cars-on-sale`;
                _.forEach(parameters, function (parameter) {
                    url += `/${parameter || ''}`;
                })
                return {
                    pathname: url,
                    query: {
                        ...query,
                    }
                };
            }

            return {
                pathname: '/',
                query: {
                    ...query,
                }
            };
        },
    },
    compare: {
        to: `/compare`,
        as: (item, query = {}) => ({ pathname: `/compare`, query: { ...query } })
    },
    contactUs: {
        to: `/contact-us`,
        as: (item, query = {}) => ({ pathname: `/contact-us`, query: { ...query } })
    },
    dealerProfile: {
        to: `/dealer/[companyname]/[freakname]`,
        as: (item, query = {}) => ({
            pathname: `/dealer/${item.companyurlId || ''}/${item.userurlId || ''}`, query: {
                companyname: _.get(item, 'companyurlId'),
                freakname: _.get(item, 'userurlId'),
                ...query
            }
        })
    },
    eventPost: {
        to: `/event-post/[id]`,
        as: (item, query = {}) => ({
            pathname: `/event-post/${item._id}`, query: {
                id: _.get(item, '_id'),
                ...query
            }
        })
    },
    faq: {
        to: `/faq`,
        as: (item, query = {}) => ({ pathname: `/faq`, query: { ...query } })
    },
    faqDetails: {
        to: `/faq/details`,
        as: (item, query = {}) => ({ pathname: `/faq/details`, query: { ...query } })
    },
    hashTag: {
        to: `/hashtag/[hashTag]`,
        as: (item, query = {}) => ({
            pathname: `/hashtag/${item}`, query: {
                id: item,
                ...query
            }
        })
    },
    kpp: {
        to: `/kpp`,
        as: (item, query = {}) => ({ pathname: `/kpp`, query: { ...query } })
    },
    kppBm: {
        to: `/kpp/kpp-bm`,
        as: (item, query = {}) => ({ pathname: `/kpp/kpp-bm`, query: { ...query } })
    },
    kppEn: {
        to: `/kpp/kpp-en`,
        as: (item, query = {}) => ({ pathname: `/kpp/kpp-en`, query: { ...query } })
    },
    kppRevision: {
        to: `/kpp/kpp-revision/[group]/[language]`,
        as: (item, query = {}) => ({ pathname: `/kpp/kpp-revision/${_.get(item , `group`)}/${_.get(item , `language`) || ''}`, query: {
            group : _.get(item , `group`) || '',
            language :  _.get(item , `language`) || '',
            ...query } })
    },
    live: {
        to: `/live`,
        as: (item, query = {}) => ({ pathname: `/live`, query: { ...query } })
    },
    liveDetails: {
        to: `/live/[id]`,
        as: (item, query = {}) => ({
            pathname: `/live/${_.get(item, ['dealerSocketId']) || ''}`, query: {
                id: _.get(item, 'dealerSocketId'),
                ...query
            }
        })
    },
    logout: {
        to: `/logout`,
        as: (item, query = {}) => ({ pathname: `/logout`, query: { ...query } })
    },
    newCarsOnSale: {
        to: `/new-cars-on-sale`,
        as: (query = {}, ...parameters) => {
            if (arrayLengthCount(parameters) < 0) {
                let url = convertParameterToProductListUrl({ condition: 'new' });
                return {
                    pathname: url,
                    query: {
                        ...query,
                    }
                };
            }

            if (arrayLengthCount(parameters) > 0) {
                let url = `/new-cars-on-sale`;
                _.forEach(parameters, function (parameter) {
                    url += `/${parameter || ''}`;
                })
                return {
                    pathname: url,
                    query: {
                        ...query,
                    }
                };
            }

            return {
                pathname: '/',
                query: {
                    ...query,
                }
            };
        },
    },
    newCar: {
        to: `/newcar`,
        as: (item, query = {}) => ({ pathname: `/newcar`, query: { ...query } })
    },
    newCarDetails: {
        to: `/newcar/details/[make]/[model]`,
        as: (item, query = {}) => ({
            pathname: `/newcar/details/${_.get(item, ['make']) || ''}/${_.get(item, ['model']) || ''}`, query: {
                make: _.get(item, 'make'),
                model: _.get(item, 'model'),
                ...query
            }
        })
    },
    newCarFilter: {
        to: `/newcar/filter`,
        as: (item, query = {}) => ({ pathname: `/newcar/filter`, query: { ...query } })
    },
    newCarMakerDetails: {
        to: `/newcar/maker/[id]`,
        as: (item, query = {}) => ({
            pathname: `/newcar/maker/${_.get(item, ['make'])}`, query: {
                id: _.get(item, 'make'),
                ...query
            }
        })
    },
    petrolPrice: {
        to: `/petrolprice`,
        as: (item, query = {}) => ({ pathname: `/petrolprice`, query: { ...query } })
    },
    previewCarAds: {
        to: `/previewCarAds/[id]`,
        as: (item, query = {}) => ({
            pathname: `/previewCarAds/${_.get(item, ['_id']) || ''}`, query: {
                id: _.get(item, '_id'),
                ...query
            }
        })
    },
    profile: {
        to: `/profile/[id]`,
        as: (item, query = {}) => ({
            pathname: `/profile/${_.get(item, ['userurlId']) || ''}`, query: {
                id: _.get(item, 'userurlId'),
                ...query
            }
        })
    },
    manageProfile: {
        to: `/profile/[id]/details`,
        as: (item, query = {}) => ({
            pathname: `/profile/${_.get(item, 'userurlId') || ''}/details`, query: {
                id: _.get(item, 'userurlId'),
                ...query
            }
        })
    },
    profileSettings: {
        to: `/profile/[id]/details/settings`,
        as: (item, query = {}) => ({
            pathname: `/profile/${_.get(item, `userurlId`) || ''}/details/settings`, query: {
                id: _.get(item, 'userurlId'), ...query
            }
        })
    },
    profileWishLists: {
        to: `/profile/[id]/details/wishlists`,
        as: (item, query = {}) => ({
            pathname: `/profile/${_.get(item, `userurlId`) || ''}/details/wishlists`, query: {
                id: _.get(item, 'userurlId'), ...query
            }
        })
    },
    reconCarsOnSale: {
        to: `/recon-cars-on-sale`,
        as: (query = {}, ...parameters) => {
            if (arrayLengthCount(parameters) < 0) {
                let url = convertParameterToProductListUrl({ condition: 'recon' });
                return {
                    pathname: url,
                    query: {
                        ...query,
                    }
                };
            }

            if (arrayLengthCount(parameters) > 0) {
                let url = `/recon-cars-on-sale`;
                _.forEach(parameters, function (parameter) {
                    url += `/${parameter || ''}`;
                })
                return {
                    pathname: url,
                    query: {
                        ...query,
                    }
                };
            }

            return {
                pathname: '/',
                query: {
                    ...query,
                }
            };
        },
    },
    searchCarFreaks: {
        to: `/search-car-freaks`,
        as: (item, query = {}) => ({ pathname: `/search-car-freaks`, query: { ...query } })
    },
    socialBoard: {
        to: `/social-board`,
        as: (item, query = {}) => ({ pathname: `/social-board`, query: { ...query } })
    },
    socialBoardDetails: {
        to: `/social-board/[id]`,
        as: (item, query = {}) => ({
            pathname: `/social-board/${_.get(item, `_id`)}`, query: {
                id: _.get(item, '_id'), ...query
            }
        })
    },
    socialClub: {
        to: `/social-club`,
        as: (item, query = {}) => ({ pathname: `/social-club`, query: { ...query } })
    },
    socialClubDetails: {
        to: `/social-club/[id]`,
        as: (item, query = {}) => ({
            pathname: `/social-club/${_.get(item, `_id`)}`, query: {
                id: _.get(item, '_id'), ...query
            }
        })
    },
    socialNewsAndVideo: {
        to: `/socialNewsAndVideo`,
        as: (item, query = {}) => ({ pathname: `/socialNewsAndVideo`, query: { ...query } })
    },
    termOfUse: {
        to: `/termOfUse`,
        as: (item, query = {}) => ({ pathname: `/termOfUse`, query: { ...query } })
    },
    termsOfUse: {
        to: `/termsOfUse`,
        as: (item, query = {}) => ({ pathname: `/termsOfUse`, query: { ...query } })
    },
    usedCarsOnSale: {
        to: `/used-cars-on-sale`,
        as: (query = {}, ...parameters) => {
            if (arrayLengthCount(parameters) < 0) {
                let url = convertParameterToProductListUrl({ condition: 'used' });
                return {
                    pathname: url,
                    query: {
                        ...query,
                    }
                };
            }

            if (arrayLengthCount(parameters) > 0) {
                let url = `/used-cars-on-sale`;
                _.forEach(parameters, function (parameter) {
                    url += `/${parameter || ''}`;
                })
                return {
                    pathname: url,
                    query: {
                        ...query,
                    }
                };
            }

            return {
                pathname: '/',
                query: {
                    ...query,
                }
            };
        },
    },
    viewCarDetails: {
        to: `/viewCar/[id]`,
        as: (item, query = {}) => ({
            pathname: `/viewCar/${_.get(item, `_id`)}`, query: {
                id: _.get(item, '_id'), ...query
            }
        })
    },
    writeCarReview: {
        to: `/write-car-review`,
        as: (item, query = {}) => ({ pathname: `/write-car-review`, query: { ...query } })
    },
}