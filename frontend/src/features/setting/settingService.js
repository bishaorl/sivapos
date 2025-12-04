import httpRequest from '../../utils/request'

const API_URL = '/setting'

// Get setting
const getSetting = async () => {
    const response = await httpRequest.get(API_URL + '/')
    return response.data
}

// Save setting
const saveSetting = async (settingData) => {
    const response = await httpRequest.post(API_URL + '/', settingData)
    return response.data
}

const settingService = {
    getSetting,
    saveSetting
}

export default settingService