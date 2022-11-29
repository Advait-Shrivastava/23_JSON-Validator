const mongoose = require('mongoose')

const project = new mongoose.Schema(
	{
		Projid:{ type: String, required: true, unique : true},
		Ownerid:{ type: String, required: true},
		CreatedTime:{ type: String, required: true},
		Status: { type: String, required: true },
		Step: { type: String, required: true },
        IsFinished: { type: String, required: true },
        LstUpd: { type: String, required: true },
	},
	{ collection: 'Proj' }
)

const model = mongoose.model('Proj', project)

module.exports = model