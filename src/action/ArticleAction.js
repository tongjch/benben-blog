import AppDispatcher from "../AppDispatcher";
import ArticleApi from "../api/ArticleApi";
import C from "../constants";

let ArticleAction = {
    fetchArticle(path) {
        AppDispatcher.dispatchAsync(ArticleApi.fetchArticle(path),{
            request: C.FETCH_ARTICLE,
            success: C.FETCH_ARTICLE_SUCC,
            failure: C.FETCH_ARTICLE_FAIL
        })
    }
}

export default ArticleAction;