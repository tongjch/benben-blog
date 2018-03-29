import React,{Component} from 'react';
import {  Link } from "react-router-dom";
require("../static/css/articleSummary.css");


class ArticleSummary extends Component {

    render(){
        let article = this.props.article;
        let id = article.id;
        
        let articleUrl = article.file;

        let tags = this.props.article.tags.map((tag) =>(
            <span key={id+"#"+tag}>&nbsp;{tag}&nbsp;</span>
        ));

        return (
            <div className="article-summary-container">
                <div className="article-summary-title">{article.name}</div>
                <div className="article-summary-meta">
                    <i className="fa fa-calendar-o"></i>
                    <span>&nbsp;&nbsp;&nbsp;发表于:&nbsp;{article.time}</span>
                    <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    <i className="fa fa-folder-o"></i>
                    <span>&nbsp;&nbsp;&nbsp;分类于:</span>
                    {tags}
                </div>
                <div className="article-summary-desc">{article.desc}</div>
                <div className="artilet-summary-operation">
                    <Link to={articleUrl}>阅读全文>></Link>
                </div>
            </div>
        )
    }
}

export default ArticleSummary;