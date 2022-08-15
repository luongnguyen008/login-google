import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode"
import { useSelector, useDispatch } from 'react-redux';
import { login } from "../../services/auth/authSlice";

function App() {
	const [state, setState] = useState({email: "", password: ""})
	const auth = useSelector((state) => state.auth)
	console.log("auth", auth)
	const dispatch = useDispatch()
	function handleCallbackResponse(response) {
		console.log("Encoded JWT Sign In Button: "+ response.credential)
		let userObject = jwt_decode(response.credential) 
		dispatch(login(response.credential))
		console.log("userObject", userObject)
	}

	useEffect(() => {
		/* global google */
		google.accounts.id.initialize({
			client_id: "693143633322-bol3kob5g95djajf0mmo843mb9u2fucg.apps.googleusercontent.com",
			callback: handleCallbackResponse
		})
		google.accounts.id.renderButton(
			document.getElementById("signInDiv"), 
			{theme: "outline", size: "large"}
		)

		// google.accounts.id.prompt()
	}, [])
	const handleChangeEmail = (event) => {
		setState({...state, email: event.target.value});
	}
	const handleChangePassword = (event) => {
		setState({ ...state, password: event.target.value});
	}
	
	const handleSubmit = (event) => {
		dispatch(login({email: state.email, password: state.password}))
	}
	return(
		<React.Fragment>
			
			<div className="App" style={{marginTop: "100px"}}>
				<div id="signInDiv"></div>
				{/* <form autoComplete="off" onSubmit={handleSubmit}>
					<label>
						Email:
						<input type="text" value={state.email} onChange={handleChangeEmail} />
					</label>
					<label>
						Password:
						<input type="password" value={state.password} onChange={handleChangePassword} />
					</label>
					<input type="submit" value="Submit" />
				</form> */}
			</div>
		</React.Fragment>
		
	)
}
	
export default App;