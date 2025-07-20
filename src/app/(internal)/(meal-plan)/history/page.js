import Link from 'next/link';

import DashboardEmpty from '@/app/(app)/_components/emptyMealPlan';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { getMealPlanHistory } from './action';

function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
};

function renderMealPlanCard(plan) {
  return (
    <Link
      key={plan.id}
      href={`/menu/${plan.id}`}
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border border-gray-100"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{plan.title}</h2>
      <p className="text-sm text-gray-500 mb-3">
        {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
      </p>

      <div className="text-sm space-y-1 text-gray-700 grid grid-cols-[100px_1fr]">
        <span className="font-semibold">Duration</span>
        <span>{plan.days} day(s)</span>

        <span className="font-semibold">Budget</span>
        <span>Rp {parseInt(plan.budget).toLocaleString('id-ID')}</span>

        <span className="font-semibold">Cuisine</span>
        <span>{plan.cuisineCategories}</span>

        {!!plan.allergies && (
          <>
            <span className="font-semibold">Allergies</span>
            <span>{plan.allergies}</span>
          </>
        )}
      </div>
    </Link>
  );
}

export default async function HistoryPage({ searchParams = {} }) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  const { items: mealPlanHist, total } = await getMealPlanHistory({
    page,
    pageSize,
  });
  if (mealPlanHist === 0) {
    return <DashboardEmpty></DashboardEmpty>;
  }
  console.log('Meal Plan History', mealPlanHist);
  const totalPages = Math.ceil(total / pageSize);



  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">My meal plan</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {mealPlanHist.map((plan) => renderMealPlanCard(plan))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?page=${page > 1 ? page - 1 : 1}`} />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink href={`?page=${i + 1}`} isActive={i + 1 === page}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={`?page=${page < totalPages ? page + 1 : totalPages}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
