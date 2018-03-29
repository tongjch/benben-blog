import React,{Component} from 'react';
import Header from '../header/Header';
import Home from "../home/Home";
import { Route } from "react-router-dom";
require("../static/css/base.css");


class Layout extends Component {
    
    render(){
        return (
            <div className="container">
                <Header />
                <div className="content-container">
                    <Route to="home" component={Home}></Route>
                </div>
            </div>
        )
    }
}

export default Layout