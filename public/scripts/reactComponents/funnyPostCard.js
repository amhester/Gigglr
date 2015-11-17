var FunnyPostCard = React.createClass({
    _changePreference (preference) {
        //dispatcher.dispatch('funnyPostStore', 'update', [{ id: this.props.post.id, vote: preference }]);
        InteractionService.changePreference(this.props.post.title, preference, function (err, res) {
            dispatcher.dispatch('funnyPostStore', 'update', [res]);
        });
    },

    like (e) {
        let pref = (this.props.post.preference === 0) ? 1 : 0;
        this._changePreference(pref);
    },

    share (e) {
        InteractionService.share(this.props.post, function (err, res) {

        });
    },

    getInitialState () {
        return window.funnyPostStore.signedIn ? { styles: {} } : { styles: { display: 'none' } };
    },

    componentWillMount () {
        window.eventer.addListener('funnyPostStoreChange', () => { this.setState({ styles: window.funnyPostStore.signedIn ? {} : { display: 'none' } }); });
    },

    render () {
        let post = this.props.post;
        let fav = post.preference == 1 ? 'favorite' : 'favorite_border';
        return (
            <section data-postid={post.id} className={(post.mediaMetaData.type !== 'none') ? 'postSection hasMedia' : 'postSection'} style={{position: 'relative'}}>
                    {(function () {
                        if(post.mediaMetaData.type === 'image') {
                            return (
                                <header className="postMedia">
                                    <img src={post.mediaUrl} alt="Funny Picture" width={post.mediaMetaData.res.width} height={post.mediaMetaData.res.height} className="funnyPost-picture" />
                                </header>
                            );
                        } else if(post.mediaMetaData.type === 'asdfasdf') {
                            return (
                                <header className="postMedia">
                                    <video width={post.mediaMetaData.res.width} height={post.mediaMetaData.res.height} controls>
                                        <source src={post.mediaUrl} />
                                        Your browser does not support html5 video.
                                    </video>
                                </header>
                            );
                        } else if (post.mediaMetaData.type === 'video') {
                            return (
                                <header className="postMedia">
                                    <div className="aspect-ratio">
                                        <iframe width={post.mediaMetaData.res.width} height={post.mediaMetaData.res.height} src={post.mediaUrl} frameBorder="0">
                                        </iframe>
                                    </div>
                                </header>
                            );
                        } else {
                            return null;
                        }
                    })()}
                <div className="postCard mdl-card mdl-cell mdl-cell--12-col-desktop">
                    <div className="mdl-card__supporting-text">
                        <h4>{post.title}</h4>
                        {post.text}
                    </div>
                    <div className="actions">
                        <a href={post.source} target="_blank" className="mdl-button">Go to source</a>
                    </div>
                </div>
                <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon favorite" style={this.state.styles} onClick={this.like} >
                    <i className="material-icons" style={{ color: (fav === 'favorite') ? '#f00' : '#666' }}>{fav}</i>
                </button>
            </section>
        );
    }
});