import React,{Component} from 'react';
import Header from '../header/Header';
import Home from "../home/Home";
import MarkdownArticle from '../article/MarkdownArticle';
import Tags from '../tags/Tags';
import { Route,Redirect } from "react-router-dom";
require("../static/css/base.css");


class Layout extends Component {
    
    render(){
        return (
            <div className="container">
                <Header />
                <div className="content-container">
                    <Route exact path='/' component={Home} />
                    <Route path="/articles/:time/:name" component={MarkdownArticle}></Route>
                    <Route path="/tags" component={Tags}></Route>
                </div>
            </div>
        )
    }
}

export default Layout