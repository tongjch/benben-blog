import React,{Component} from "react";
import TagAction from "../action/TagAction";
import TagStore from "../stores/TagStore";
import {Container} from 'flux/utils';
import { Link } from "react-router-dom";
require("../static/css/tags.css");


class Tags extends Component {

    componentDidMount(){
        TagAction.fetchTags();
    }

    tagClass(tag) {
        var className = "tag-block"
        if(tag == "JAVA" || tag == "Spring"){
            className += " tag-block-focus"
        }
        return className;
    }

    render() {

        let keys = Object.keys(this.state.tags);

        let size = keys.length;

        let tags = keys.map((tag) => (
            <div className={this.tagClass(tag)} key={"tags-"+tag}>
                <Link to={"/tag/"+tag}>{tag}</Link>
            </div>
        ));

        return (
            <div className="tag-container">
                <div className="tag-title">文章标签</div>
                <div className="tag-size">目前共计&nbsp;{size}&nbsp;个标签</div>
                <div className="tag-blocks">
                    {tags}
                </div>
            </div>
        )
    }
}

Tags.getStores = () => ([TagStore]);
Tags.calculateState = (prevState) => ({
    tags: TagStore.getState()
});

export default Container.create(Tags);