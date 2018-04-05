import 'whatwg-fetch';

let TagApi = {

    fetchTags(){
        return fetch("/data/tags.json?_=" + new Date().getTime())
        .then((response) => response.json());
    }
}

export default TagApi;