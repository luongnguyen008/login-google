import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from './react-routes/routes'

function App() {
	return(
		<React.Fragment>
			<Router>
				<Routes />
			</Router>
		</React.Fragment>
	)
}
	
export default App;