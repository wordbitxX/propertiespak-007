import { LandToolPage } from "@/components/land-tool-page";
import { PlotSizeCalculator } from "@/components/land-tools";
import { buildMetadata } from "@/lib/seo";

const DESCRIPTION =
  "Enter a plot's length and width to get its size in Marla, Kanal, square feet and square yards — then add the market rate to estimate the plot's value.";

export const metadata = buildMetadata({
  title: "Plot Size & Price Calculator — Marla, Kanal & Plot Value",
  description: DESCRIPTION,
  path: "/tools/plot-size-calculator",
  keywords: ["plot size calculator", "plot area calculator pakistan", "marla size in feet", "plot price calculator", "kanal plot size"],
});

const FAQS = [
  {
    question: "How do I calculate the size of my plot?",
    answer:
      "Multiply length by width in feet to get square feet, then divide by 225 for Marla (or 272.25 for Punjab Marla) and by 5,445 for Kanal. The calculator does this for you in every unit.",
  },
  {
    question: "What are the standard dimensions of a 5 Marla and 10 Marla plot?",
    answer:
      "A 5 Marla plot is commonly 25 × 45 ft (1,125 sq ft) and a 10 Marla plot is 35 × 65 or 45 × 50 ft (about 2,250 sq ft). Corner and irregular plots can differ.",
  },
  {
    question: "How is the plot value estimated?",
    answer:
      "The total area is converted into the unit of your rate (for example per Marla or per square yard) and multiplied by the rate you enter.",
  },
  {
    question: "Does the value include taxes and transfer fees?",
    answer:
      "No. Add FBR withholding taxes, stamp duty and the society transfer fee separately — try our property tax calculator for an estimate.",
  },
];

export default function PlotSizeCalculatorPage() {
  return (
    <LandToolPage
      slug="plot-size-calculator"
      eyebrow="Plot Size & Price Calculator"
      title="Plot Size & Price Calculator"
      description={DESCRIPTION}
      keywords={["plot size calculator", "plot price", "marla", "kanal"]}
      faqs={FAQS}
    >
      <PlotSizeCalculator />
    </LandToolPage>
  );
}
