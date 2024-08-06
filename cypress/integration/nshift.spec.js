describe('Unifaun API Delivery Checkout Test', () => {
  const baseUrl = 'https://api.unifaun.com/rs-extapi/v1/delivery-checkouts/fe6956bd-6a68-4cc3-9165-5b6a617b694c';
  const bearerToken = 'FFVJIOXGGJA5X7AN-OUJLBRCWOLPGWYMKZ7UJ53YV'; // Replace with your actual Bearer token


const testCases = [
  // Standard Shipping (Non-Pallet)
  
  {
    params: {
      tocountry: 'NL', // Netherlands
      tozipcode: '1011AB', // Valid postal code in the Netherlands
      weight: 2.5, // Weight < 3 kg
      pallet: false,
      cartprice: 150.0, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'DE'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '0.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '20.00', // Price without currency sign
          estimatedDeliveryTime: 1,
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
          estimatedDeliveryTime: 2,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '20.00', // Price without currency sign
          estimatedDeliveryTime: 1,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'NL', // Netherlands
      tozipcode: '1011AB', // Valid postal code in the Netherlands
      weight: 7, // Weight < 10 kg
      pallet: false,
      cartprice: 99.0, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '10.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '30.00', // Price without currency sign
          estimatedDeliveryTime: 1,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'NL', // Netherlands
      tozipcode: '1011AB', // Valid postal code in the Netherlands
      weight: 11, // Weight > 10 kg
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
          priceValue: '15.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '40.00', // Price without currency sign
          estimatedDeliveryTime: 1,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'FR', // France
      tozipcode: '75001', // Valid postal code in France
      weight: 18.5, // Weight < 3 kg
      pallet: false,
      cartprice: 100, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '0.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '80.00', // Price without currency sign
          estimatedDeliveryTime: 1,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'FR', // France
      tozipcode: '75001', // Valid postal code in France
      weight: 1.5, // Weight < 3 kg
      pallet: false,
      cartprice: 99, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '10.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '40.00', // Price without currency sign
          estimatedDeliveryTime: 1,
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
          estimatedDeliveryTime: 2,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '60.00', // Price without currency sign
          estimatedDeliveryTime: 1,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'FR', // France
      tozipcode: '75001', // Valid postal code in France
      weight: 10, // Weight > 10 kg
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
          priceValue: '21.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '80.00', // Price without currency sign
          estimatedDeliveryTime: 1,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'PL', // Poland
      tozipcode: '00-001', // Valid postal code in Poland
      weight: 1.5, // Weight < 3 kg
      pallet: false,
      cartprice: 150, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '0.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '50.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'usa01'
        }
      ]
    }
  },
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
          priceValue: '25.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '50.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'PL', // Poland
      tozipcode: '00-001', // Valid postal code in Poland
      weight: 9.5, // Weight < 10 kg
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
          priceValue: '30.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '70.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'PL', // Poland
      tozipcode: '00-001', // Valid postal code in Poland
      weight: 118.5, // Weight > 10 kg
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
          priceValue: '35.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'ust01'
        },
        {
          name: 'Express Shipping',
          priceValue: '90.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'usa01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'FI', // Finland
      tozipcode: '96100', // Valid postal code in Poland
      weight: 118.5, // Weight > 10 kg
      pallet: false,
      cartprice: 1050, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '0.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fec01'
        },
        {
          name: 'Express Shipping',
          priceValue: '90.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'FI', // Finland
      tozipcode: '96100', // Valid postal code in Poland
      weight: 0.18, // Weight < 3 kg
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
          priceValue: '20.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fec01'
        },
        {
          name: 'Express Shipping',
          priceValue: '50.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'FI', // Finland
      tozipcode: '96100', // Valid postal code in Poland
      weight: 8.5, // Weight < 10 kg
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
          priceValue: '21.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fec01'
        },
        {
          name: 'Express Shipping',
          priceValue: '70.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'FI', // Finland
      tozipcode: '96100', // Valid postal code in Poland
      weight: 18.5, // Weight > 10 kg
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
          priceValue: '28.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fec01'
        },
        {
          name: 'Express Shipping',
          priceValue: '90.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'GB', // United Kingdom
      tozipcode: 'SW1A1AA', // Valid postal code in United Kingdom
      weight: 4.5, // Weight > 10 kg
      pallet: false,
      cartprice: 150, // > €100
      currency: 'EUR', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '0.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '70.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'GB', // United Kingdom
      tozipcode: 'SW1A1AA', // Valid postal code in United Kingdom
      weight: 0.5, // Weight < 3 kg
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
          priceValue: '20.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '50.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'GB', // United Kingdom
      tozipcode: 'SW1A1AA', // Valid postal code in United Kingdom
      weight: 3.0, // Weight < 10 kg
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
          priceValue: '21.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '70.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'GB', // United Kingdom
      tozipcode: 'SW1A1AA', // Valid postal code in United Kingdom
      weight: 10, // Weight > 10 kg
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
          priceValue: '28.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '90.00', // Price without currency sign
          estimatedDeliveryTime: 2,
          method: 'fed e'
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
      cartprice: 1800, // > $1000
      currency: 'USD', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '0.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '80.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'US', // United States
      tozipcode: '10001', // Valid postal code in the United States
      weight: 1.0, // Weight < 3 kg
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
          priceValue: '35.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '40.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fed e'
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
          priceValue: '65.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '80.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'US', // United States
      tozipcode: '10001', // Valid postal code in the United States
      weight: 18.0, // Weight > 10 kg
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
          priceValue: '90.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '160.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'VN', // Vietnam
      tozipcode: '790000', // Valid postal code in the Vietnam
      weight: 1.0, // Weight < 3 kg
      pallet: false,
      cartprice: 99999, // > $1000
      currency: 'USD', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '0.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '100.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'VN', // Vietnam
      tozipcode: '790000', // Valid postal code in the Vietnam
      weight: 2.99, // Weight < 3 kg
      pallet: false,
      cartprice: 999, // > $1000
      currency: 'USD', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '35.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '100.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'VN', // Vietnam
      tozipcode: '790000', // Valid postal code in the Vietnam
      weight: 9.99, // Weight < 10 kg
      pallet: false,
      cartprice: 999, // > $1000
      currency: 'USD', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '80.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '140.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fed e'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'VN', // Vietnam
      tozipcode: '790000', // Valid postal code in the Vietnam
      weight: 9999, // Weight > 10 kg
      pallet: false,
      cartprice: 999, // > $1000
      currency: 'USD', // Currency parameter added
      language: 'EN'
    },
    expected: {
      status: 200,
      options: [
        {
          name: 'Standard Shipping',
          priceValue: '130.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fec02'
        },
        {
          name: 'Express Shipping',
          priceValue: '190.00', // Price without currency sign
          estimatedDeliveryTime: 3,
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
      weight: 10.0, // Weight < 100 kg
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
          priceValue: '150.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '250.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
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
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '450.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'IT', // Italy
      tozipcode: '10115', // Valid postal code in Italy
      weight: 10.0, // Weight < 100 kg
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
          priceValue: '175.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '500.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'IT', // Italy
      tozipcode: '10115', // Valid postal code in Italy
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
          priceValue: '275.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '750.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
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
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '500.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'ES', // Spain
      tozipcode: '28001', // Valid postal code in Spain
      weight: 190.0, // Weight < 100 kg
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
          priceValue: '275.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '750.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
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
          priceValue: '250.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '600.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'HU', // Hungary
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
          priceValue: '350.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '975.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'BG', // Bulgary
      tozipcode: '1051', // Valid postal code in Bulgary
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
          priceValue: '250.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '600.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'BG', // Bulgary
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
          priceValue: '350.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'cec01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '975.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'US', // US
      tozipcode: '28001', // Valid postal code in US
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
          priceValue: '750.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fef01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '1400.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'US', // US
      tozipcode: '28001', // Valid postal code in US
      weight: 190.0, // Weight < 100 kg
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
          priceValue: '1200.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fef01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '1800.00', // Price without currency sign
          estimatedDeliveryTime: 3,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'VN', // Vietnam
      tozipcode: '790000', // Valid postal code in Vietnam
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
          priceValue: '900.00', // Price without currency sign
          estimatedDeliveryTime: 8,
          method: 'fef01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '1400.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fpf01'
        }
      ]
    }
  },
  {
    params: {
      tocountry: 'VN', // Vietnam
      tozipcode: '790000', // Valid postal code in Vietnam
      weight: 190.0, // Weight < 100 kg
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
          priceValue: '1300.00', // Price without currency sign
          estimatedDeliveryTime: 8,
          method: 'fef01'
        },
        {
          name: 'Express Shipping Pallet',
          priceValue: '1900.00', // Price without currency sign
          estimatedDeliveryTime: 5,
          method: 'fpf01'
        }
      ]
    }
  }
];



  testCases.forEach((testCase, index) => {
    it(`Nshift #${index + 1}: `+testCase.params.tocountry+','+testCase.params.weight+' kg,'+testCase.params.pallet, () => {
      // Make the GET request with Bearer token
	  cy.log(JSON.stringify(testCase.params));
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
        expect(options.length).to.eq(testCase.expected.options.length); // Check if the number of options matches
        options.forEach((option, index) => {
			console.log(option);
			console.log(testCase.expected.options[index]);
          expect(option.description2).to.eq(testCase.expected.options[index].method); // Check if the name matches
          expect(option.priceValue).to.eq(parseInt(testCase.expected.options[index].priceValue)); // Check if the price matches
          expect(option.description1).to.contains(testCase.expected.options[index].estimatedDeliveryTime.toString()); // Check if the estimated delivery time matches
        });
      });
    });
  });
});
