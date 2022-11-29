const mongoose = require('mongoose')

const person = new mongoose.Schema(
	{
		pid:{ type: String, required: true},
		firstname:{ type: String, required: true},
		lastname:{ type: String, required: true},
		email:{ type: String, required: true, unique:true},
		organization: { type: String, required: true },
		role: { type: String, required: true },
	},
	{ collection: 'person' }
)

const model = mongoose.model('Person', person)

module.exports = model