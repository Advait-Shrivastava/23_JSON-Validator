const mongoose = require('mongoose')

const session = new mongoose.Schema(
	{
		usid:{ type: String},
		Logpid:{ type: String},
		Logintime:{ type: String},
		Logouttime: { type: String},
		Loginas: { type: String},
	},
	{ collection: 'usersession' }
)

const model = mongoose.model('UserSession', session)

module.exports = model