'use client';

import { useState } from 'react';

import { mealTypeImageLinks } from '@/app/utils/prepareMealJson';
// -> Impor komponen Dialog dari shadcn/ui
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function getMealImage(type) {
  const mealTypeImageLink = mealTypeImageLinks[type] || mealTypeImageLinks['default'];

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


export default function FoodModal({ foods }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (index) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  if (!foods || foods.length === 0) {
    return <div>No food data available.</div>;
  }

  const currentFood = foods[activeIndex];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="self-center">
        {foods.map((food, i) => (
          <div key={i} onClick={() => openModal(i)}>
            <figure className="flex flex-col grow">
              {getMealImage(food.type)}
              <figcaption className="text-md text-gray-500 [font-variant:small-caps]">{food.title || 'No dish selected'}</figcaption>
            </figure>
          </div>
        ))}
      </div>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{currentFood.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 text-sm">
            <div>
              <p className="font-semibold">Bahan</p>
              <ul className="list-inside list-disc">
                {currentFood.ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-2">
              <p className="font-semibold">Cara Memasak</p>
              <ol className="list-inside list-decimal">
                {currentFood.steps.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* <DialogFooter className="flex w-full justify-between">
          <Button onClick={goPrev} disabled={activeIndex === 0} className="bg-[#4E3636] text-white">
            ←
          </Button>
          <Button onClick={goNext} disabled={activeIndex === foods.length - 1} className="bg-[#4E3636] text-white">
            →
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
