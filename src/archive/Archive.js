import React,{Component} from 'react';
import {Container} from 'flux/utils';
import ArchiveStore from '../stores/ArchiveStore';
import ArchiveAction from '../action/ArchiveAction';
import Line from '../component/Line';
import { arch } from 'os';
require("../static/css/archive.css");

class Archive extends Component {

    componentDidMount(){
        ArchiveAction.fetchArchive();
    }

    render() {
        let archives = this.state.archives;
        let keys = Object.keys(archives);

        let content = keys.map((key) => {

            let lines = archives[key].map((article) => (
                <Line key={"archive_line_"+article.id} article={article} />
            ));

            return (
                <div key={"archive_"+key}>
                    <div className="archive-title"><h2>{key}</h2></div>
                    {lines}
                </div>
            )
        })

        return (
            <div className="archive-container">{content}</div>
        )
    }
}

Archive.getStores = () => ([ArchiveStore]);
Archive.calculateState = (prevState) => ({
    archives: ArchiveStore.getState()
});

export default Container.create(Archive);