'use client';
import React from 'react';
import { useEffect, useState } from 'react';

import { RegenerateButton } from '@/app/(app)/_components/RegenerateButton';
import { getMealPlanById } from '@/app/(internal)/(meal-plan)/create/action';
import { mealTypeImageLinks, mealTypeLabels } from '@/app/utils/prepareMealJson';

import { getMealPlanDetail } from './action';

function getMealImage(type) {
  const mealTypeImageLink = mealTypeImageLinks[type] || mealImageLinks['default'];

  return (
    <div className="rounded-md w-full h-112 lg:h-112 md:h-64 mb-2 overflow-clip">
      <img
        src={mealTypeImageLink}
        alt={`${type} meal`}
        className="w-full h-full object-cover transition-all ease-in-out duration-300 hover:scale-110"
      />
    </div>
  );
}

function renderMealSection(mealType, mealData) {
  if (!mealData?.[mealType]?.dishName) {
    return null;
  }

  return (
    <section
      key={mealType}
      className="bg-white rounded-xl shadow p-4"
    >
      <h2 className="text-lg font-semibold mb-2 text-gray-700">{mealTypeLabels[mealType]}</h2>
      <figure className="flex flex-col grow">
        {getMealImage(mealType)}
        <figcaption className="text-md text-gray-500 [font-variant:small-caps]">{mealData?.[mealType]?.dishName || 'No dish selected'}</figcaption>
      </figure>

      <hr className="my-2" />

      <div className="text-sm text-gray-500 mt-2">
        <h4 className="font-semibold">Ingredients</h4>
        <p className="list-disc list-inside">
          {mealData?.[mealType]?.ingredients}
        </p>
      </div>

      <hr className="my-2" />

      <div className="text-sm text-gray-500 mt-2">
        <h4 className="font-semibold">Steps</h4>
        <p className="list-disc list-inside">
          {mealData?.[mealType]?.instructions}
        </p>
      </div>
    </section>
  );
}

export default function DashboardClient({ initialMealData, initialPlan }) {
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  const [isLoading, setIsLoading] = useState(initialPlan.status === 'processing');
  const [mealData, setMealData] = useState(initialMealData);
  const [plan, setPlan] = useState(initialPlan);

  const checkMealPlanStatus = async () => {
    try {
      const data = await getMealPlanById(initialPlan.id);

      if (data.status !== plan.status) {
        setPlan((prev) => ({ ...prev, status: data.status }));
      }

      if (data.status === 'completed') {
        const mealData = await getMealPlanDetail(initialPlan.id);
        setMealData(mealData);
        setIsLoading(false);
        clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.error('Error checking meal plan status:', error);
    }
  };
  const intervalRef = React.useRef();

  useEffect(() => {
    if (plan.status === 'processing') {
      // Check immediately and then every 5 seconds
      checkMealPlanStatus();
      intervalRef.current = setInterval(checkMealPlanStatus, 5000);

      return () => clearInterval(intervalRef.current);
    }
  }, [plan.status]);

  const handleRegenerate = async (mealPlanId) => {
    try {
      setIsLoading(true);
      console.log('Regenerating meal plan:', mealPlanId);
      await regenerateMealPlan(mealPlanId);
    } catch (error) {
      console.error('Regeneration failed:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(plan.status === 'processing');
  }, [plan.status]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-600">{plan.title}</p>

          <p className="text-sm text-gray-500 mt-1">
            Day {plan.dayIndex} of {plan.days}
          </p>
        </div>

        <RegenerateButton
          mealPlanId={plan.id}
          onDelete={handleRegenerate}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="mt-8">
          <p className="py-10 text-center">Your meal plan is being generated...</p>
          <div className="flex animate-pulse justify-between">
            <div className="h-40 w-1/3 rounded-lg bg-gray-200"></div>
            <div className="mx-4 h-40 w-1/3 rounded-lg bg-gray-200"></div>
            <div className="h-40 w-1/3 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
            {mealTypes.map((mealType) => renderMealSection(mealType, mealData))}
          </div>
        </div>
      )}
    </>
  );
}
