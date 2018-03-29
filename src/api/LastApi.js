import 'whatwg-fetch';

let LastApi = {
    fetchArticles(){
        return fetch('/data/last.json?_='+new Date().getTime())
        .then((response) => response.json());
    }
}

export default LastApi