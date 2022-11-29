const mongoose = require('mongoose')

const userjson = new mongoose.Schema(
	{
		input_json_content:{ type: String, required: true},
		pid:{ type: String, required: true},
		step_no:{ type: String, required: true},
		proj_id:{ type: String, required: true},
	},
	{ collection: 'UserJson' }
)

const model = mongoose.model('User_Json', userjson)

module.exports = model