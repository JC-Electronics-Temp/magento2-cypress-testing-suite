import selectors from '../../fixtures/hyva/selectors/checkout.json';
import checkout from '../../fixtures/checkout';

export class Checkout {
    static enterShippingAddress(shippingAddress) {
		cy.get('#guest_details-email_address').type(shippingAddress.email);
		cy.get('#shipping-firstname').type(shippingAddress.firstname);
		cy.get('#shipping-lastname').type(shippingAddress.lastname);
		cy.get('#shipping-company').type(shippingAddress.company);
		cy.get('#shipping-street-0').type(shippingAddress.street);
		cy.get('#shipping-street-1').type(shippingAddress.housenumber);
		cy.get('#shipping-postcode').type(shippingAddress.zipcode);
		cy.get('#shipping-city').type(shippingAddress.city);
		cy.get('#shipping-country_id').select(shippingAddress.country);
		
		cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
		cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.not.visible');
				
        if (shippingAddress.country === 'United States') {
            cy.get(selectors.regionLabel).select(shippingAddress.region);
			cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
			cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.not.visible');
		}
		cy.get('#shipping-telephone').type(shippingAddress.phone);
		//cy.get('#shipping-vat_id').type(shippingAddress.TaxVat);
		if (shippingAddress.TaxVat != '') {
			cy.get('body').then(($body) => {
				if ($body.find('#shipping-vat_id').length > 0) {
					if (shippingAddress.TaxVat == 'default') {
						cy.get('#shipping-vat_id').type('NL858988069B01');
					} else {
						cy.get('#shipping-vat_id').type(shippingAddress.TaxVat);
					}
					cy.get('#shipping-vat_id').blur();
					cy.get('#shipping-vat-request-status', { timeout: 10000 }).should('be.visible');
					cy.get('#shipping-vat-request-status', { timeout: 20000 }).should('not.be.visible');
				}
			});
		}
    }

    static addSimpleProductToCart(productUrl) {
        cy.visit(productUrl);
        cy.get(selectors.addToCartButton).click();
    }

    static addProductToCart(sku) {
        cy.visit('/'${sku});
        cy.get(selectors.addToCartButton).click();
		cy.get(cart.product.messageToast)
					.should("include.text", "to your shopping cart")
					.should("be.visible");
    }

    static addCoupon(couponCode) {
        cy.visit(checkout.cartUrl);
        cy.get(selectors.openApplyDiscount).click();
        cy.get(selectors.couponField).type(couponCode);
        cy.get(selectors.applyDiscountButton).click();
    }
}
