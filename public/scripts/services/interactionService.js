class InteractionService {
    constructor () {

    }

    static changePreference (id, preference, callback) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8179/vote/',
            data: { type: preference, contentId: id, emailAddress: $.cookie('userContext') },
            timeout: 7000,
            success: function (res) {
                callback(null, {vote: res, id: id});
            },
            error: function (err) {
                console.log('error');
            }
        });
    }

    static share (post, callback) {

    }
}