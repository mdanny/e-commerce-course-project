module.exports = {
	database: 'mongodb://root:qwerty123@ds019048.mlab.com:19048/e-commerce-course-project',
	port: 3000,
	secretKey: "cartocri",

	facebook: {
		clientID: process.env.FACEBOOK_ID || '205037839853153',
		clientSecret: process.env.FACEBOOK_SECRET || 'dc97bd3f844279b70631391ef3aad0cc',
		profileFields: ['emails', 'displayName'] ,
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	}
}