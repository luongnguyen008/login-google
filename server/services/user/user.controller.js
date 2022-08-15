import User from "../../models/user.model.js";

export const find = async (req, res, next) => {
	console.log("req.query", req.query)
    let users = await User.find({publicAddress: req.query.publicAddress})
    res.json(users)
};

export const create = async (req, res, next) => {
	const nonce = Math.floor((Math.random() * 10000) + 1)
	const newUser = new User({ publicAddress: req.body.publicAddress, nonce: nonce });
	newUser.save().then(() => console.log('New user created'));
	res.json({publicAddress: req.body.publicAddress, nonce: nonce})
};