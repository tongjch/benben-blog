import React,{Component} from 'react';
import {Container} from 'flux/utils';


class MarkdownArticle extends Component {

    constructor(props){
        super(props)
        this.state = {
            height: '1000px'
        }
    }

    handleLoad = (event) => {
        let height = event.target.contentDocument.body.offsetHeight+"px";
        console.log(height);
        this.setState({height:height})
    }

    render(){
        let url = this.props.match.url;
        let height = this.state.height;
        console.log(height);
        return (
           <iframe src={url} frameborder="0" scrolling="no" width="100%" height={height} onLoad={this.handleLoad} ></iframe>
        )
    }
}



export default MarkdownArticle;