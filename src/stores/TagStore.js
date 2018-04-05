import AppDispatcher  from '../AppDispatcher';
import C from '../constants';
import {ReduceStore} from 'flux/utils';

class TagStore extends ReduceStore {

    getInitialState(){
        return {};
    }

    reduce(state,action){
        if(action.type === C.FETCH_TAGS_SUCC){
            console.log("action",action.payload.response);
            return action.payload.response;
        }
        return state;
    }
}

export default new TagStore(AppDispatcher);