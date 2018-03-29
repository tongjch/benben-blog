import React,{Component} from 'react';
import Header from '../header/Header';
import Home from "../home/Home";
import MarkdownArticle from '../article/MarkdownArticle';
import { Route,Redirect } from "react-router-dom";
require("../static/css/base.css");


class Layout extends Component {
    
    render(){
        return (
            <div className="container">
                <Header />
                <div className="content-container">
                    <Route path="/home" component={Home}></Route>
                    <Route path="/article/:id" component={MarkdownArticle}></Route>
                    <Redirect to="/home" />
                </div>
            </div>
        )
    }
}

export default Layout