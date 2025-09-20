
import { type Activities, type Emissions, type Tip } from '../types';

export const calculateCarbonFootprint = (activities: Activities): Emissions => {
  const emissions: Emissions = {
    transport: 0,
    energy: 0,
    food: 0
  };

  // Transportation calculations
  const transportMethods: { [key: string]: number } = {
    car_gas: 0.411, // kg CO2 per mile
    car_hybrid: 0.25,
    car_electric: 0.189,
    public_transit: 0.089,
    walking: 0,
    cycling: 0
  };

  const commuteMethod = activities.transport_method || 'car_gas';
  const commuteDistance = parseFloat(activities.commute_distance || '0');
  emissions.transport = (transportMethods[commuteMethod] || 0.411) * commuteDistance * 2; // Round trip

  const flights = parseInt(activities.flights_month || '0');
  emissions.transport += (flights * 500) / 30; // Average per day

  // Energy calculations
  const homeTypes: { [key: string]: number } = {
    apartment: 15, // kg CO2 per day
    small_house: 25,
    large_house: 40
  };

  const heatingTypes: { [key: string]: number } = { gas: 1.2, electric: 1.0, heat_pump: 0.7 };
  const electricityTypes: { [key: string]: number } = { grid: 1.0, some_renewable: 0.7, mostly_renewable: 0.4 };

  const homeBase = homeTypes[activities.home_type || 'small_house'];
  const heatingMultiplier = heatingTypes[activities.heating_type || 'gas'];
  const electricityMultiplier = electricityTypes[activities.electricity_source || 'grid'];
  
  emissions.energy = homeBase * heatingMultiplier * electricityMultiplier;

  // Food calculations
  const dietTypes: { [key: string]: number } = { meat_heavy: 7.2, moderate_meat: 5.6, vegetarian: 3.8, vegan: 2.9 };
  const wasteMultipliers: { [key: string]: number } = { high: 1.3, medium: 1.0, low: 0.8 };
  const mealRatios: { [key: string]: number } = { mostly_out: 1.4, half_half: 1.2, mostly_home: 1.0 };

  const dietBase = dietTypes[activities.diet_type || 'moderate_meat'];
  const wasteMultiplier = wasteMultipliers[activities.food_waste || 'medium'];
  const mealMultiplier = mealRatios[activities.meal_ratio || 'mostly_home'];
  
  emissions.food = dietBase * wasteMultiplier * mealMultiplier;

  return emissions;
};

export const generateTips = (activities: Activities, emissions: Emissions): Tip[] => {
  const tips: Tip[] = [];
  const total = emissions.transport + emissions.energy + emissions.food;
  
  if (total === 0) {
      return [
          { category: 'General', tip: 'Start by filling out your daily activities to see your footprint!', impact: 'High', difficulty: 'Easy' },
          { category: 'General', tip: 'Explore different categories to understand your environmental impact.', impact: 'Medium', difficulty: 'Easy' },
          { category: 'General', tip: 'Small changes can make a big difference over time.', impact: 'High', difficulty: 'Easy' },
      ];
  }

  if (emissions.transport > total * 0.33) {
    tips.push({
      category: 'Transport',
      tip: 'Try carpooling or using public transit once a week.',
      impact: '~4 kg CO2 reduction/day',
      difficulty: 'Easy'
    });
  }
  
  if ((activities.transport_method || 'car_gas').includes('car')) {
     tips.push({
      category: 'Transport',
      tip: 'Combine errands into one trip to reduce driving time.',
      impact: '1-3 kg CO2 reduction/trip',
      difficulty: 'Easy'
    });
  }

  if (emissions.energy > total * 0.33) {
    tips.push({
      category: 'Energy',
      tip: 'Lower your thermostat by 2°F (1°C) in winter.',
      impact: '~1.5 kg CO2 reduction/day',
      difficulty: 'Easy'
    });
  }
  
  if (activities.heating_type !== 'heat_pump') {
    tips.push({
      category: 'Energy',
      tip: 'Unplug electronics when not in use to avoid phantom power.',
      impact: '0.5-1 kg CO2 reduction/day',
      difficulty: 'Medium'
    });
  }

  if (emissions.food > total * 0.33) {
    tips.push({
      category: 'Food',
      tip: 'Incorporate one meat-free day into your week.',
      impact: '~1.8 kg CO2 reduction/day',
      difficulty: 'Medium'
    });
  }
  
  if (activities.food_waste === 'high') {
    tips.push({
      category: 'Food',
      tip: 'Plan your meals for the week to buy only what you need.',
      impact: '1-2 kg CO2 reduction/day',
      difficulty: 'Medium'
    });
  }
  
  // Add some default tips if not enough were generated
  if (tips.length < 3) {
      tips.push({ category: 'General', tip: 'Switch to LED light bulbs.', impact: 'High', difficulty: 'Easy'});
  }
  if (tips.length < 3) {
      tips.push({ category: 'General', tip: 'Use reusable bags, bottles, and containers.', impact: 'Medium', difficulty: 'Easy' });
  }

  return tips.slice(0, 3);
};
