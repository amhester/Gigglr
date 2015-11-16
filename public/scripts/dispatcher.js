class Dispatcher {
    constructor () {
        this.registry = {};
        this.actionBuffer = [];
        this._animFrameId = null;
        this._startBufferCycle();
    }

    _startBufferCycle () {
        this._animFrameId = window.requestAnimationFrame(() => { this._nextBufferedAction.call(this); });
    }

    _stopBufferCycle () {
        window.cancelAnimationFrame(this._animFrameId);
        this._animFrameId = null;
    }

    _nextBufferedAction () {
        if(this.actionBuffer.length) {
            let action = this.actionBuffer.shift();
            this.registry[action.name].callbacks[action.action].apply(this.registry[action.name].context, action.params);
        }
        this._animFrameId = window.requestAnimationFrame(() => { this._nextBufferedAction.call(this); });
    }

    register (storeName, context, callbacks) {
        this.registry[storeName] = { context: context, callbacks: callbacks};
    }

    dispatch (storeName, action, params) {
        this.actionBuffer.push({name: storeName, action: action, params: params});
    }
}