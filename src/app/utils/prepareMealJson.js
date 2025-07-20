export function splitLines(str) {
  if (!str) return [];
  return str
    .split('\n')
    .map((s) => s.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

export function prepareMealJson(meal) {
  if (!meal) return null;
  return {
    title: meal?.dishName,
    ingredients: splitLines(meal?.ingredients),
    steps: splitLines(meal?.instructions),
  };
}

export const mealTypeImageLinks = {
  'breakfast': 'https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?q=80&w=776&auto=format&fit=crop',
  'lunch': 'https://images.unsplash.com/photo-1680675706515-fb3eb73116d4?q=80&w=880&auto=format&fit=crop',
  'dinner': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=687&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=687&auto=format&fit=crop',
};

export const mealTypeLabels = {
  breakfast: '🥐 Breakfast',
  lunch: '🍜 Lunch',
  dinner: '🍲 Dinner',
};
