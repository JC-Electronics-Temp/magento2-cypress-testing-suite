import account from '../fixtures/account.json';
import product from '../fixtures/hyva/product.json';
import checkout from '../fixtures/checkout.json';
import cart from '../fixtures/hyva/selectors/cart.json';
import selectors from '../fixtures/hyva/selectors/checkout.json';
import { Catalog } from '../page-objects/hyva/catalog';
import { Checkout } from '../page-objects/hyva/checkout';
import { Account } from '../page-objects/hyva/account';
import homepageSelectors from "../fixtures/hyva/selectors/homepage.json";

if(! Cypress.env('MAGENTO2_SKIP_CHECKOUT')) {
	describe('Shipping costs', () => { 
		it.skip('Shipping: > 10kg, € 2000 product', () => {
			Catalog.addProductToCart('6SE7021-3EB20'); //2711E-K14C6
			cy.visit('/checkout');
			var countrySelect = cy.get('#shipping-country_id');
			var countries = ["NL","FR","PL","HU","BG","US","VN"];
			var standardCosts = ["€0.00","€0.00","€0.00","€0.00","€0.00","€0.00","€0.00"];
			var standardMethods = ["ust01","ust01","ust01","fec01","fec02","fec02","fec02"];
			var standardTimes = ["2","2","3","3","3","5","5"];
			var expressCosts = ["€40.00","€90.00","€90.00","€90.00","€90.00","€160.00","€190.00"];
			var expressMethods = ["usa01","usa01","usa01","fed_e","fed_e","fed_e","fed_e"];
			var expressTimes = ["1","1","2","2","2","3","3"];
			var i = 0;
			countries.forEach( (country)=>{
				var methods = 2;
				var method = 0;
				countrySelect.select(country);
				cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.not.visible');
				// number of methods
				if (country == "NL" || country == "FR") { // || country == "PL"
					//method = 1;
					//methods = 3;
				}
				cy.get('#shipping-method-list li').should('have.length', methods);
				
				// eq(0) is Standard, eq(3) is price DIV
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(standardCosts[i]);
				cy.get('#shipping-method-option-'+standardMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+standardMethods[i]+' .text-sm').should('include.text',', '+standardTimes[i]+' working day');
				method++;
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(expressCosts[i]);
				cy.get('#shipping-method-option-'+expressMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+expressMethods[i]+' .text-sm').should('include.text',', '+expressTimes[i]+' working day');
				i++;
			});
		});
		
		it.skip('Shipping: < 10kg, € 500 product', () => {
			Catalog.addProductToCart('6SE7018-0ES87-2DA0');
				cy.get("span[x-text=\"cart.summary_count\"]")
					.should('be.visible')
					.invoke('text')
					.then(parseFloat)
					.should('be.gte', 1);
			cy.visit('/checkout');
			var countrySelect = cy.get('#shipping-country_id');
			var countries = ["NL","FR","PL","HU","US","VN"];
			var standardCosts = ["€0.00","€0.00","€0.00","€0.00","€65.00","€80.00"];
			var standardMethods = ["ust01","ust01","ust01","fec01","fec02","fec02"];
			var standardTimes = ["2","2","3","3","5","5"];
			var expressCosts = ["€30.00","€70.00","€70.00","€70.00","€135.00","€140.00"];
			var expressMethods = ["usa01","usa01","usa01","fed_e","fed_e","fed_e"];
			var expressTimes = ["1","1","2","2","3","3"];
			var i = 0;
			countries.forEach( (country)=>{
				var method = 0;
				countrySelect.select(country);
				cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.not.visible');
				// number of methods
				cy.get('#shipping-method-list li').should('have.length', 2);
				// eq(0) is Standard, eq(3) is price DIV
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(standardCosts[i]);
				cy.get('#shipping-method-option-'+standardMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+standardMethods[i]+' .text-sm').should('include.text',', '+standardTimes[i]+' working day');
				method++;
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(expressCosts[i]);
				cy.get('#shipping-method-option-'+expressMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+expressMethods[i]+' .text-sm').should('include.text',', '+expressTimes[i]+' working day');
				i++;
			});
		});
		
		it.skip('Shipping: < 3kg, € 102 product', () => {
			Checkout.addSimpleProductToCart('6AV3572-1FX00');
				cy.get("span[x-text=\"cart.summary_count\"]")
					.should('be.visible')
					.invoke('text')
					.then(parseFloat)
					.should('be.gte', 1);
			cy.visit('/checkout');
			var countrySelect = cy.get('#shipping-country_id');
			
			var countries =  ["NL","FR","PL","HU","US","VN"];
			var standardCosts = ["€8.00","€10.00","€10.00","€20.00","€35.00","€35.00"];
			var standardMethods = ["ust01","ust01","ust01","fec01","fec02","fec02"];
			var standardTimes = ["2","2","3","3","5","5"];
			var expressCosts = ["€20.00","€50.00","€50.00","€50.00","€50.00","€100.00"];
			var expressMethods = ["usa01","usa01","usa01","fed_e","fed_e","fed_e"];
			var expressTimes = ["1","1","2","2","3","3"];
			var i = 0;
			countries.forEach( (country)=>{
				var method = 0;
				countrySelect.select(country);
				cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.not.visible');
				// number of methods
				cy.get('#shipping-method-list li').should('have.length', 2);
				// eq(0) is Standard, eq(3) is price DIV
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(standardCosts[i]);
				cy.get('#shipping-method-option-'+standardMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+standardMethods[i]+' .text-sm').should('include.text',', '+standardTimes[i]+' working day');
				method++;
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(expressCosts[i]);
				cy.get('#shipping-method-option-'+expressMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+expressMethods[i]+' .text-sm').should('include.text',', '+expressTimes[i]+' working day');
				i++;
			});
		});
		
		it.skip('Shipping: > 3kg < 10kg, € 102 product', () => {
			Checkout.addSimpleProductToCart('6AV2100-0AA01-0AA0');
				cy.get("span[x-text=\"cart.summary_count\"]")
					.should('be.visible')
					.invoke('text')
					.then(parseFloat)
					.should('be.gte', 1);
			cy.visit('/checkout');
			var countrySelect = cy.get('#shipping-country_id');
			
			var countries =  ["NL","FR","PL","HU","US","VN"];
			var standardCosts = ["€10.00","€15.00","€15.00","€21.00","€65.00","€80.00"];
			var standardMethods = ["ust01","ust01","ust01","fec01","fec02","fec02"];
			var standardTimes = ["2","2","3","3","5","5"];
			var expressCosts = ["€30.00","€70.00","€70.00","€70.00","€135.00","€140.00"];
			var expressMethods = ["usa01","usa01","usa01","fed_e","fed_e","fed_e"];
			var expressTimes = ["1","1","2","2","3","3"];
			var i = 0;
			countries.forEach( (country)=>{
				var method = 0;
				countrySelect.select(country);
				cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.not.visible');
				// number of methods
				cy.get('#shipping-method-list li').should('have.length', 2);
				// eq(0) is Standard, eq(3) is price DIV
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(standardCosts[i]);
				cy.get('#shipping-method-option-'+standardMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+standardMethods[i]+' .text-sm').should('include.text',', '+standardTimes[i]+' working day');
				method++;
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(expressCosts[i]);
				cy.get('#shipping-method-option-'+expressMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+expressMethods[i]+' .text-sm').should('include.text',', '+expressTimes[i]+' working day');
				i++;
			});
		});
		
		
		it('Shipping: > 100kg, pallet product', () => {
			Checkout.addSimpleProductToCart('6se7032-1tg60');
			cy.get(cart.product.messageToast)
					.should("include.text", "to your shopping cart")
					.should("be.visible");
			cy.visit('/checkout');
			var countrySelect = cy.get('#shipping-country_id');
			
			var countries =  ["NL","FR","PL","HU","US","VN"];
			var standardCosts = ["€250.00","€275.00","€275.00","€350.00","€1,200.00","€1,300.00"];
			var standardMethods = ["cec01","cec01","cec01","cec01","fef01","fef01"];
			var standardTimes = ["5","5","5","5","5","8"];
			var expressCosts = ["€450.00","€750.00","€750.00","€975.00","€1,800.00","€1,900.00"];
			var expressMethods = ["fpf01","fpf01","fpf01","fpf01","fpf01","fpf01"];
			var expressTimes = ["3","3","3","3","3","5"];
			var i = 0;
			countries.forEach( (country)=>{
				var method = 0;
				countrySelect.select(country);
				cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.not.visible');
				// number of methods
				cy.get('#shipping-method-list li').should('have.length', 2);
				// eq(0) is Standard, eq(3) is price DIV
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(standardCosts[i]);
				cy.get('#shipping-method-option-'+standardMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+standardMethods[i]+' .text-sm').should('include.text',', '+standardTimes[i]+' working day');
				method++;
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(expressCosts[i]);
				cy.get('#shipping-method-option-'+expressMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+expressMethods[i]+' .text-sm').should('include.text',', '+expressTimes[i]+' working day');
				i++;
			});
		});
		
		it('Shipping: < 100kg, pallet product', () => {
			Checkout.addSimpleProductToCart('6SE7031-2EF70');
			cy.get(cart.product.messageToast)
					.should("include.text", "to your shopping cart")
					.should("be.visible");
			cy.visit('/checkout');
			var countrySelect = cy.get('#shipping-country_id');
			
			var countries =  ["NL","FR","PL","HU","US","VN"];
			var standardCosts = ["€150.00","€175.00","€175.00","€250.00","€750.00","€900.00"];
			var standardMethods = ["cec01","cec01","cec01","cec01","fef01","fef01"];
			var standardTimes = ["5","5","5","5","5","8"];
			var expressCosts = ["€350.00","€600.00","€600.00","€600.00","€1,400.00","€1,400.00"];
			var expressMethods = ["fpf01","fpf01","fpf01","fpf01","fpf01","fpf01"];
			var expressTimes = ["3","3","3","3","3","5"];
			var i = 0;
			countries.forEach( (country)=>{
				var method = 0;
				countrySelect.select(country);
				cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
				cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.not.visible');
				// number of methods
				cy.get('#shipping-method-list li').should('have.length', 2);
				// eq(0) is Standard, eq(3) is price DIV
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(standardCosts[i]);
				cy.get('#shipping-method-option-'+standardMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+standardMethods[i]+' .text-sm').should('include.text',', '+standardTimes[i]+' working day');
				method++;
				cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(expressCosts[i]);
				cy.get('#shipping-method-option-'+expressMethods[i]).should('exist');
				cy.get('#shipping-method-option-'+expressMethods[i]+' .text-sm').should('include.text',', '+expressTimes[i]+' working day');
				i++;
			});
		});
	});
	
	
	
	
    describe('Checkout tests', () => {
		it.skip('Set Product Stocks', () => {
			cy.setProductStock('6AV6641-0CA01-0AX1', 'Refurbished', 5, 1);
		});

        it.skip('Can see the correct product price and shipping costs', () => {
            Checkout.addProductToCart('/6AV6641-0CA01-0AX1');
			
            cy.get(selectors.productPrice).then(($PDPprice) => {
                //expect(/\$\d+\.\d{2}/.test($PDPprice[0].innerText.trim())).to.be.true;
                const PDPPrice = $PDPprice[0].innerText.trim();
                cy.visit(checkout.checkoutUrl);
                Checkout.enterShippingAddress(checkout.shippingAddress);
                cy.get('.justify-around > .btn').click();
                cy.get('.flex > .mt-2 > .inline-block').click();
                cy.get(selectors.checkoutSubtotalPrice).then(($checkoutPrice) => {
                    // The price has some form of "$12.32"
                    const checkoutPrice = $checkoutPrice[0].innerText.trim();
                    expect($checkoutPrice[0].innerText.trim()).to.equal(PDPPrice);
                    expect(/\$\d+\.\d{2}/.test($checkoutPrice[0].innerText.trim()))
                        .to.be.true;
                    cy.get(selectors.checkoutShippingPrice).then(
                        ($shippingPrice) => {
                            const shippingPrice =
                                $shippingPrice[0].innerText.trim();
                            expect(/\$\d+\.\d{2}/.test(shippingPrice)).to.be.true;
                            cy.get('.mt-3 > .flex > :nth-child(2)').then(
                                ($totalPrice) => {
                                    const totalPrice =
                                        $totalPrice[0].innerText.trim();
                                    expect(/\$\d+\.\d{2}/.test(totalPrice)).to.be
                                        .true;
                                    expect(
                                        +checkoutPrice.slice(1) +
                                        +shippingPrice.slice(1)
                                    ).to.equal(+totalPrice.slice(1));
                                }
                            );
                        }
                    );
                });
            });
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
