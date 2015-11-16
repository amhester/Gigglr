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
        if(this.state.posts && this.state.posts.length) {
            return (
                <div>
                    { this.state.posts.map((p) => { return (<FunnyPostCard post={p}></FunnyPostCard>); }) }
                </div>
            );
        } else {
            return (<div></div>);
        }
    }
});