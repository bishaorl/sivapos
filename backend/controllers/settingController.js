const Setting = require('../models/settingModel')

// Obtener la configuración
const getSetting = async (req, res) => {
    try {
        const setting = await Setting.findOne()
        res.status(200).json(setting)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Crear o actualizar la configuración
const saveSetting = async (req, res) => {
    try {
        const {
            name,
            rif,
            dir,
            telefono,
            email,
            logo,
            impuesto,
            tasa_imp
        } = req.body

        // Verificar si ya existe una configuración
        const existingSetting = await Setting.findOne()
        
        if (existingSetting) {
            // Actualizar la configuración existente
            const updatedSetting = await Setting.update({
                name,
                rif,
                dir,
                telefono,
                email,
                logo,
                impuesto,
                tasa_imp
            }, {
                where: { id: existingSetting.id }
            })
            
            const updatedRecord = await Setting.findByPk(existingSetting.id)
            res.status(200).json(updatedRecord)
        } else {
            // Crear una nueva configuración
            const newSetting = await Setting.create({
                name,
                rif,
                dir,
                telefono,
                email,
                logo,
                impuesto,
                tasa_imp
            })
            res.status(201).json(newSetting)
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getSetting,
    saveSetting
}