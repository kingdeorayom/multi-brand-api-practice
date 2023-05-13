const express = require('express')
const router = express.Router()

const VehicleModel = require('../models/vehicle')

// Getting all vehicle
router.get('/', async (request, response) => {
    try {
        const vehicle = await VehicleModel.find()
        response.json(vehicle)
    } catch (error) {
        response.status(500).json({ message: error.message })
    }
})

// Creating one vehicle
router.post('/', async (request, response) => {
    const data = new VehicleModel({
        name: request.body.name,
        brand: request.body.brand,
        description: request.body.description,
        slug: request.body.slug
    })

    try {
        const vehicle = await data.save()
        response.status(201).json(vehicle)
    } catch (error) {
        response.status(400).json({ message: error.message })
    }
})

// Getting one vehicle by id
router.get('/:id', getVehicleById, (request, response) => {
    response.json(response.vehicle)
})

// Updating one vehicle by id
router.patch('/:id', getVehicleById, async (request, response) => {

    if (request.body.name != null) {
        response.vehicle.name = request.body.name
    }

    try {
        const updatedVehicle = await response.vehicle.save()
        response.json(updatedVehicle)
    } catch (err) {
        response.status(400).json({ message: err.message })
    }
})

// Deleting one vehicle by id
router.delete('/:id', getVehicleById, async (request, response) => {
    try {
        await response.vehicle.deleteOne()
        response.json({ message: 'Successfully deleted vehicle' })
    } catch (err) {
        response.status(500).json({ message: err.message })
    }
})

// // Getting vehicles by brand
// router.get('/:brand', getVehicleByBrand, (request, response) => {
//     response.json(response.vehicle)
// })

// Middleware

// Get vehicle by brand
// async function getVehicleByBrand(request, response, next) {
//     let vehicle
//     try {
//         vehicle = await VehicleModel.find({ brand: request.params.brand })
//         if (vehicle == null) {
//             return response.status(404).json({ message: "Cannot find vehicle. It may not be existing in the database." })
//         }
//     } catch (err) {
//         return response.status(500).json({ message: err.message })
//     }

//     response.vehicle = vehicle
//     next()
// }

// Get vehicle by id
async function getVehicleById(request, response, next) {
    let vehicle
    try {
        vehicle = await VehicleModel.findById(request.params.id)
        if (vehicle == null) {
            return response.status(404).json({ message: "Cannot find vehicle. It may not be existing in the database." })
        }
    } catch (err) {
        return response.status(500).json({ message: err.message })
    }

    response.vehicle = vehicle
    next()
}

module.exports = router