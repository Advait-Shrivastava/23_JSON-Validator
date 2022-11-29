const mongoose = require('mongoose')

const login = new mongoose.Schema(
	{
		uid:{ type: String, required: true},
		pid:{ type: String, required: true},
		email:{ type: String, required: true,unique:true},
		password: { type: String, required: true },
		role: { type: String, required: true },
	},
	{ collection: 'userlogin' }
)

const model = mongoose.model('UserLogin', login)

module.exports = model