import React,{Component} from 'react';
require("../static/css/line.css")

class Line extends Component {

    render() {

        let article = this.props.article;
        console.log(article);
        
        return (
            <article className="artilce-line">
                <header>
                    
                </header>
                <h2>移动端滚动穿透问题</h2>
            </article>
        )
    }
}

export default Line