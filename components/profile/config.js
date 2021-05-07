
import _ from 'lodash'

export const ccarWebLogo = '/assets/ccar-web-logo.png';
export const imageNotFound = '/image-not-found.png';
export const facebookLogo = '/assets/Social Media/Facebook @3x.png'
export const googleLogo = '/assets/Social Media/google-icon.png'
export const ccarLogo = '/logo192.png'

export function isDealer(user) {
    console.log(user.role);
    if (_.get(user, ['role'])) {
        return _.get(user, ['role']) != 'normaluser' && _.get(user, ['role']) != 'mobile-user';
    } else {
        return false
    }

}