import account from '../fixtures/account.json';
import product from '../fixtures/hyva/product.json';
import checkout from '../fixtures/checkout.json';
import cart from '../fixtures/hyva/selectors/cart.json';
import selectors from '../fixtures/hyva/selectors/checkout.json';
import { Catalog } from '../page-objects/hyva/catalog';
import { Checkout } from '../page-objects/hyva/checkout';
import { Account } from '../page-objects/hyva/account';
import homepageSelectors from "../fixtures/hyva/selectors/homepage.json";
import {Magento2RestApi} from '../support/magento2-rest-api';

if(! Cypress.env('MAGENTO2_SKIP_CHECKOUT')) {
	describe('Create order', () => {
		
		it.only('Tax - AT', () => {
			//cy.setProductStock('6ES7414-2XG04-0AB0','Refurbished',99, 9)
			cy.request("https://my.api.mockaroo.com/users.json?key=1fa729b0").then((response) => {
				response.body.country = 'AT';
				response.body.TaxVat = '';
				Catalog.addProductToCart('6ES7414-2XG04-0AB0', 'Refurbished');
				cy.get('#CybotCookiebotDialogBodyLevelButtonAccept').click();
				cy.visit('/checkout');
				
				Checkout.enterShippingAddress(response.body);
				
				cy.get('body').then((body) => {
					if (body.find('#shipping-method-list li.active').length == 0) {
						cy.get('#shipping-method-list li').first().click();
						cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
						cy.get('#magewire-loader .animate-spin', { timeout: 25000 }).should('not.be.visible');
					}
				});
				
				cy.get('button.btn-next').should('be.visible').click();
				
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 60000 }).should('not.be.visible');
				
				
				cy.get('#payment-method-list li').first().click();
				
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 60000 }).should('not.be.visible');

				cy.get('#purchase-order-number').clear().type('Cypress: tax at').blur();
				cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');
				
				//cy.get('#order-comment').blur();
				//cy.get('#quote-summary div span.flex svg', { timeout: 10000 }).should('be.visible');
				
				cy.get('.btn-place-order').click();
			});
		});
    });
}
