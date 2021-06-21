import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import NavBar from "./components/NavBar"
import './App.css';


const App = () => {
    return (
        <div className="App">
            <Router>
                <NavBar/>
                <Switch>
                <Route exact path="/" component={Homepage} />
                </Switch>
            </Router>
            
        </div>
        
    );
};

export default App;