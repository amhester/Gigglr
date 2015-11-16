var eventer = new EventEmitter();
var dispatcher = new Dispatcher();
var funnyPostStore = new FunnyPostStore('funnyPostStore');

function init() {
    React.render(
        <GigglrSearch />,
        document.querySelector('#GigglrSearchContainer')
    );

    React.render(
        <GigglrSearch />,
        document.querySelector('#PostListContainer')
    );
}

init();