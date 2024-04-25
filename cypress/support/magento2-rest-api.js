import {getWebsites} from './utils'

export class Magento2RestApi {
    static createCustomerAccount(customer) {
        cy.request({
            method: 'POST',
            url: '/rest/all/V1/customers',
            body: customer,
            failOnStatusCode: false,
        }).then((response) => {
            // Conditional testing is bad mmkay, I just haven't found a way to expect oneOf in different properties yet
            if (response.body.hasOwnProperty('message')) {
                cy.log(response.body.message)
                // expect(response.body.message).to.equal('Property "StreetAddress" does not have accessor method "getStreetAddress" in class "Magento\\Customer\\Api\\Data\\CustomerInterface".');
                expect(response.body.message).to.equal('A customer with the same email address already exists in an associated website.');
            } else if (response.body.hasOwnProperty('email')) {
                cy.log(response.body.message)
                expect(response.body.email).to.equal(customer.customer.email);
            }
        });
    }

    static logCustomerIn(customer) {
        cy.request({
            method: 'POST',
            url: '/rest/all/V1/integration/customer/token',
            body: customer,
        }).then((response) => {
            // TODO: do something with the token...
            cy.log(response.body)
            console.log(response.body)
        })
        // @TODO log customer in through API, set cookie and then continue tests as in account.spec.js
    }

    static updateProductQty(sku, qty) {
        cy.request({
            method: 'PUT',
            url: `/rest/V1/products/${sku}/stockItems/1`,
            body: {
                stockItem: {
                    qty: qty
                }
            },
            headers: {
                authorization: `Bearer ${Cypress.env('MAGENTO2_ADMIN_TOKEN')}`
            },
        }).then((response) => {
            console.log(response.body);
        });
    }

    static setProductStock(sku, condition, qty, qty_tested) {
		var is_in_stock = 0;
		if (qty > 0) {
			is_in_stock = 1;
		}
        cy.request({
            method: 'PUT',
            url: `/rest/V1/products/${sku} ${condition}`,
			body: { 
				product: {
					status: 1,
					extension_attributes: {
						stock_item: {
							qty: qty,
							is_in_stock: is_in_stock
						}
					},
					custom_attributes: [{
						attribute_code: "quantity_tested",
						value: qty_tested
					}]
				}
			},
            headers: {
                authorization: `Bearer ${Cypress.env('MAGENTO2_ADMIN_TOKEN')}`
            },
        }).then((response) => {
            console.log(response.body);
        });
    }

    static getProduct(condition, qty_tested) {
        cy.request({
            method: 'GET',
            url: `/rest/V1/products/
			?searchCriteria[filter_groups][0][filters][0][field]=quantity_tested
			&searchCriteria[filter_groups][0][filters][0][value]=1
			&searchCriteria[filter_groups][1][filters][0][field]=product_box_type
			&searchCriteria[filter_groups][1][filters][0][value]=8995
			&searchCriteria[filter_groups][1][filters][0][condition_type]==
			&searchCriteria[filter_groups][2][filters][0][field]=status
			&searchCriteria[filter_groups][2][filters][0][value]=1
			&searchCriteria[filter_groups][2][filters][0][condition_type]==
			&searchCriteria[pageSize]=2
			&fields=items[sku,quantity_tested,status,stock_item]`,	
            headers: {
                authorization: `Bearer ${Cypress.env('MAGENTO2_ADMIN_TOKEN')}`
            },
        }).then((response) => {
            console.log(response.body);
			// foreach
			return response.body.items[0].sku.replace(' Refurbished','');
        });
    }

    static getProductRepair(condition, qty_tested) {
        cy.request({
            method: 'GET',
            url: `/rest/V1/products/
			?searchCriteria[filter_groups][1][filters][0][field]=repair_price
			&searchCriteria[filter_groups][1][filters][0][condition_type]=gt
			&searchCriteria[filter_groups][1][filters][0][value]=100
			&searchCriteria[filter_groups][2][filters][0][field]=status
			&searchCriteria[filter_groups][2][filters][0][value]=1
			&searchCriteria[filter_groups][2][filters][0][condition_type]==
			&searchCriteria[pageSize]=2
			&fields=items[sku,status,stock_item]`,	
            headers: {
                authorization: `Bearer ${Cypress.env('MAGENTO2_ADMIN_TOKEN')}`
            },
        }).then((response) => {
            console.log(response.body);
			// foreach
			return response.body.items[0].sku.replace(' Refurbished','');
        });
    }

    /**
     * Creates a sales rule with randomly generated coupon code in a promise.
     *
     * @param discountPercent
     * @returns {PromiseLike<any> | Promise<any>}
     */
    static createRandomCouponCode(discountPercent = 10) {
        return getWebsites().then(websites => {
            return cy.request({
                method: 'POST',
                url: '/rest/V1/salesRules',
                headers: {
                    authorization: `Bearer ${Cypress.env('MAGENTO2_ADMIN_TOKEN')}`
                },
                body: {
                    rule: {
                        apply_to_shipping: true,
                        coupon_type: 'SPECIFIC_COUPON',
                        customer_group_ids: [0],
                        discount_amount: discountPercent,
                        discount_step: 1,
                        is_active: true,
                        is_advanced: false,
                        is_rss: false,
                        name: 'autogenerated',
                        simple_action: 'by_percent',
                        sort_order: 0,
                        stop_rules_processing: false,
                        times_used: 0,
                        use_auto_generation: true,
                        uses_per_coupon: 9999999,
                        uses_per_customer: 9999999,
                        website_ids: Object.values(websites.map(w => w.id)),
                    },
                },
            }).then(rule => {
                cy.request({
                    method: 'POST',
                    url: '/rest/V1/coupons/generate',
                    headers: {
                        authorization: `Bearer ${Cypress.env('MAGENTO2_ADMIN_TOKEN')}`
                    },
                    body: {
                        couponSpec: {
                            rule_id: rule.body.rule_id,
                            format: 'alphanum',
                            quantity: 1,
                            length: 10,
                            prefix: 'GEN',
                        },
                    },
                })
                    .then(coupon => {
                        return coupon.body[0]
                    })
            })
        })
    }
}
