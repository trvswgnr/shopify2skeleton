import 'bootstrap';
import balanceText from 'balance-text';
import images from './_images';
import Lightbox from './plugins/lightbox';
import * as Vue from 'vue';
import ShopifyAjax from './plugins/shopify-ajax';
import '../scss/theme.scss';

import addToCartButton from './components/AddToCartButton.vue';
import miniCart from './components/miniCart.vue';

balanceText();

// elements with [data-href] will be treated like links
document.querySelectorAll('[data-href]').forEach(el => el.addEventListener('click', e => window.location.href = el.dataset.href))

const app = Vue.createApp({
	data() {
		return {}
	},
	components: {
		addToCartButton,
		miniCart
	},
	methods: {
		async onAddToCart(component) {
			const result = await ShopifyAjax.post('/cart/add.js', component.data);
			const error = !!result.error;
			console.info('%c Result', 'font-weight: bold', result);
			component.loading = false;
			component.error = error;
			component.added = !error;
		}
	}
});
app.mount('#page');
