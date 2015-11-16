var FunnyPostCard = React.createClass({
    _changePreference (preference) {
        InteractionService.changePreference(this.props.post.id, preference, function (err, res) {
            dispatcher.dispatch('funnyPostStore', 'update', [res.post]);
        });
    },

    like (e) {
        let pref = (this.props.post.preference === 0) ? 1 : 0;
        this._changePreference(pref);
    },

    unlike (e) {
        let pref = (this.props.post.preference === 0) ? -1 : 0;
        this._changePreference(pref);
    },

    share (e) {
        InteractionService.share(this.props.post, function (err, res) {

        });
    },

    getDefaultProps () {
        var returnObj;
        if ($.cookie('userContext')){
            returnObj = {};
        }
        else {
            returnObj = {
                display: 'none'
            };
        }
        return returnObj;
    },

    render () {
        let post = this.props.post;
        return (
            <section className="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                    {(function () {
                        if(post.mediaMetaData.type === 'image') {
                            return (
                                <header className="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">
                                    <img src={post.mediaUrl} alt="Funny Picture" width={post.mediaMetaData.res.width} height={post.mediaMetaData.res.height} className="funnyPost-picture" />
                                </header>
                            );
                        } else if(post.mediaMetaData.type === 'asdfasdf') {
                            return (
                                <header className="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">
                                    <video width={post.mediaMetaData.res.width} height={post.mediaMetaData.res.height} controls>
                                        <source src={post.mediaUrl} />
                                        Your browser does not support html5 video.
                                    </video>
                                </header>
                            );
                        } else if (post.mediaMetaData.type === 'video') {
                            return (
                                <header className="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">
                                    <iframe width={post.mediaMetaData.res.width} height={post.mediaMetaData.res.height} src={post.mediaUrl} frameborder="0">
                                    </iframe>
                                </header>
                            );
                        } else {
                            return null;
                        }
                    })()}
                <div className="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">
                    <div className="mdl-card__supporting-text">
                        <h4>{post.title}</h4>
                        {post.text}
                    </div>
                    <div className="mdl-card__actions">
                        <a href={post.source} target="_blank" className="mdl-button">Go to source</a>
                    </div>
                </div>
                <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" style={this.props.styles}>
                    <i className="material-icons">favorite_border</i>
                </button>
            </section>
        );
    }
});