class W4CallbackManager {
    constructor(a, b, c) {
        this.numCalls = 0;
        this.numCallsTarget = 0;
        this.finalFunc = null;
        this.finalCallOnFinish = true;
        this.finalCallSent = false;

        if (c === undefined) {
            this.constructor0(a, b);
        } else {
            this.constructor1(a, b, c);
        }
    }

    constructor0(numCallsTarget, finalFunc) {
        this.numCallsTarget = numCallsTarget;
        this.finalFunc = finalFunc;
        if (this.numCallsTarget == 0 && this.finalCallOnFinish) {
            if (this.finalFunc != null)
                this.finalFunc();
            this.finalCallSent = true;
        }
    }

    constructor1(numCallsTarget, finalFunc, finalCallOnFinish) {
        this.numCallsTarget = numCallsTarget;
        this.finalFunc = finalFunc;
        this.finalCallOnFinish = finalCallOnFinish;
        if (this.numCallsTarget == 0 && this.finalCallOnFinish) {
            if (this.finalFunc != null)
                this.finalFunc();
            this.finalCallSent = true;
        }
    }

    call() {
        ++this.numCalls;
        if (this.numCalls == this.numCallsTarget && this.finalCallOnFinish) {
            if (this.finalFunc != null)
                this.finalFunc();
            this.finalCallSent = true;
        }
    }
}
