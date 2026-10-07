export const nutrientTargets = {
  calories: 2100,
  protein: 75,
  carbs: 280,
  fiber: 30,
}

export const indianFoods = {
  roti: {
    name: 'Roti',
    portion: '2 medium',
    grams: 80,
    calories: 240,
    protein: 8,
    carbs: 44,
    fiber: 6,
    vitamins: ['B1', 'Iron'],
  },
  dal: {
    name: 'Dal tadka',
    portion: '1 katori',
    grams: 180,
    calories: 198,
    protein: 12,
    carbs: 28,
    fiber: 8,
    vitamins: ['Folate', 'Iron'],
  },
  sabzi: {
    name: 'Mixed sabzi',
    portion: '1 serving',
    grams: 150,
    calories: 140,
    protein: 4,
    carbs: 16,
    fiber: 5,
    vitamins: ['A', 'C'],
  },
  rice: {
    name: 'Steamed rice',
    portion: '1 katori',
    grams: 150,
    calories: 195,
    protein: 4,
    carbs: 43,
    fiber: 1,
    vitamins: ['B6'],
  },
}

export function analyzePlate(imageDataUrl) {
  const items = [indianFoods.dal, indianFoods.roti, indianFoods.sabzi]
  const totals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fiber: acc.fiber + item.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fiber: 0 },
  )

  return {
    imageDataUrl,
    detectedAt: new Date().toISOString(),
    confidence: 0.78,
    disclaimer:
      'Estimated nutrition from detected foods, typical portions, and a nutrition database — not a lab measurement.',
    items,
    totals,
  }
}

const HISTORY_KEY = 'annamitra-meals'

export function loadMealHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveMeal(analysis) {
  const history = loadMealHistory()
  const entry = {
    id: crypto.randomUUID(),
    ...analysis,
  }
  const next = [entry, ...history].slice(0, 20)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return entry
}
