import AppDispatcher from "../AppDispatcher";
import ArchiveApi from "../api/ArchiveApi";
import C from "../constants";

let ArchiveAction = {
    fetchArchive() {
        AppDispatcher.dispatchAsync(ArchiveApi.fetchArchive(),{
            request: C.FETCH_ARCHIVE,
            success: C.FETCH_ARCHIVE_SUCC,
            failure: C.FETCH_ARCHIVE_FAIL
        })
    }
}

export default ArchiveAction;