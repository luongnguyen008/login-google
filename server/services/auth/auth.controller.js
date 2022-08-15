import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode"
import User from "../../models/user.model.js";
import lightwallet from "eth-lightwallet"
import jwtHelper from "../helpers/jwt.helper.js"

const config = {
	algorithms: ['HS256'],
	secret: process.env.JWT_SECRET,
};

const accessTokenCookieOptions = {
	maxAge: 900000, // 15 mins
	httpOnly: true,
};

const refreshTokenCookieOptions = {
	...accessTokenCookieOptions,
	maxAge: 3.154e10, // 1 year
};

export const login = async (req, res, next) => {
	try {
		let googleJWT = req.body.data
		// console.log("googleJWT", googleJWT)
		let googleUser = jwt_decode(googleJWT)
		// console.log("googleUser", googleUser)
		if (!googleUser.email_verified) {
			return res.status(403).send("Google account is not verified");
		}

		const user = await User.findOneAndUpdate(
			{
				email: googleUser.email,
			},
			{
				email: googleUser.email,
				name: googleUser.name,
				picture: googleUser.picture,
				mnemonicPhrase: "",
				publicAddress: ""
			},
			{
				upsert: true,
				new: true,
			}
		);
		let userData = {
			_id: user._id,
			name: user.name,
			email: user.email,
		}
		// debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
		const accessToken = await jwtHelper.generateToken(userData, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
		
		// debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
		const refreshToken = await jwtHelper.generateToken(userData, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_LIFE);

		const updateRefreshTokenUser = await User.findOneAndUpdate(
			{ email: user.email },
			{ refresh_token: refreshToken },
			{ new: true }
		);
		// console.log("updateRefreshTokenUser", updateRefreshTokenUser)
		// res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
		// res.cookie("access_token", accessToken, accessTokenCookieOptions);
		// return res.status(200).json("success")
		return res.status(200).json({accessToken, refreshToken})
	} catch (error) {
		return res.status(500).json(error);
	}
	
	

	// res.redirect("http://localhost:3000/private-page")
	// if(!user) {
	// 	// create wallet
	// 	let randomSeed = lightwallet.keystore.generateRandomSeed();
	// 	lightwallet.keystore.createVault({
	// 		password: data.password,
	// 		seedPhrase: randomSeed,
	// 		//random salt
	// 		hdPathString: 'm/0\'/0\'/0\''
	// 	  }, function (err, ks) {
	// 		  	ks.keyFromPassword(data.password, function (err, pwDerivedKey) {
	// 				if (err) throw err;
	// 				ks.generateNewAddress(pwDerivedKey, 1)
	// 				// console.log("ks", ks)
	// 				let addr = ks.getAddresses();
	// 				const newUser = new User({ publicAddress: addr[0], email: data.email, password: data.password, mnemonicPhrase: randomSeed });
	// 				newUser.save().then(() => console.log('New user created'));
	// 			})
	// 	  	});
	// 	let newUser = await User.findOne({ email: data.email })
	// 	res.json(newUser)
	// } else {
	// 	console.log('user', user)
	// 	res.json(user)
	// }
}

export const refreshToken = async (req, res, next) => {
	// User gửi mã refresh token kèm theo trong body
	const refreshTokenFromClient = req.body.data;
	// Nếu như tồn tại refreshToken truyền lên
	if (refreshTokenFromClient) {
	try {
		// Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
		const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, process.env.REFRESH_TOKEN_SECRET);

		// Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
		// debug("decoded: ", decoded);
		const userData = decoded.data;

		// debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
		const accessToken = await jwtHelper.generateToken(userData, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_LIFE);
		
		// gửi token mới về cho người dùng
		// return res.cookie("access_token", accessToken, accessTokenCookieOptions);
		return res.json(accessToken)
	} catch (error) {
		// // Lưu ý trong dự án thực tế hãy bỏ dòng debug bên dưới, mình để đây để debug lỗi cho các bạn xem thôi
		// debug(error);
		console.log(error)
		res.status(403).json({
		message: 'Invalid refresh token.',
		});
	}
	} else {
	// Không tìm thấy token trong request
	return res.status(403).send({
		message: 'No token provided.',
	});
	}
}








export const create = async (req, res, next) => {
	const { signature, publicAddress } = req.body;
	if (!signature || !publicAddress)
		return res
			.status(400)
			.send({ error: 'Request should have signature and publicAddress' });
	console.log(signature, publicAddress)

	return (
		User.findOne({ publicAddress: publicAddress })
			// Step 1: Get the user with the given publicAddress
			.then((user) => {
				console.log("user", user)
				if (!user) {
					res.status(401).send({
						error: `User with publicAddress ${publicAddress} is not found in database`,
					});

					return null;
				}

				return user;
			})
			// Step 2: Verify digital signature
			.then((user) => {
				if (!(user)) {
					// Should not happen, we should have already sent the response
					throw new Error(
						'User is not defined in "Verify digital signature".'
					);
				}

				const msg = `I am signing my one-time nonce: ${user.nonce}`;

				// We now are in possession of msg, publicAddress and signature. We
				// will use a helper from eth-sig-util to extract the address from the signature
				const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
				const address = recoverPersonalSignature({
					data: msgBufferHex,
					sig: signature,
				});

				// The signature verification is successful if the address found with
				// sigUtil.recoverPersonalSignature matches the initial publicAddress
				if (address.toLowerCase() === publicAddress.toLowerCase()) {
					return user;
				} else {
					res.status(401).send({
						error: 'Signature verification failed',
					});

					return null;
				}
			})
			// Step 3: Generate a new nonce for the user
			.then((user) => {
				if (!(user)) {
					// Should not happen, we should have already sent the response

					throw new Error(
						'User is not defined in "Generate a new nonce for the user".'
					);
				}

				user.nonce = Math.floor((Math.random() * 10000) + 1)
				user.save().then(() => console.log('Nonce updated'));
				return user
			})
			// Step 4: Create JWT
			.then((user) => {
				console.log("user", user)
				return new Promise((resolve, reject) =>
					// https://github.com/auth0/node-jsonwebtoken
					jwt.sign(
						{
							payload: {
								id: user._id,
								publicAddress,
							},
						},
						config.secret,
						{
							algorithm: config.algorithms[0],
							expiresIn: 60 * 60
						},
						(err, token) => {
							if (err) {
								return reject(err);
							}
							if (!token) {
								return new Error('Empty token');
							}
							return resolve(token);
						}
					)
				);
			})
			.then((accessToken) => res.json({ accessToken }))
			.catch(next)
	);
};