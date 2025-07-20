"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";

import { MealPlanPDF } from "./mealPlanPdf";

export default function ExportMealPlanPDFButton({ itemsMenu }) {
  return (
    <PDFDownloadLink
      document={<MealPlanPDF itemsMenu={itemsMenu} />}
      fileName={`meal-plan-${Date.now()}.pdf`}
    >
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
        Export Meal Plan
      </button>
    </PDFDownloadLink>
  );
}
