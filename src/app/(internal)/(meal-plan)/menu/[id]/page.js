import ExportMealPlanPDFButton from '@/app/_components/pdf/ExportMealPlanPDFButton';
import { mealTypeLabels, prepareMealJson } from '@/app/utils/prepareMealJson';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import FoodModal from '../foodModal';
import { getMealPlanHistoryDetail } from './action';

export default async function HistMenuDetail({ params }) {
  const { id } = await params;
  const itemsMenu = await getMealPlanHistoryDetail(id);

  if (!itemsMenu?.length) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">No meal details found.</p>
      </div>
    );
  }

  const dayData = itemsMenu.map((d) => {
    const breakfast = prepareMealJson(d.breakfast);
    const lunch = prepareMealJson(d.lunch);
    const dinner = prepareMealJson(d.dinner);

    const cards = [
      { label: 'Breakfast', food: breakfast },
      { label: 'Lunch', food: lunch },
      { label: 'Dinner', food: dinner },
    ].filter((c) => c.food);

    return {
      value: `day-${d.day}`,
      label: `Day ${d.day}`,
      cards,
    };
  });

  const defaultValue = dayData[0]?.value ?? 'day-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Meal plan details</h1>
        </div>

        <ExportMealPlanPDFButton itemsMenu={itemsMenu} />
      </div>

      <Tabs defaultValue={defaultValue}>
        <TabsList>
          {dayData.map((d) => (
            <TabsTrigger
              key={d.value}
              value={d.value}
              className="px-5 cursor-pointer"
            >
              {d.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {dayData.map((d) => (
          <TabsContent key={d.value} value={d.value} className="grid grid-cols-3 gap-4">
            {d.cards.map((c) => (
              <section
                key={c.label}
                className="bg-white rounded-xl shadow p-4 cursor-pointer"
              >
                <h2 className="text-lg font-semibold mb-2 text-gray-700">{mealTypeLabels[c.label.toLowerCase()]}</h2>
                <FoodModal foods={[c.food]} />
              </section>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
