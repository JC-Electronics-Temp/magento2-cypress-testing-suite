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
		
		it('Account - companycredit - cashback', () => {
			cy.getProduct('refurbished', 1).then((sku) => {
				Account.login(
					account.customer.customer.email,
					account.customer.password
				);
				Catalog.addProductToCart(sku, 'cashback');
				cy.visit('/checkout');
				
				cy.get('.address-grid .address-item.active').should('exist');
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
				cy.get('body').then((body) => {
					if (body.find('#payment-method-list li.active').length == 0) {
						cy.get('#payment-method-option-companycredit').click();
						cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
						cy.get('#magewire-loader .animate-spin', { timeout: 60000 }).should('not.be.visible');
					}
				});

				cy.get('#purchase-order-number').clear().type('Cypress: cashback').blur();
				cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');
				
				cy.get('#order-comment').type('order comment').blur();
				cy.get('#quote-summary div span.flex svg', { timeout: 10000 }).should('be.visible');
				
				cy.get('.btn-place-order').click();
				cy.get('body').should('have.class', 'checkout-onepage-success');
			});
		});
		
		it('Account - companycredit - cashback', () => {
			Account.login(
				account.customer.customer.email,
				account.customer.password
			);
			Catalog.addProductToCart('6ES7414-2XG04-0AB0', 'cashback');
			cy.visit('/checkout');
			
			cy.get('#shipping-method-list li').first().click(); 
			cy.get('.address-grid .address-item.active').should('exist');
			cy.wait(10000);

			cy.get('button.btn-next').click();
			cy.wait(10000);

			cy.get('#payment-method-option-companycredit').click();
			cy.wait(10000);

			cy.get('#purchase-order-number').type('Cypress: cashback').blur();
			cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');
			
			cy.get('.btn-place-order').click();
			cy.get('body').should('have.class', 'checkout-onepage-success');
		});
		
		it('Account - companycredit - repair', () => {
			cy.getProductRepair('refurbished', 1).then((sku) => {
				Account.login(
					account.customer.customer.email,
					account.customer.password
				);
				//Catalog.addProductToCart('6ES7414-2XG04-0AB0', 'repair');
				Catalog.addProductToCart(sku, 'repair');
				
				cy.visit('/checkout');
				
				cy.get('#shipping-method-list li').first().click();
				cy.get('.address-grid .address-item.active').should('exist');
				cy.wait(10000);
				
				cy.get('button.btn-next').click();
				cy.wait(5000);
				
				cy.get('#payment-method-option-companycredit').click();
				cy.wait(5000);
				
				cy.get('#purchase-order-number').type('Cypress: Repair').blur();				
				cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');
				
				cy.get('.btn-place-order').click();
				cy.get('body').should('have.class', 'checkout-onepage-success');
				
			});
		});
		
		it('Account - companycredit - urgent handling', () => {
			cy.getProduct('refurbished', 1).then((sku) => {
				Account.login(
					account.customer.customer.email,
					account.customer.password
				);
				Catalog.addProductToCart(sku);
				cy.visit('/checkout');
				
				cy.get('#urgent-handling').should('not.exist');
				
				Catalog.addProductToCart(sku);
				cy.visit('/checkout');
				
				cy.get('#urgent-handling').should('exist');
				cy.get('#urgent-handling').click();
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 25000 }).should('not.be.visible');
				
				cy.get('#shipping-method-list li').first().click();
				cy.get('.address-grid .address-item.active').should('exist');
				cy.wait(10000);
				
				cy.get('button.btn-next').click();
				cy.wait(5000);
				
				cy.get('#payment-method-option-companycredit').click();
				cy.wait(5000);
				
				cy.get('#purchase-order-number').type('Cypress: Urgent handling').blur();				
				cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');
				
				//cy.get('.btn-place-order').click();
				//cy.get('body').should('have.class', 'checkout-onepage-success');
			});
		});
		
		
		it('Guest - US - CC', () => {
			
			Catalog.addProductToCart('6AU1445-2AD00-0AA0');
			cy.visit('/checkout');
			
			cy.request("https://my.api.mockaroo.com/accdataoutsideeu.json?key=1fa729b0").then((response) => {
				
				cy.get('#guest_details-email_address').type(response.body.email);
				cy.get('#shipping-firstname').type(response.body.firstname);
				cy.get('#shipping-lastname').type(response.body.lastname);
				cy.get('#shipping-street-0').type(response.body.street);
				cy.get('#shipping-street-1').type(response.body.housenumber);
				cy.get('#shipping-postcode').type(response.body.zipcode);
				cy.get('#shipping-city').type(response.body.city);
				cy.get('#shipping-country_id').select(response.body.country);
				cy.get('#shipping-region').select(response.body.state);
				cy.get('#shipping-telephone').type(response.body.phone);
				cy.get('#shipping-company').type(response.body.company);
				//cy.get('#shipping-vat_id').type(response.body.TaxVat);

			});
			
			/*
			//Urgent handling
			var urgentHandling = true;
			if (urgentHandling) {
				cy.get('#urgent-handling').click();
				cy.wait(5000);
			}
			*/
						
			cy.get('#shipping-method-list li').first().click();
			cy.wait(10000);
			cy.get('button.btn-next').click();
			cy.wait(5000);
			
			// Creditcard
				cy.get('#payment-method-option-adyen_cc', { timeout: 10000 }).click();
				cy.wait(5000);
				cy.frameLoaded('iframe[title="Iframe for card number"]');
				cy.iframe('iframe[title="Iframe for card number"]').find('[data-fieldtype="encryptedCardNumber"]', { timeout: 10000 }).should('be.visible', { timeout: 10000 }).type('4111 1111 4555 1142');
				
				cy.frameLoaded('iframe[title="Iframe for expiry date"]');
				cy.iframe('iframe[title="Iframe for expiry date"]').find('[data-fieldtype="encryptedExpiryDate"]').type('03/30');
				
				cy.frameLoaded('iframe[title="Iframe for security code"]');
				cy.iframe('iframe[title="Iframe for security code"]').find('[data-fieldtype="encryptedSecurityCode"]').type('737');
				
				cy.get('[name="holderName"]').type('J. Doe');
			
			cy.get('#purchase-order-number').type('Cypress Guest CC test').blur();
			
			//cy.get('#shipping-vat-request-status', { timeout: 5000 }).should('be.visible');
			cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');
			
			cy.get('.btn-place-order').click();
			cy.get('body').should('have.class', 'checkout-onepage-success');
				
		
		});
		
		it('Guest - NL - Ideal', () => {
			cy.request("https://my.api.mockaroo.com/users.json?key=1fa729b0").then((response) => {
			
				Catalog.addProductToCart('6AU1445-2AD00-0AA0');
				cy.visit('/checkout');
				
				response.body.vat_id = 'default';
				Checkout.enterShippingAddress(response.body);
				
				cy.get('#shipping-vat-request-status', { timeout: 10000 }).should('not.be.visible');
				
				cy.get('#shipping-method-list li').first().click();
				
				cy.wait(10000);
				cy.get('button.btn-next').click();
				cy.wait(5000);
				cy.get('#payment-method-option-adyen_hpp_ideal', { timeout: 10000 }).click();
				cy.get('.adyen-checkout__dropdown__button').click();
				cy.get('#listItem-1154').click();
				
				cy.get('#purchase-order-number').type('Cypress Guest Ideal test').blur();
				
				cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');
				
				cy.get('.btn-place-order').click();
				
				cy.origin('https://test.adyen.com', () => {
					cy.wait(10000);
					cy.get('body').contains('iDEAL Issuer Simulation');
					cy.get('.btnLink').click();
				});
				cy.wait(5000);
				cy.origin('https://www.acc-jc-electronics.com', () => {
					
				});

			});

		});
		
    describe('Checkout tests', () => {
		it.skip('Set Product Stocks', () => {
			cy.setProductStock('6AV6641-0CA01-0AX1', 'Refurbished', 5, 1);
		});

        it.skip('Can see the correct product price and shipping costs', () => {
            Checkout.addProductToCart('/6AV6641-0CA01-0AX1');
			
        });

        it.skip('Can see coupon discount in checkout', () => {
            Checkout.addSimpleProductToCart(product.couponProductUrl);
            Checkout.addCoupon(product.couponCode);
            cy.get(selectors.cartSummeryDiscount).should('be.visible');
            cy.visit(checkout.checkoutUrl);
            cy.get(selectors.checkoutSubtotalPrice).then(($totalsPrice) => {
                const price = +$totalsPrice[0].innerText.match(/\d+\.\d\d/g)[0];
                cy.get(selectors.checkoutDiscountPrice).then(($discount) => {
                    const discount = +$discount[0].innerText.match(/\d+\.\d\d/g)[0];
                    cy.get(selectors.checkoutTotalPrice).then(($total) => {
                        const total = +$total[0].innerText.match(/\d+\.\d\d/g)[0];
                        expect(+total.toFixed(1)).to.equal(
                            +(price - discount).toFixed(1)
                        );
                    });
                });
            });
        });

        it.skip(
            ['hot', 'footer'],
            'Can find and order in the customer order history after having placed an order',
            () => {
                Checkout.addSimpleProductToCart(product.simpleProductUrl);
                Account.login(
                    account.customer.customer.email,
                    account.customer.password
                );
                cy.visit(checkout.checkoutUrl);
                cy.get(selectors.checkoutContainer).then(($checkout) => {
                    // cy.wait(4000);
                    // if customer has a default shipping address no new shipping address needs to be entered
                    /*if (
                        !$checkout[0].querySelectorAll(selectors.addressSelected)
                            .length
                    ) {
                        cy.get(selectors.addressSelected).should('not.exist');
                        cy.get(selectors.shippingAddressEditButton, {timeout: 5000}).click()
                        cy.get('[for=\"shipping_address.company\"]')
                            .click()
                            .type('Test')
                        cy.get(selectors.saveAddressBtn).click();
                    }
					*/
                    //cy.get(selectors.shippingMethodBlock).click();
                    cy.get(shippingMethodField 'ol li').first().click();
                    cy.get(selectors.addressSelected).should('exist');
                    cy.get(selectors.shippingMethodField).click();
                    cy.get(selectors.moneyOrderPaymentMethodSelector).click();
                    cy.get(selectors.placeOrderBtn).click();
                    cy.get(selectors.shippingAddressButtons).should(
                        'not.contain.text',
                        'Save'
                    );
                    cy.get(selectors.orderConfirmationOrderNumber).then(
                        ($orderNr) => {
                            cy.visit(checkout.orderHistoryUrl);
                            cy.get(selectors.accountViewOrder).first().click();
                            cy.get(selectors.orderHistoryOrderNumber).then(
                                ($orderHistoryOrderNr) => {
                                    cy.log($orderNr);
                                    const orderNrRegex = /\d{9}/;
                                    const orderNr =
                                        $orderNr[0].innerText.match(
                                            orderNrRegex
                                        )[0];
                                    const orderHistoryNr =
                                        $orderHistoryOrderNr[0].innerText.match(
                                            orderNrRegex
                                        )[0];
                                    expect(orderNr).to.be.equal(orderHistoryNr);

                                    // Log out and test the Orders and Returns footer link, only visible to guests
                                    cy.get(selectors.myAccountMenuItems).contains('Sign Out').click();
                                    cy.get(homepageSelectors.mainHeading).should(
                                        'contain.text',
                                        'You have signed out'
                                    );

                                    cy.get(selectors.footerOrdersReturns).click();
                                    cy.get(selectors.ordersReturnsOrderId).type(orderNr);
                                    cy.get(selectors.ordersReturnsBillingLastName).type(account.customer.customer.lastname);
                                    cy.get(selectors.ordersReturnsEmail).type(account.customer.customer.email);
                                    cy.get(selectors.ordersReturnsSubmit).click();
                                    cy.get(selectors.ordersReturnsTitle).should(
                                        "contain.text",
                                        orderNr,
                                        "Order Number matches recent order"
                                    );
                                    cy.get(selectors.ordersReturnsOrderItems).should(
                                        "contain.text",
                                        product.simpleProductName,
                                        "Product items matches recent order"
                                    );
                                }
                            );
                        }
                    );
                });
            }
        );
    });
}
