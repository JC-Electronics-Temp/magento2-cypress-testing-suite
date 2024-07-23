
export class Catalog {

    static addProductToCart(sku, condition) {
		condition = condition.toLowerCase();
        cy.visit('/'+sku).then(($response) => {
		if (condition) {
			if (condition == 'cashback') {
				this.setCondition('refurbished');
				cy.get('#cashback').click();
			} else if (condition == 'repair') {
				cy.get('#repair').click({force: true});
				
				cy.get('#repair_serial').should('not.be.disabled').type('serial_number');
				cy.get('#repair_comment').should('not.be.disabled').type('this is the comment for this repair');
				
			} else {
				this.setCondition(condition);
			}
		}
		cy.get('#product-addtocart-button').click();
		if (condition != 'repair') {
			cy.get('#product-addtocart-button').should('be.disabled');
			cy.get('#product-addtocart-button').should('not.be.disabled');
		}
		
		cy.get("span[x-text=\"cart.summary_count\"]")
			.should('be.visible')
			.invoke('text')
			.then(parseFloat)
			.should('be.gte', 1);
		});
    }
	
	static setCondition(condition) {
		var conditionId = this.getConditionId(condition);
		cy.get('input[value="'+conditionId+'"]').should('exist').parent().click();
	}
	
	static getConditionId(condition) {
		console.log(condition);
		var conditionId = 0;
		if (condition == 'refurbished') {
			conditionId = 8995;
		} else if (condition == 'new jc-e repacked') {
			conditionId = 8994;
		} else if (condition == 'cashback') {
			conditionId = 8995;
		} else if (condition == 'repair') {
			conditionId = 8995;
		} else {
			conditionId = 8993;
		}
		return conditionId;
		
	}
}
