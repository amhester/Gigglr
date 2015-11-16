class InteractionService {
    constructor () {

    }

    static changePreference (id, preference, callback) {
        $.ajax({
            method: 'PUT',
            url: '',
            data: { preference: preference, id: id },
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