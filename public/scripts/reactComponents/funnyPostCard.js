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

    render () {
        let post = this.props.post;
        return (
            <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
                    {(function () {
                        if(post.mediaMetaData.type === 'image') {
                            return (
                                <header class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">
                                    <img src="{post.mediaUrl}" alt="Funny Picture" width="{post.mediaMetaData.res.width}" height="{post.mediaMetaData.res.height}" class="funnyPost-picture" />
                                </header>
                            );
                        } else if(post.mediaMetaData.type === 'video') {
                            return (
                                <header class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">
                                    <video width="{post.mediaMetaData.res.width}" height="{post.mediaMetaData.res.height}" controls>
                                        <source src="{post.mediaUrl}" type="{post.mediaMetaData.format}" />
                                        Your browser does not support html5 video.
                                    </video>
                                </header>
                            );
                        } else if (post.mediaMetaData.type === 'embed') {
                            return (
                                <header class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">
                                    <iframe width="{post.mediaMetaData.res.width}" height="{post.mediaMetaData.res.height}" src="{post.mediaUrl}" frameborder="0">
                                    </iframe>
                                </header>
                            );
                        } else {
                            return null;
                        }
                    })()}
                    <!--<i class="material-icons">play_circle_filled</i>-->
                <div class="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">
                    <div class="mdl-card__supporting-text">
                        <h4>{post.title}</h4>
                        {post.text}
                    </div>
                    <div class="mdl-card__actions">
                        <a href="{post.source}" class="mdl-button">Go to source</a>
                    </div>
                </div>
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="btn6">
                    <i class="material-icons">favorite_border</i>
                </button>
            </section>
        );
    }
});