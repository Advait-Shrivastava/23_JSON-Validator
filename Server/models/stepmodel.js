const mongoose = require('mongoose')

const step = new mongoose.Schema(
	{
		S1id:{ type: String, required: true},
		Pid:{ type: String, required: true},
		Sprojid:{ type: String, required: true},
		StepID: { type: String, required: true},
		Ssave: { type: String, required: true},
        Svalidated : { type: String, required: true},
        Ssavetime : { type: String, required: true},
        Svalidated_time : { type: String, required: true},
        SLstupd : { type: String, required: true},

	},
	{ collection: 'Step' }
)

const model = mongoose.model('Step', step)

module.exports = model