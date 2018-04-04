import React,{Component} from 'react';
import {Container} from 'flux/utils';
import ArticleStore from '../stores/ArticleStore';
import ArticleAction from '../action/ArticleAction';
import marked from 'marked';
require("../static/css/article.css");

class MarkdownArticle extends Component {

    componentDidMount(){
        let url = this.props.match.url;
        ArticleAction.fetchArticle(url)
    }

    render(){
        let content = this.state.article;
        let url = this.props.match.url;
        return (
           <iframe src={url} frameborder="0" scrolling="no" width="100%"></iframe>
        )
    }
}

MarkdownArticle.getStores = () => [ArticleStore];
MarkdownArticle.calculateState = (prevState) => ({
    article: ArticleStore.getState()
});

export default Container.create(MarkdownArticle);