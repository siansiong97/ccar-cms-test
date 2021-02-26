export const colorList = [
    {
        'code': '#000000',
        'value': 'black',
    },
    {
        'code': '#FFFFFF',
        'value': 'white',
    },
    {
        'code': '#E7E7E7',
        'value': 'silver',
    },
    {
        'code': '#757575',
        'value': 'grey',
    },
    {
        'code': '#CA912B',
        'value': 'brown',
    },
    {
        'code': '#623008',
        'value': 'bronze',
    },
    {
        'code': '#E3C57D',
        'value': 'gold',
    },
    {
        'code': '#F1DCC3',
        'value': 'beige',
    },
    {
        'code': '#FFF009',
        'value': 'yellow',
    },
    {
        'code': '#F87719',
        'value': 'orange',
    },
    {
        'code': '#DA0000',
        'value': 'red',
    },
    {
        'code': '#760000',
        'value': 'maroon',
    },
    {
        'code': '#AC005A',
        'value': 'magenta',
    },
    {
        'code': '#DC7EA8',
        'value': 'pink',
    },
    {
        'code': '#670DA8',
        'value': 'purple',
    },
    {
        'code': '#4EC375',
        'value': 'green',
    },
    {
        'code': '#01007D',
        'value': 'blue',
    },
    {
        'code': 'white',
        'value': 'other',
    },
]

export function getColorIcon(color) {
    if (color) {
        let selectedColor = colorList.find(function (item) {
            return item.value.toLowerCase() === color.toLowerCase();
        })

        if (selectedColor) {
            return selectedColor.icon;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function getColor(color) {
    if (color) {
        let selectedColor = colorList.find(function (item) {
            return item.value.toLowerCase() === color.toLowerCase();
        })

        if (selectedColor) {
            return selectedColor;
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
    colorList,
}