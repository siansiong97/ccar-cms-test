const federalTerritoryIcon = ("/assets/stateIcon/federal territory.png")
const johorIcon = ("/assets/stateIcon/johor.png")
const kedahIcon = ("/assets/stateIcon/kedah.png")
const kualaLumpurIcon = ("/assets/stateIcon/kuala lumpur.png")
const labuanFederalIcon = ("/assets/stateIcon/labuan-federal.png")
const labuanIcon = ("/assets/stateIcon/labuan.png")
const melakaIcon = ("/assets/stateIcon/melaka.png")
const negeriSembilanIcon = ("/assets/stateIcon/negeri-sembilan.png")
const pahangIcon = ("/assets/stateIcon/pahang.png")
const penangIcon = ("/assets/stateIcon/penang.png")
const perakIcon = ("/assets/stateIcon/perak.png")
const perlisIcon = ("/assets/stateIcon/perlis.png")
const putrajayFederalIcon = ("/assets/stateIcon/putrajay-federal.png")
const sabahIcon = ("/assets/stateIcon/sabah.png")
const sarawakIcon = ("/assets/stateIcon/sarawak.png")
const selangorIcon = ("/assets/stateIcon/selangor.png")
const terengganuIcon = ("/assets/stateIcon/terengganu.png")
const kelantanIcon = ("/assets/stateIcon/kelantan.png")

export const StateList = [
    {
        'icon': federalTerritoryIcon,
        'value': 'Federal Territory',
    },
    {
        'icon': johorIcon,
        'value': 'Johor',
    },
    {
        'icon': kedahIcon,
        'value': 'Kedah',
    },
    {
        'icon': kualaLumpurIcon,
        'value': 'Kuala Lumpur',
    },
    {
        'icon': labuanFederalIcon,
        'value': 'Labuan Federal',
    },
    {
        'icon': labuanIcon,
        'value': 'Labuan',
    },
    {
        'icon': melakaIcon,
        'value': 'Melaka',
    },
    {
        'icon': negeriSembilanIcon,
        'value': 'Negeri Sembilan',
    },
    {
        'icon': pahangIcon,
        'value': 'Pahang',
    },
    {
        'icon': penangIcon,
        'value': 'Penang',
    },
    {
        'icon': perakIcon,
        'value': 'Perak',
    },
    {
        'icon': perlisIcon,
        'value': 'Perlis',
    },
    {
        'icon': putrajayFederalIcon,
        'value': 'Putrajay Federal',
    },
    {
        'icon': sabahIcon,
        'value': 'Sabah',
    },
    {
        'icon': sarawakIcon,
        'value': 'Sarawak',
    },
    {
        'icon': selangorIcon,
        'value': 'Selangor',
    },
    {
        'icon': terengganuIcon,
        'value': 'Terengganu',
    },
    {
        'icon': kelantanIcon,
        'value': 'Kelantan',
    },
]

export function getStateIcon(state) {
    if (state) {
        let selectedState = StateList.find(function (item) {
            return item.value.toLowerCase() == state.toLowerCase();
        })

        if (selectedState) {
            return selectedState.icon;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function getState(state) {
    if (state) {
        let selectedState = StateList.find(function (item) {
            return item.value.toLowerCase() == state.toLowerCase();
        })

        if (selectedState) {
            return selectedState;
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
    StateList,
}