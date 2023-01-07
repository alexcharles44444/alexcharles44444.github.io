class W4String extends Asset {

    constructor(index1, string, display) {
        super(index1);
        this.index1 = index1;
        this.string = string;
        this.display = display;
        if (this.display == null)
            this.display = string;
    }

    static compareTo(a, o) {
        if (a.string < o.string) {
            return -1;
        }
        if (a.string > o.string) {
            return 1;
        }
        return 0;
    }

    method_searchString() {
        return this.string;
    }
}
