import React,{Component} from 'react';
import TagAction from "../action/TagAction";
import TagStore from "../stores/TagStore";
import {Container} from 'flux/utils';
require("../static/css/tag.css");


class Tag extends Component {



    componentDidMount() {
        TagAction.fetchTags();
    }

    render() {

        let tag =this.props.match.params.tag;
        let tags = this.state.tags;
        let arr = tags[tag];
        let content = [];
        if(arr){
            content = arr.map((article) => {
                console.log(article);
            })
        }

        return (
            <div className="s-tag-container">
                <div className="s-tag-title"><h2>{tag}<small>标签</small></h2></div>
            </div>
        )
    }
} 


Tag.getStores = () => ([TagStore]);
Tag.calculateState = (prevState) => ({
    tags: TagStore.getState()
});

export default Container.create(Tag);