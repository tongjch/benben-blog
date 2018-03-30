import 'whatwg-fetch';

let ArticleApi = {

    fetchArticle(path){
        return fetch(path + "?_=" + new Date().getTime())
        .then((response) => response.text());
    }
}

export default ArticleApi;