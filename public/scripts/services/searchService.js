class SearchService {
    constructor () {

    }

    static search (q, callback) {
        $.ajax({
            method: 'GET',
            url: 'http://localhost:8179/search/' + q,
            timeout: 7000,
            success: function (res) {
                callback(null, res);
            },
            error: function (err) {
                callback(err);
            }
        });
    }

    static finalizePosts (models, callback) {
        var q = models;
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8179/finalizeContent/',
            data: q,
            timeout: 7000,
            success: function (res) {
                var data = res.map(function (o) { return new FunnyPost(o); });
                callback(null, data);
            },
            error: function (err) {
                callback(err);
            }
        });
    }

    static getFavorites (q, callback) {
        var fUrl = 'http://localhost:8179/favorites/' + $.cookie('userContext');
        fUrl += (q) ? '?q=' + q : '';
        $.ajax({
            method: 'GET',
            url: fUrl,
            timeout: 7000,
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