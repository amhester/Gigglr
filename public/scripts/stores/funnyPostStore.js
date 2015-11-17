class FunnyPostStore {
    constructor (name) {
        this._name = name;
        this._posts = [];
        this._register();
        this._signedIn = false;
    }

    get name () { return this._name; }

    get signedIn () { return this._signedIn; }

    _register () {
        dispatcher.register(
            this._name,
            this,
            {
                add: this.addPost,
                populate: this.populate,
                update: this.updatePost,
                remove: this.removePost,
                clear: this.clearAll,
                signIn: this.changedSignedIn
            }
        );
    }

    _emitChange () {
        eventer.emitEvent(this._name + 'Change');
    }

    getPost (post) {

    }

    getAllPosts () {
        return this._posts;
    }

    addPost (post) {

    }

    populate (posts) {
        this._posts = posts;
        this._emitChange();
    }

    removePost (post) {

    }

    updatePost (result) {
        var post = this._posts.filter(function (it) {
            return it.title == result.title;
        });
        post[0].preference = parseInt(result.vote, 10);
        this._emitChange();
    }

    clearAll () {

    }

    changedSignedIn(signedIn){
        this._signedIn = signedIn;
        this._emitChange();
    }
}