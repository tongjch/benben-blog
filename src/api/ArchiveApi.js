import 'whatwg-fetch';

let ArchiveApi = {

    fetchArchive(){
        return fetch("/data/data.json?_=" + new Date().getTime())
        .then((response) => response.json());
    }
}
export default ArchiveApi;