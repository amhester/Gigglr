class FunnyPostStore {
    constructor (name) {
        this._name = name;
        this._posts = [];
        this._register();
    }

    get name () { return this._name; }

    _register () {
        dispatcher.register(
            this._name,
            this,
            {
                add: this.addPost,
                populate: this.populate,
                update: this.updatePost,
                remove: this.removePost,
                clear: this.clearAll
            }
        );
    }

    _emitChange () {
        eventer.emitEvent(this._name + 'Change');
    }

    getPost (post) {

    }

    getAllPosts () {

    }

    addPost (post) {

    }

    populate (posts) {
        this._posts = posts;
        this._emitChange();
    }

    removePost (post) {

    }

    updatePost (post) {

    }

    clearAll () {

    }
}