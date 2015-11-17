class InteractionService {
    constructor () {

    }

    static changePreference (title, preference, callback) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8179/vote/',
            data: { type: preference, title: title, emailAddress: $.cookie('userContext') },
            timeout: 7000,
            success: function (res) {
                callback(null, {vote: res, title: title});
            },
            error: function (err) {
                console.log('error');
            }
        });
    }

    static share (post, callback) {

    }
}