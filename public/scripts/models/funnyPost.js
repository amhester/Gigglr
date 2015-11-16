class FunnyPost {
    constructor (data) {
        this._postId = data.id;
        this._title = data.title || 'Untitled';
        this._text = data.text || '';
        this._mediaUrl = data.mediaUrl || '';
        this._mediaMetaData = {
            type: data.mediaType || 'none',
            res: {
                width: data.media.resolution.width || 200,
                height: data.media.resolution.height || 200
            },
            format: data.mediaFormat || ''
        };
        this._source = data.source || '';
        this._preference = data.preference || 0;
    }

    get id () { return this._postId; }
    get title () { return this._title; }
    get text () { return this._text; }
    get mediaUrl () { return this._mediaUrl; }
    get mediaMetaData () { return this._mediaMetaData; }
    get source () { return this._source; }
    get preference () { return this._preference; }
    set title (newVal) { this._title = newVal; }
    set text (newVal) { this._text = newVal; }
    set mediaUrl (newVal) { this._mediaUrl = newVal; }
    set mediaMetaData (newVal) { this._mediaMetaData = newVal; }
    set source (newVal) { this._source = newVal; }
    set preference (newVal) { this._preference = newVal; }
}