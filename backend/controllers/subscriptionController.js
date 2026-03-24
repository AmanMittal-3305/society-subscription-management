const subscriptionService = require("../services/subscriptionService")

// GET ALL
const getPlans = async (req,res)=>{

  const plans = await subscriptionService.getPlans(
    req.user.user_id
  )

  res.json(plans)
}

// GET ONE
const getPlanById = async (req,res)=>{

  const plan = await subscriptionService.getPlanById(
    req.user.user_id,
    req.params.id
  )

  if(!plan){
    return res.status(404).json({
      message:"Plan not found"
    })
  }

  res.json(plan)
}

// CREATE
const createPlan = async (req,res)=>{

  const plan = await subscriptionService.createPlan({

    admin_id:req.user.user_id,

    flat_type:req.body.flat_type,

    monthly_rate:req.body.monthly_rate,

    effective_from:req.body.effective_from

  })

  res.status(201).json(plan)
}

// UPDATE
const updatePlan = async (req,res)=>{

  const plan = await subscriptionService.updatePlan(
    req.user.user_id,
    req.params.id,
    req.body
  )

  res.json({
    message:"Plan updated successfully",
    plan
  })
}

// DELETE
const deletePlan = async (req,res)=>{

  await subscriptionService.deletePlan(

    req.user.user_id,

    req.params.id

  )

  res.json({
    message:"Plan deleted"
  })
}

module.exports={
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
}