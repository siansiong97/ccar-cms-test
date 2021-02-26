const dieselIcon = "/assets/fuelType/diesel.png"
const electricIcon = "/assets/fuelType/electric.png"
const hybridIcon = "/assets/fuelType/hybrid.png"
const petrolLeadedIcon = "/assets/fuelType/petrol-(leaded).png"
const petrolUnleadedIcon = "/assets/fuelType/petrol-(unleaded).png"

export const fuelTypeList = [
    {
        'icon': dieselIcon,
        'value': 'diesel',
    },
    {
        'icon': hybridIcon,
        'value': 'hybrid',
    },
    {
        'icon': electricIcon,
        'value': 'ev',
    },
    {
        'icon': petrolLeadedIcon,
        'value': 'petrol',
    },
    {
        'icon': petrolLeadedIcon,
        'value': 'phev',
    },
    {
        'icon': petrolUnleadedIcon,
        'value': 'petrolulp',
    }
]

export function getFuelTypeIcon(fuelType) {
    if (fuelType) {
        let selectedFuelType = fuelTypeList.find(function (item) {
            return item.value.toLowerCase() == fuelType.toLowerCase();
        })

        if (selectedFuelType) {
            return selectedFuelType.icon;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function getFuelType(fuelType) {
    if (fuelType) {
        let selectedFuelType = fuelTypeList.find(function (item) {
            return item.value.toLowerCase() == fuelType.toLowerCase();
        })

        if (selectedFuelType) {
            return selectedFuelType;
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
    fuelTypeList,
}