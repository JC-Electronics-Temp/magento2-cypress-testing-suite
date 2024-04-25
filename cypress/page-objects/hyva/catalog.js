
export class Catalog {

    static addProductToCart(sku, condition) {
        cy.visit('/'+sku).then(($response) => {
		if (condition) {
			if (condition == 'cashback') {
				this.setCondition('Refurbished');
				cy.get('#cashback').click();
			} else if (condition == 'repair') {
				cy.get('#repair').click();
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
		cy.get('input[value="'+conditionId+'"]').parent().click();
	}
	
	static getConditionId(condition) {
		var conditionId = 0;
		if (condition == 'Refurbished' {
			conditionId = 8995;
		} else if (condition == 'New JC-E repacked') {
			conditionId = 8994;
		} else {
			conditionId = 8993;
		}
		return conditionId;
		
	}
}
