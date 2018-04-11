import React,{Component} from 'react';
import TagAction from "../action/TagAction";
import TagStore from "../stores/TagStore";
import {Container} from 'flux/utils';
import Line from "../component/Line";
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
            content = arr.map((article) => (
                <Line key={"Line-" + article.id} article={article} />
            ))
        }

        return (
            <div className="s-tag-container">
                <div className="s-tag-title"><h2>{tag}<small>标签</small></h2></div>
                {content}
            </div>
        )
    }
} 


Tag.getStores = () => ([TagStore]);
Tag.calculateState = (prevState) => ({
    tags: TagStore.getState()
});

export default Container.create(Tag);