const flatService = require("../services/flatService")

//Get Flats
const getFlats = async (req, res) => {
  try {

    const adminId = req.user.user_id

    const page = parseInt(req.query.page) || 1
const limit = parseInt(req.query.limit) || 5
const search = req.query.search || ""

const flats = await flatService.getAllFlats(adminId, page, limit, search)

res.json(flats)

  } catch (err) {

    console.error(err)
    res.status(500).json({message:"Server error"})

  }
}

// Create flat
const createFlat = async (req, res) => {
  try {
    const adminId = req.user.user_id;
    const flat = await flatService.createFlat({ ...req.body, admin_id: adminId });
    res.status(201).json(flat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create flat" });
  }
};


const updateFlat = async (req, res) => {

  try{

    const flat = await flatService.updateFlat(req.params.id, req.body)

    res.json(flat)

  }catch(err){

    console.error(err)
    res.status(500).json({message:"Server error"})

  }

}

const deleteFlat = async (req, res) => {

  try{

    await flatService.deleteFlat(req.params.id)

    res.json({ message: "Flat deleted" })

  }catch(err){

    console.error(err)
    res.status(500).json({message:"Server error"})

  }

}

const restoreFlat = async (req, res) => {
  try {
    const flat = await flatService.restoreFlat(req.params.id)

    res.json({
      success: true,
      flat
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false
    })
  }
}

const getFlatById = async (req, res) => {

  try{

    const flat = await flatService.getFlatById(req.params.id)

    if(!flat){
      return res.status(404).json({message:"Flat not found"})
    }

    res.json(flat)

  }catch(err){

    console.error(err)
    res.status(500).json({message:"Server error"})

  }

}

const getAvailableResidents = async(req,res)=>{

  try{

    const residents = await flatService.getAvailableResidents()

    res.json(residents)

  }catch(err){

    console.error("Resident fetch error:", err.message)

    res.status(500).json({
      message: err.message
    })

  }

}

const assignResident = async (req, res) => {
  try {
    console.log("flat id:", req.params.id)
    console.log("resident id:", req.body.resident_id)

    const flat = await flatService.assignResident(
      req.params.id,
      req.body.resident_id
    )

    res.json(flat)

  } catch (err) {
    console.error("ASSIGN ERROR FULL:", err)

    res.status(500).json({
      message: err.message
    })
  }
}

const registerResident = async (req, res) => {
  try {

    const result = await flatService.registerResident(
      req.params.id,
      req.body
    )

    res.json(result)

  } catch (err) {

    console.error("REGISTER ERROR:", err)

    res.status(500).json({
      message: err.message
    })

  }
}
module.exports = {
  getFlats,
  createFlat,
  updateFlat,
  deleteFlat,
  getFlatById,
  getAvailableResidents,
  assignResident,
  registerResident,
  restoreFlat
}