class SearchService {
    constructor () {

    }

    static search (q, callback) {
        $.ajax({
            method: 'GET',
            url: '127.0.0.1:8085/search?q=' + q,
            success: function (res) {
                if(res.statusCode == 200) {
                    callback(null, res);
                }
            },
            error: function (err) {
                callback(err);
            }
        });
    }
}