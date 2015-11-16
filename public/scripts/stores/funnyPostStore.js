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
                update: this.updatePost,
                remove: this.removePost,
                clear: this.clearAll
            }
        );
    }

    getPost (post) {

    }

    getAllPosts () {

    }

    addPost (post) {

    }

    removePost (post) {

    }

    updatePost (post) {

    }

    clearAll () {

    }
}