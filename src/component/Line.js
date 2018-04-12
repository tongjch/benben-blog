import React,{Component} from 'react';
import {  Link } from "react-router-dom";
require("../static/css/line.css")

class Line extends Component {

    render() {
        let article = this.props.article;        
        return (
            <article className="artilce-line">
                <header className="article-line-header" >
                    <div className="artilce-line-meta">{article.time}</div>
                    <div className="article-line-title">
                        <Link to={article.file}><span>{article.name}</span></Link>
                    </div>
                </header>
            </article>
        )
    }
}

export default Line