class InteractionService {
    constructor () {

    }

    static changePreference (id, preference, callback) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8179/vote',
            data: { type: preference, contentId: id, emailAddress: JSON.parse($.cookie('userContext')) },
            success: function (res) {
                callback(null, res);
            },
            error: function (err) {
                callback(err);
            }
        });
    }

    static share (post, callback) {

    }
}