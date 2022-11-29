const mongoose = require('mongoose')

const integrate = new mongoose.Schema(
	{
		Projid:{ type: String, required: true},
		base_encoded_string:{ type: [String], required: true},
		

	},
	{ collection: 'Integrate' }
)

const model = mongoose.model('Integrate', integrate)

module.exports = model