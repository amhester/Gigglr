class FunnyPost {
    constructor (data) {
        var media = data.video ? data.video : (data.image ? data.image : '');
        var mediaType = data.video ? 'video' : (data.image ? 'image' : 'none');
        this._postId = data.customId;
        this._title = data.title || 'Untitled';
        this._text = data.extraContent || '';
        this._mediaUrl = media ? media.link : '';
        this._mediaMetaData = {
            type: mediaType,
            res: {
                width: media.width || 200,
                height: media.height || 200
            },
            format: data.mediaFormat || ''
        };
        this._source = data.externalLink;
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