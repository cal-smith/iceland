import 'babel-polyfill';
import './style.scss';

console.log("hello, world");

// temp until babel fixes it's webcomponent compat
// see:
// https://github.com/babel/babel/issues/4480
// https://github.com/mixpanel/webcomponent/pull/1
// https://github.com/github/babel-plugin-transform-custom-element-classes/blob/f5067aa/lib/index.js#L4-L6
function HTMLComponent() { return Reflect.construct(HTMLElement, [], this.__proto__.constructor); };
Object.setPrototypeOf(HTMLComponent.prototype, HTMLElement.prototype);
Object.setPrototypeOf(HTMLComponent, HTMLElement);


class ImageList extends HTMLComponent {
	constructor() {
		super();
		this.shadow = this.attachShadow({mode: "open"});
	}

	connectedCallback() {
		this.shadow.innerHTML = `
			image list
			<slot></slot>
		`;
	}
}

customElements.define("image-list", ImageList);
