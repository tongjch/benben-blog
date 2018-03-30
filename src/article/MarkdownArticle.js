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

        
        let content = marked(this.state.article);

        return (
            <div className="article-content" dangerouslySetInnerHTML={{__html: content}}></div>
        )
    }
}

MarkdownArticle.getStores = () => [ArticleStore];
MarkdownArticle.calculateState = (prevState) => ({
    article: ArticleStore.getState()
});

export default Container.create(MarkdownArticle);