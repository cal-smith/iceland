import 'babel-polyfill';
import './style.scss';

// navigator.serviceWorker.register("servicebundle.js")
// 	.then(registration => console.log("added service worker"))
// 	.catch(error => console.log("failed to add service worker", error));

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
		this.styles = `
			.carousel {
				position: relative;
			}
			button {
			    width: 40px;
			    background: rgba(255,255,255, 0.10);
			    border: none;
			    height: 100%;
			    position: absolute;
			}
			button:hover {
				background: rgba(255,255,255, 0.25);
			}
			button:after {
				content: "";
			    display: block;
			    height: 25px;
			    width: 25px;
			    border-left: 1px solid var(--primary-blue);
			    border-bottom: 1px solid var(--primary-blue);
			    position: relative;
			    opacity: 0.5;
			    transition: all 0.3s ease;
			}
			button:hover:after {
				opacity: 1;
			}
			.previous {
			    left: 0;
			    top: 0;
			}
			.previous[disabled] {
				display: none;
			}
			.previous:after {
			    transform: rotate(45deg) scale(0.9);
			    left: 10px;
			}
			.previous:hover:after {
				transform: rotate(45deg) scale(1);
				left: 8px;
			}
			.next {
			    top: 0;
			    right: 0;
			}
			.next[disabled] {
				display: none;
			}
			.next:after {
				transform: rotate(-135deg) scale(0.9);
			    right: 10px;
			}
			.next:hover:after {
				transform: rotate(-135deg) scale(1);
				right: 8px;
			}
			.current-image {
			    display: flex;
			    align-content: center;
			    align-items: center;
			    flex-direction: column;
			    background: var(--primary-gray);
			}
			.current-image img {
			    max-width: 100%;
			    max-height: 600px;
			}
			.imglist {
				padding: 5px 40px;
				background: var(--primary-gray);
			    height: 70px;
			    white-space: nowrap;
			    overflow: auto;
			}
			.imglist .img {
				display: inline-block;
				margin: 5px;
				padding: 5px;
				background: white;
			}
			.imglist .img:hover {
				background: var(--primary-blue);
			}
			.imglist .img img {
				height: 50px;
				display: block;
			}
		`;
		this.index = 0;
		this.images = []
	}

	resetArrows(previous, next) {
		previous.disabled = false;
		next.disabled = false;
		if (this.index === 0) {
			previous.disabled = true;
		}
		if (this.index >= this.images.length-1) {
			next.disabled = true;
		}
	}

	connectedCallback() {
		this.images = Array.from(this.children)
		this.images.forEach(image => image.removeAttribute("height"));
		this.shadow.innerHTML = `
			<div class="carousel">
				<button class="previous" disabled></button>
				<div class="current-image">
					${this.images[this.index].outerHTML}
				</div>
				<button class="next"></button>
				<div class="imglist">
					${this.images.reduce((acc, img, index) => 
						acc += `<div class="img" data-index="${index}">${img.outerHTML}</div>`, "")}
				</div>
			</div>
			<style>${this.styles}</style>
		`;
		let currentImage = this.shadow.querySelector(".current-image");
		let previous = this.shadow.querySelector(".previous");
		let next = this.shadow.querySelector(".next");
		this.shadow.querySelectorAll(".img").forEach(img => {
			let self = this;
			img.addEventListener("click", function() {
				self.index = parseInt(this.dataset.index);
				currentImage.innerHTML = self.images[self.index].outerHTML;
				self.resetArrows(previous, next);
			});
		});
		previous.addEventListener("click", () => {
			if (this.index > 0) {
				this.index--;
				currentImage.innerHTML = this.images[this.index].outerHTML;
				this.resetArrows(previous, next);
			}
		});
		next.addEventListener("click", () => {
			if (this.index < this.images.length-1) {
				this.index++;
				currentImage.innerHTML = this.images[this.index].outerHTML;
				this.resetArrows(previous, next);
			}
		});
	}
}

customElements.define("image-list", ImageList);
