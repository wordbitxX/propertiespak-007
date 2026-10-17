import { LandToolPage } from "@/components/land-tool-page";
import { IslamicFinancingCalculator } from "@/components/land-tools";
import { buildMetadata } from "@/lib/seo";

const DESCRIPTION =
  "Plan a Shariah-compliant home purchase with Diminishing Musharakah. See your monthly installment, total rent and a year-by-year schedule of how your ownership grows to 100%.";

export const metadata = buildMetadata({
  title: "Islamic Home Financing Calculator — Diminishing Musharakah",
  description: DESCRIPTION,
  path: "/tools/islamic-financing-calculator",
  keywords: [
    "islamic home financing calculator",
    "diminishing musharakah calculator",
    "meezan easy home calculator",
    "islamic mortgage pakistan",
    "shariah compliant home loan",
  ],
});

const STEPS = [
  {
    title: "1. Joint ownership",
    copy: "You and the bank buy the home together. Your down payment is your share; the bank owns the rest.",
  },
  {
    title: "2. Rent on the bank’s share",
    copy: "You live in the home and pay rent only on the part the bank still owns. As its share shrinks, so does the rent.",
  },
  {
    title: "3. Buy the bank out",
    copy: "Each installment also buys a slice of the bank’s share until you own 100% of the property.",
  },
];

const FAQS = [
  {
    question: "How is Diminishing Musharakah different from a conventional mortgage?",
    answer:
      "Instead of a loan with interest, you and the bank co-own the property. You pay rent on the bank’s share and gradually buy that share, so the bank earns rent rather than interest.",
  },
  {
    question: "Why does my monthly payment stay the same if the rent falls?",
    answer:
      "Banks usually fix a level installment. As the rent portion falls each month, a larger part of the same installment goes towards buying the bank’s share.",
  },
  {
    question: "Is the rent rate fixed for the whole tenure?",
    answer:
      "Usually not. Most Islamic banks in Pakistan link the rent rate to KIBOR and revise it periodically, so the installment can change.",
  },
  {
    question: "What other costs should I budget for?",
    answer:
      "Processing fees, valuation and legal charges, takaful (Islamic insurance) and property taxes are extra. Ask your bank for a complete cost sheet.",
  },
];

export default function IslamicFinancingCalculatorPage() {
  return (
    <LandToolPage
      slug="islamic-financing-calculator"
      eyebrow="Islamic Home Financing"
      title="Islamic Home Financing Calculator"
      description={DESCRIPTION}
      keywords={["islamic home financing", "diminishing musharakah", "shariah compliant mortgage"]}
      faqs={FAQS}
      aside={
        <div>
          <h2 className="font-sans text-[1.15rem] font-semibold text-navy-900">How Diminishing Musharakah works</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="rounded-panel border border-soft bg-white p-5 shadow-soft">
                <p className="font-sans text-[0.98rem] font-semibold text-forest-800">{step.title}</p>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <IslamicFinancingCalculator />
    </LandToolPage>
  );
}
