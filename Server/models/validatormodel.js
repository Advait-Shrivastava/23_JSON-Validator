const mongoose = require('mongoose')

const validators = new mongoose.Schema(
	{
		type:{ type: String, required: true,unique:true},
		file_contents:{ type: String, required: true},
	},
	{ collection: 'all_JSONS' }
)

const model = mongoose.model('All_JSONS', validators)

module.exports = model