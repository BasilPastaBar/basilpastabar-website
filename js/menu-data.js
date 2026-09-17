/*
  ============================================================
  BASIL PASTA BAR — MENU DATA
  ============================================================
  This is the ONLY file you need to edit to change prices,
  descriptions, or menu items. The website reads this file
  and builds the menu automatically — no HTML editing needed.

  HOW TO CHANGE A PRICE:
    Find the item below and change the "price" number.
    Example:  price: 15.95   ->   price: 16.95

  HOW TO ADD A NEW ITEM:
    Copy an existing { ... } block inside the right category's
    "items" array, then edit the name/description/price.

  HOW TO REMOVE AN ITEM:
    Delete its whole { ... } block.

  Tags you can use on an item:
    spicy: true        -> shows a chili pepper icon
    veg: true          -> shows a "V" vegetarian icon
  ============================================================
*/

const MENU_DATA = {
  note: "Prices are for Dine-in / Takeout only. Delivery prices are slightly higher.",

  categories: [
    {
      id: "house-specials",
      name: "House Specials",
      items: [
        { name: "Spaghetti Puttanesca", spicy: true, price: 15.95,
          desc: "Spicy marinara sauce with anchovies, tomatoes, red peppers, garlic, olives & capers. Garnished with parmesan cheese, fresh basil & parsley." },
        { name: "Penne Arrabiata", spicy: true, price: 15.95,
          desc: "Spicy marinara sauce with chorizo sausage, red peppers and garlic. Garnished with goat cheese & fresh parsley." },
        { name: "Pesto Shrimp Linguine", price: 15.95,
          desc: "Pesto cream sauce with white wine, shrimp, garlic and spinach. Garnished with parmesan cheese & fresh basil." },
        { name: "Chicken Curry Fettuccine", price: 13.95,
          desc: "Curry cream sauce with chicken, red peppers, peas and spinach. Garnished with fresh oregano." },
        { name: "Spaghetti Carbonara", price: 13.95,
          desc: "Parmesan cream sauce with egg yolk, crispy smoked bacon and peas. Garnished with fresh parsley." },
        { name: "BC Smoked Salmon Fettuccine", price: 15.95,
          desc: "Alfredo cream sauce with wild smoked salmon, red onions, tomatoes, spinach & capers." },
        { name: "Lemon Chicken Fettuccine", price: 15.95,
          desc: "Alfredo cream sauce with lemon juice, chicken, zucchini & capers. Garnished with parmesan cheese & fresh basil." },
        { name: "Maple Bacon Conchiglie", price: 15.95,
          desc: "Marinara sauce with pure maple syrup, bacon, red onions, red peppers, mushrooms & corn. Garnished with mozzarella cheese & fresh basil." },
        { name: "Gnocchi Bolognese", price: 16.45,
          desc: "Marinara beef sauce with mushrooms. Garnished with parmesan cheese, fresh parsley & fresh basil." },
        { name: "Spaghetti & Meatballs", spicy: true, price: 15.95,
          desc: "Spicy rose sauce with 6 meatballs, mushrooms, tomatoes, red onions & spinach. Garnished with mozzarella cheese." }
      ]
    },
    {
      id: "vegetarian",
      name: "Vegetarian",
      items: [
        { name: "Fussily Primavera", veg: true, price: 15.95,
          desc: "Marinara sauce with broccoli, zucchini, red peppers, tomatoes, spinach and carrot strings. Garnished with parmesan cheese & fresh parsley." },
        { name: "Fresh Herbs Linguine Aioli", veg: true, price: 15.95,
          desc: "Fresh basil, parsley, oregano, garlic & red onions tossed together with white wine & olive oil. Garnished with goat cheese & fresh herbs." },
        { name: "Mediterranean Penne", veg: true, price: 15.95,
          desc: "Basil pesto sauce with artichoke hearts, asparagus, tomatoes & spinach. Garnished with goat cheese & fresh parsley." },
        { name: "Four Cheese Ravioli", veg: true, price: 16.45,
          desc: "Tomato cream sauce (rose) with spinach. Garnished with parmesan cheese & fresh basil." },
        { name: "Coconut Cream Ravioli", price: 16.45,
          desc: "Coconut cream sauce with chicken, mushrooms, asparagus, red onions & peas. Garnished with coconut flakes & fresh basil." }
      ]
    },
    {
      id: "sides-salads",
      name: "Sides & Salads",
      items: [
        { name: "Garlic Bread", price: 2.75, desc: "Oven baked to perfection." },
        { name: "Add Cheese (to Garlic Bread)", price: 1.95, desc: "" },
        { name: "Soup of the Day — Small", price: 4.45, desc: "Vegetable minestrone or green lentils." },
        { name: "Soup of the Day — Large", price: 7.45, desc: "Vegetable minestrone or green lentils." },
        { name: "Pasta Salad", price: 13.95,
          desc: "Fussily tossed with organic mixed greens, tomatoes, red peppers, mushrooms & carrot strings with house-made balsamic vinaigrette. Garnished with goat cheese." },
        { name: "Classic Caesar", price: 13.95,
          desc: "Romaine lettuce, croutons, capers & parmesan cheese." },
        { name: "House Special Greens — Small", price: 5.45,
          desc: "Organic mixed greens, tomatoes, red peppers, pumpkin seeds & carrot strings, tossed with house-made balsamic vinaigrette. Garnished with goat cheese." },
        { name: "House Special Greens — Large", price: 9.95,
          desc: "Organic mixed greens, tomatoes, red peppers, pumpkin seeds & carrot strings, tossed with house-made balsamic vinaigrette. Garnished with goat cheese." },
        { name: "Bread / Soup / Salad Combo Add-on", price: 5.50,
          desc: "Add any side plus a drink with the purchase of any pasta." }
      ]
    },
    {
      id: "desserts",
      name: "Desserts",
      items: [
        { name: "Tiramisu Cake", price: 6.95,
          desc: "This Italian classic is generously infused with dark roast espresso coffee between layers of creamy mascarpone mousse, blended with rich coffee liqueur and covered with fluffy whipped cream." },
        { name: "Lemon Cream Cake", price: 6.95,
          desc: "Three scrumptious layers of exquisitely moist shortcake decorated with our own dairy-fresh whipped cream and tangy lemon preserve." },
        { name: "Ben & Jerry's Ice Cream", price: 8.95,
          desc: "Half Baked, The Tonight Dough, or Chocolate Chip Cookie Dough." }
      ]
    },
    {
      id: "drinks",
      name: "Drinks",
      items: [
        { name: "Soft Drinks (Can)", price: 2.75,
          desc: "Coke, Diet Coke, Iced Tea, Ginger Ale, 7UP, Root Beer, Orange Crush, Grape Crush, Cream Soda Crush, Bottled Water." }
      ]
    }
  ],

  // "Build Your Own Pasta" section — separate from the priced menu above.
  buildYourOwn: {
    startingPrice: 13.95,
    priceNote: "+ GST · Gnocchi, Ravioli, Whole Wheat Penne & Gluten Free Penne add 50¢",
    steps: [
      {
        step: 1,
        title: "Pick your pasta",
        options: ["Penne", "Whole Wheat Penne", "Gluten Free Penne", "Linguine", "Ravioli", "Gnocchi", "Farfalle", "Conchiglie", "Spaghetti", "Fusilli", "Fettuccine"]
      },
      {
        step: 2,
        title: "Pick your sauce",
        options: ["Marinara", "Alfredo", "Pesto", "Rose", "Bolognese", "Curry Cream", "Pesto Cream", "Carbonara", "White Wine & Olive Oil"],
        note: "Like it spicy? Just ask!"
      },
      {
        step: 3,
        title: "Pick your protein",
        options: ["Bacon", "Chorizo Sausage", "Chicken", "Shrimp", "Anchovies", "Smoked Salmon", "Meatballs (3 pcs) +$1.95", "Double Meat +$1.95"]
      },
      {
        step: 4,
        title: "Pick your veggies",
        options: ["Tomatoes", "Carrots", "Black Olives", "Corn", "Spinach", "Zucchini", "Peas", "Red Peppers", "Mushrooms", "Red Onions", "Asparagus", "Artichokes", "Garlic", "Broccoli", "Capers"]
      },
      {
        step: 5,
        title: "Pick your garnish",
        options: ["Parmesan +$1.95", "Goat Cheese +$1.95", "Mozzarella +$1.95", "Double Cheese +$1.95", "Basil", "Parsley", "Oregano"]
      }
    ]
  },

  deliveryPlatforms: [
    { name: "Uber Eats", url: "https://www.ubereats.com/ca/vancouver/food-delivery/basil-pasta-bar-davie-%26-seymour/eK3XxNn4SQKK74tO7Si1Ew" },
    { name: "SkipTheDishes", url: "https://www.skipthedishes.com/basil-pasta-bar-davie-vancouver" },
    { name: "DoorDash", url: "https://www.doordash.com/store/basil-pasta-bar-vancouver-30968/en-CA" },
    { name: "Food.ee (Teams & Groups)", url: "https://www.food.ee/restaurants/vancouver/basil-pasta-bar/" }
  ],

  restaurant: {
    name: "Basil Pasta Bar",
    established: "Est. Vancouver, BC 2010",
    tagline: "Vancouver's first and finest build-your-own-pasta restaurant.",
    address: "636 Davie Street, Vancouver, BC",
    phone: "+1 (604) 568-3106",
    phoneDisplay: "1 (604) 568-3106",
    hours: [
      { days: "Sunday – Thursday", time: "11:30 AM – 11:00 PM" },
      { days: "Friday & Saturday", time: "11:30 AM – 2:00 AM" }
    ],
    social: {
      facebook: "https://www.facebook.com/BasilPastaBar",
      twitter: "https://twitter.com/basilpastabar",
      instagram: "https://www.instagram.com/basilpastabar/?hl=en"
    }
  }
};
