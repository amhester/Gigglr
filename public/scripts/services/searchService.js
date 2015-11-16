class SearchService {
    constructor () {

    }

    static search (q, callback) {
        $.ajax({
            method: 'GET',
            url: 'http://localhost:8179/search/' + q,
            success: function (res) {
                var data = res.map(function (o) { return new FunnyPost(o); });
                callback(null, data);
            },
            error: function (err) {
                callback(err);
            }
        });
    }
}