import React,{Component} from 'react';
import Header from '../header/Header'
require("../static/css/base.css")


class Layout extends Component {
    
    render(){
        return (
            <div className="container">
                <Header />
            </div>
        )
    }
}

export default Layout