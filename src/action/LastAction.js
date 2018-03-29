import AppDispatcher from "../AppDispatcher";
import LastApi from "../api/LastApi";
import C from "../constants";

let LastAction = {
    fetchArticles() {
        AppDispatcher.dispatchAsync(LastApi.fetchArticles(),{
            request: C.FETCH_LAST_ARTICLES,
            success: C.FETCH_LAST_ARTICLES_SUCC,
            failure: C.FETCH_LAST_ARTICLES_FAIL
        })
    }
}

export default LastAction;