const recorder = {
    audioBlobs: [],
    mediaRecorder: null,
    streamBeingCaptured: null,
    async start() {
        if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
        }

        return navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                this.streamBeingCaptured = stream
                this.mediaRecorder = new MediaRecorder(stream)
                this.audioBlobs = [];

                this.mediaRecorder.addEventListener('dataavailable', event => {
                    this.audioBlobs.push(event.data)
                })

                this.mediaRecorder.start()
            })
    },
    stop() {
        return new Promise(resolve => {
            const mimeType = this.mediaRecorder.mimeType;

            this.mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(this.audioBlobs, {type: mimeType})
                resolve(audioBlob)
            })

            this.cancel()
        })
    },
    cancel: function () {
        this.mediaRecorder.stop();
        this.stopStream();
        this.reset();
    },
    stopStream() {
        this.streamBeingCaptured.getTracks()
            .forEach(track => track.stop())
    },
    reset() {
        this.mediaRecorder = null;
        this.streamBeingCaptured = null;
    }
}