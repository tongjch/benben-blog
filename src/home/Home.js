import React,{Component} from 'react';
import {Container} from 'flux/utils';
import LastStore from '../stores/LastStore';
import LastAction from "../action/LastAction";
import ArticleSummary from "../summary/ArticleSummary";


class Home extends Component {


    componentDidMount(){
        LastAction.fetchArticles()
    }

    render() {
        let articles = this.state.articles.map((article) =>(
            <ArticleSummary key={article.id} article={article}></ArticleSummary>
        ));

        return (
            <div>{articles}</div>
        )
    }

}

Home.getStores = () => ([LastStore]);
Home.calculateState = (prevState) => ({
    articles: LastStore.getState()
});

export default Container.create(Home);