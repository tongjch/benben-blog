import AppDispatcher  from '../AppDispatcher';
import C from '../constants';
import {ReduceStore} from 'flux/utils';

class LastStore extends ReduceStore {

    getInitialState(){
        return [];
    }

    reduce(state,action){
        if(action.type === C.FETCH_LAST_ARTICLES_SUCC){
            console.log("action",action.payload.response);
            return action.payload.response;
        }
        return state;
    }
}

export default new LastStore(AppDispatcher);