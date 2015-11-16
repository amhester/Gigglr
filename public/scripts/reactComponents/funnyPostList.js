var FunnyPostList = React.createClass({
    getInitialState () {
        return {
            posts: funnyPostStore.getAllPosts()
        };
    },

    _setPosts () {
        this.setState({ posts: funnyPostStore.getAllPosts() });
    },

    componentWillMount () {
        eventer.addListener('funnyPostStoreChange', this._setPosts);
    },

    render () {
        return (
            <div>
                { this.state.posts.map((p) => { return (<FunnyPost post={p}></FunnyPost>); }) }
            </div>
        );
    }
});