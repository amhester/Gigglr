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
        if ($.cookie('userContext')) {
            var q = { models : models, emailAddress : $.cookie('userContext')};
            $.ajax({
                method: 'POST',
                url: 'http://localhost:8179/finalizeContent/',
                data: q,
                timeout: 7000,
                success: function ( res) {
                    var persistModels = models;
                    if (res) {
                        if (!res.length){
                            res = [res];
                        }
                        res = res.map(function (it) { return it.title; } );
                    }
                    for (var i = 0; i < persistModels.length; i++){
                        if (res){
                            if (res.indexOf(persistModels[i].title) > -1){
                                persistModels[i].preference = 1;
                            }
                        }
                    }
                    var data = persistModels.map(function (o) { return new FunnyPost(o); });
                    callback(null, data);
                },
                error: function (err) {
                    callback(err);
                }
            });
        }
        else{
            var data = models.map(function (o) { return new FunnyPost(o); });
            callback(null, data);
        }
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