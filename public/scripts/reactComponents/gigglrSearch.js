const GigglrSearch = React.createClass({
    search (e) {

    },

    render () {
        return (
            <section class="section--center mdl-grid mdl-grid--no-spacing" style="margin-top: 100px;">
                <div class="mdl-cell mdl-cell--12-col">
                    <h1 class="" style="text-align: center;">Gigglr</h1>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">
                        <input class="mdl-textfield__input" type="text" id="GigglrSearch" />
                        <label class="mdl-textfield__label" for="GigglrSearch">Search for something funny by topic...</label>
                    </div>
                </div>
            </section>
        );
    }
});