class LoadMore extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.options = {
            target: this.dataset.target,
            id: this.dataset.sectionId,
            nextUrl: this.dataset.nextUrl,
        }

        this.parsedUrl = `${this.options.nextUrl}&sections=${this.options.id}`;

        this._bindEevents();
    }
    _bindEevents() {
        this.addEventListener('click', this._loadHandle)
    }
    _loadHandle() {
        fetch(this.parsedUrl, {
            method: 'GET',
        }).then(res => {
            return res.json()
        }).then(json => {
            let dom = new DOMParser().parseFromString(json[this.options.id], 'text/html');

            document.querySelector(this.options.target).innerHTML += dom.querySelector(this.options.target).innerHTML;
            this.parentElement.innerHTML = dom.querySelector('load-more').parentElement.innerHTML;
        });
    }
}
customElements.define('load-more', LoadMore);
