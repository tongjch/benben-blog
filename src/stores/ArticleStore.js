import AppDispatcher  from '../AppDispatcher';
import C from '../constants';
import {ReduceStore} from 'flux/utils';

class ArticleStore extends ReduceStore {

    getInitialState(){
        return "";
    }

    reduce(state,action){
        if(action.type === C.FETCH_ARTICLE_SUCC){
            console.log("action",action.payload.response);
            return action.payload.response;
        }
        return state;
    }
}

export default new ArticleStore(AppDispatcher);