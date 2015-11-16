var GigglrSearch = React.createClass({
    search (e) {
        if(e.which === 13) {
            let q = $(e.target).val();
            SearchService.search(q, function (err, res) {
                dispatcher.dispatch('funnyPostStore', 'populate', [res])
            });
        }
    },

    render () {
        return (
            <section className="section--center mdl-grid mdl-grid--no-spacing" style={{marginTop: '100px'}}>
                <div className="mdl-cell mdl-cell--12-col">
                    <h1 style={{textAlign: 'center'}}>Gigglr</h1>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style={{width: '100%'}}>
                        <input className="mdl-textfield__input" type="text" id="GigglrSearch" onKeyPress={this.search} />
                        <label className="mdl-textfield__label" htmlFor="GigglrSearch">Search for something funny by topic...</label>
                    </div>
                </div>
            </section>
        );
    }
});