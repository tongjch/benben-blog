import AppDispatcher from "../AppDispatcher";
import TagApi from "../api/TagApi";
import C from "../constants";

let TagAction = {
    fetchTags() {
        AppDispatcher.dispatchAsync(TagApi.fetchTags(),{
            request: C.FETCH_TAGS,
            success: C.FETCH_TAGS_SUCC,
            failure: C.FETCH_TAGS_FAIL
        })
    }
}

export default TagAction;