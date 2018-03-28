import React,{Component} from 'react';
require("../static/css/header.css")

class Header extends Component {
    
    render () {
        return (
            <div className="header-container">
                <div className="header-center-container">
                    <div className="header-author">BenBen Blog</div>
                </div>
            </div>
        )
    }
}

export default Header