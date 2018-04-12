import AppDispatcher  from '../AppDispatcher';
import C from '../constants';
import {ReduceStore} from 'flux/utils';

class ArchiveStore extends ReduceStore {

    getInitialState(){
        return {};
    }

    reduce(state,action){
        if(action.type === C.FETCH_ARCHIVE_SUCC){
            console.log("action",action.payload.response);
            return action.payload.response;
        }
        return state;
    }
}

export default new ArchiveStore(AppDispatcher);