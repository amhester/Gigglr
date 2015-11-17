window.eventer = new EventEmitter();
var dispatcher = new Dispatcher();
window.funnyPostStore = new FunnyPostStore('funnyPostStore');

function init() {
    ReactDOM.render(
        <GigglrSearch />,
        document.querySelector('#GigglrSearchContainer')
    );

    ReactDOM.render(
        <FunnyPostList />,
        document.querySelector('#PostListContainer')
    );
}
init();
