import React,{Component} from 'react';
import {Container} from 'flux/utils';
import LastStore from '../stores/LastStore';
import LastAction from "../action/LastAction";


class Home extends Component {


    componentDidMount(){
        console.log("mount home");
        LastAction.fetchArticles()
    }

    render() {
        let articles = this.state.articles;
        return (
            <div>hello world  {articles.length}</div>
        )
    }

}

Home.getStores = () => ([LastStore]);
Home.calculateState = (prevState) => ({
    articles: LastStore.getState()
});

export default Container.create(Home);