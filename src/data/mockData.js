const generateRealisticData = () => {
  const categories = {
    Food: ['Zomato', 'Swiggy', 'Starbucks', 'Blinkit', 'Local Grocery', 'McDonalds', 'Dominos'],
    Transport: ['Uber', 'Ola Rides', 'Metro Recharge', 'Indian Oil', 'IRCTC'],
    Entertainment: ['Netflix', 'Spotify', 'BookMyShow', 'Amazon Prime', 'PVR Cinemas'],
    Bills: ['Airtel Broadband', 'Jio Mobile', 'Electricity Bill', 'Water Bill', 'Maintenance'],
    Shopping: ['Amazon.in', 'Flipkart', 'Myntra', 'H&M'],
    Health: ['Apollo Pharmacy', 'Practo Consult', '1mg', 'Gym Membership'],
    Investment: ['Zerodha SIP', 'Groww Mutual Fund', 'PPF Deposit'],
    Salary: ['TechCorp Salary'],
    Freelance: ['Upwork Client', 'Fiverr Payout', 'Consulting Fee']
  };

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const transactions = [];
  let idCounter = 1;

  // Generate data for past 6 months (Nov 2025 to April 2026) for a more grounded, realistic view
  const startDate = new Date('2025-11-01');
  const endDate = new Date('2026-04-30');
  
  let currentMonth = new Date(startDate);
  
  const baseSalary = 95000;

  while (currentMonth <= endDate) {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const strMonth = month.toString().padStart(2, '0');

    // 1. Fixed Income
    transactions.push({
      id: `tx-${idCounter++}`,
      title: 'Monthly Salary',
      date: `${year}-${strMonth}-01T09:00:00Z`,
      amount: baseSalary,
      category: 'Salary',
      type: 'income'
    });

    // Occasional freelance (less frequent to be realistic)
    if (Math.random() > 0.6) {
      transactions.push({
        id: `tx-${idCounter++}`,
        title: categories.Freelance[Math.floor(Math.random() * categories.Freelance.length)],
        date: `${year}-${strMonth}-${getRandomInt(10, 20).toString().padStart(2, '0')}T14:30:00Z`,
        amount: getRandomInt(12000, 25000),
        category: 'Freelance',
        type: 'income'
      });
    }

    // 2. Core Bills
    transactions.push({
      id: `tx-${idCounter++}`,
      title: 'House Rent',
      date: `${year}-${strMonth}-03T10:00:00Z`,
      amount: 28000,
      category: 'Bills',
      type: 'expense'
    });
    transactions.push({
      id: `tx-${idCounter++}`,
      title: 'Airtel Broadband',
      date: `${year}-${strMonth}-05T10:00:00Z`,
      amount: 1180,
      category: 'Bills',
      type: 'expense'
    });
    transactions.push({
      id: `tx-${idCounter++}`,
      title: 'Electricity Bill',
      date: `${year}-${strMonth}-10T10:00:00Z`,
      amount: getRandomInt(1500, 2800),
      category: 'Bills',
      type: 'expense'
    });

    // 3. Investments
    transactions.push({
      id: `tx-${idCounter++}`,
      title: 'Zerodha Mutual Fund SIP',
      date: `${year}-${strMonth}-07T10:00:00Z`,
      amount: 20000,
      category: 'Investment',
      type: 'expense'
    });

    // 4. Variable Daily Expenses (Around 15-20 tx per month, keeps UI clean but active)
    const txCount = getRandomInt(15, 20);
    for (let i = 0; i < txCount; i++) {
      const day = getRandomInt(1, 28).toString().padStart(2, '0');
      
      const r = Math.random();
      let cat = 'Shopping';
      if (r < 0.45) cat = 'Food';
      else if (r < 0.7) cat = 'Transport';
      else if (r < 0.85) cat = 'Entertainment';
      else if (r < 0.95) cat = 'Health';

      let amount = 0;
      switch (cat) {
        case 'Food': amount = getRandomInt(200, 1200); break;
        case 'Transport': amount = getRandomInt(150, 900); break;
        case 'Entertainment': amount = getRandomInt(400, 2000); break;
        case 'Shopping': amount = getRandomInt(800, 4500); break;
        case 'Health': amount = getRandomInt(400, 2500); break;
      }

      transactions.push({
        id: `tx-${idCounter++}`,
        title: categories[cat][Math.floor(Math.random() * categories[cat].length)],
        date: `${year}-${strMonth}-${day}T${getRandomInt(8, 22).toString().padStart(2, '0')}:${getRandomInt(10, 59).toString().padStart(2, '0')}:00Z`,
        amount: amount,
        category: cat,
        type: 'expense'
      });
    }

    // Move to next month
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const mockData = generateRealisticData();
export default mockData;
