// WhatsApp Configuration for Gatangu Enterprise
export const whatsappConfig = {
  // Order notification numbers
  orderNumbers: [
    {
      number: '254724526080',
      name: 'Primary Sales',
      description: 'Main orders and customer service'
    },
    {
      number: '254708328905',
      name: 'Operations Manager',
      description: 'Order fulfillment and logistics'
    },
    {
      number: '254724526080', // Replace with actual third number
      name: 'Store Manager',
      description: 'Inventory and store operations'
    }
  ],
  
  // Sending configuration
  sendDelay: 1000, // Delay between sends in milliseconds
  
  // Get array of just the numbers for easy access
  getNumbers: () => whatsappConfig.orderNumbers.map(config => config.number),
  
  // Get primary number (first in list)
  getPrimaryNumber: () => whatsappConfig.orderNumbers[0]?.number || '254708328905'
};

export default whatsappConfig;