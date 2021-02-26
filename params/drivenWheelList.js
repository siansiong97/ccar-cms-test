const fourWDIcon = "/assets/drivenType/4wd.png"
const AWDIcon = "/assets/drivenType/awd.png"
const FWDIcon = "/assets/drivenType/fwd.png"
const RWDIcon = "/assets/drivenType/rwd.png"

export const drivenWheelList = [
    {
        'icon': fourWDIcon,
        'value': '4WD',
    },
    {
        'icon': AWDIcon,
        'value': 'AWD',
    },
    {
        'icon': FWDIcon,
        'value': 'FWD',
    },
    {
        'icon': RWDIcon,
        'value': 'RWD',
    }
]

export function getDrivenWheelIcon(drivenWheel) {
    if (drivenWheel) {
        let selectedDrivenWheel = drivenWheelList.find(function (item) {
            return item.value.toLowerCase() == drivenWheel.toLowerCase();
        })

        if (selectedDrivenWheel) {
            return selectedDrivenWheel.icon;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function getDrivenWheel(drivenWheel) {
    if (drivenWheel) {
        let selectedDrivenWheel = drivenWheelList.find(function (item) {
            return item.value.toLowerCase() == drivenWheel.toLowerCase();
        })

        if (selectedDrivenWheel) {
            return selectedDrivenWheel;
        } else {
            return {
                value: null,
                icon: null
            };
        }
    } else {
        return {
            value: null,
            icon: null
        };
    }
}
export default {
    drivenWheelList,
}