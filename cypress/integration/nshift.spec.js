describe('Unifaun API Delivery Checkout Test', () => {
  const baseUrl = 'https://api.unifaun.com/rs-extapi/v1/delivery-checkouts/fe6956bd-6a68-4cc3-9165-5b6a617b694c';
  const bearerToken = 'FFVJIOXGGJA5X7AN-OUJLBRCWOLPGWYMKZ7UJ53YV'; // Replace with your actual Bearer token


const testCases = [
  // Standard Shipping (Non-Pallet)
  
	  /*
  {
    params: {
      tocountry: 'NL', // Netherlands
      tozipcode: '1011AB', // Valid postal code in the Netherlands
      weight: 2.5, // Weight < 3 kg
      pallet: false,
      cartprice: 150.0, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '0.00', // Price without currency sign
          estimatedDeliveryTime: '2 days',
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '20.00', // Price without currency sign
          estimatedDeliveryTime: '1 day',
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'NL', // Netherlands
      tozipcode: '1011AB', // Valid postal code in the Netherlands
      weight: 2.5, // Weight < 3 kg
      pallet: false,
      cartprice: 50.0, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '8.00', // Price without currency sign
          estimatedDeliveryTime: '2 days',
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '20.00', // Price without currency sign
          estimatedDeliveryTime: '1 day',
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'FR', // France
      tozipcode: '75001', // Valid postal code in France
      weight: 5.5, // Weight < 10 kg
      pallet: false,
      cartprice: 50, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '15.00', // Price without currency sign
          estimatedDeliveryTime: '3 days',
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '70.00', // Price without currency sign
          estimatedDeliveryTime: '2 days',
          method: 'usa01'
        }
      ]
    }
  },

  // Express Shipping (Non-Pallet)
  {
    params: {
      tocountry: 'PL', // Poland
      tozipcode: '00-001', // Valid postal code in Poland
      weight: 1.5, // Weight < 3 kg
      pallet: false,
      cartprice: 50, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '10.00', // Price without currency sign
          estimatedDeliveryTime: '2 days',
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '50.00', // Price without currency sign
          estimatedDeliveryTime: '1 day',
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'US', // United States
      tozipcode: '10001', // Valid postal code in the United States
      weight: 8.0, // Weight < 10 kg
      pallet: false,
      cartprice: 800, // > $1000
      currency: 'USD', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '80.00', // Price without currency sign
          estimatedDeliveryTime: '3 days',
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '135.00', // Price without currency sign
          estimatedDeliveryTime: '2 days',
          method: 'fed e'
        }
      ]
    }
  },

  // Standard Shipping (Pallet)
  {
    params: {
      tocountry: 'DE', // Germany
      tozipcode: '10115', // Valid postal code in Germany
      weight: 110.0, // Weight > 100 kg
      pallet: true,
      cartprice: 1000, // > €1000
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping Pallet',
          priceValue: '250.00', // Price without currency sign
          estimatedDeliveryTime: '5 days',
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '450.00', // Price without currency sign
          estimatedDeliveryTime: '5 days',
          method: 'fpf01'
        }
      ]
    }
  },
  */
  {
    params: {
      tocountry: 'ES', // Spain
      tozipcode: '28001', // Valid postal code in Spain
      weight: 90.0, // Weight < 100 kg
      pallet: true,
      cartprice: 900, // > €1000
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping Pallet',
          priceValue: '175.00', // Price without currency sign
          estimatedDeliveryTime: '5 days',
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '600.00', // Price without currency sign
          estimatedDeliveryTime: '5-8 days',
          method: 'fpf01'
        }
      ]
    }
  },

  // Express Shipping (Pallet)
  {
    params: {
      tocountry: 'HU', // Hungary
      tozipcode: '1051', // Valid postal code in Hungary
      weight: 90.0, // Weight < 100 kg
      pallet: true,
      cartprice: 700, // > €1000
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping Pallet',
          priceValue: '175.00', // Price without currency sign
          estimatedDeliveryTime: '5 days',
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '1400.00', // Price without currency sign
          estimatedDeliveryTime: '3-5 days',
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'BG', // Bulgaria
      tozipcode: '1000', // Valid postal code in Bulgaria
      weight: 120.0, // Weight > 100 kg
      pallet: true,
      cartprice: 1200, // > €1000
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping Pallet',
          priceValue: '275.00', // Price without currency sign
          estimatedDeliveryTime: '5 days',
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '1900.00', // Price without currency sign
          estimatedDeliveryTime: '3-5 days',
          method: 'fpf01'
        }
      ]
    }
  }
];



  testCases.forEach((testCase, index) => {
    it(`Checks delivery options for test case #${index + 1}: `+testCase.params.tocountry, () => {
      // Make the GET request with Bearer token
      cy.request({
        method: 'GET',
        url: baseUrl,
        qs: testCase.params,
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      }).then((response) => {
        // Assertions
        expect(response.status).to.eq(200); // Check if the status code matches

        const options = response.body.options;
        expect(options).to.be.an('array');
        //expect(options.length).to.eq(testCase.expected.options.length); // Check if the number of options matches
		console.log(options);
        options.forEach((option, index) => {
			console.log(option);
			console.log(testCase.expected.options[index]);
          expect(option.description2).to.eq(testCase.expected.options[index].method); // Check if the name matches
          expect(option.priceValue).to.eq(parseInt(testCase.expected.options[index].priceValue)); // Check if the price matches
          //expect(option.estimatedDeliveryTime).to.eq(testCase.expected.options[index].estimatedDeliveryTime); // Check if the estimated delivery time matches
        });
      });
    });
  });
});
