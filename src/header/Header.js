import React,{Component} from 'react';
require("../static/css/header.css")

class Header extends Component {
    
    render () {
        return (
            <div className="header-container">
                <div className="header-center-container">
                    <div className="header-author">BenBen Blog</div>
                    <div className="header-menu-container">
                        <ul className="header-menu">
                            <li className="header-menu-item">
                                <i className="fa fa-home fa-fw"></i>
                                首页
                            </li>
                            <li className="header-menu-item">
                            <i className="fa fa-tags fa-fw"></i>
                                标签
                            </li>
                            <li className="header-menu-item">分类</li>
                            <li className="header-menu-item">归档</li>
                            <li className="header-menu-item">搜索</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header