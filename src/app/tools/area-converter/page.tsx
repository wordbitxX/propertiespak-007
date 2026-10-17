import { LandToolPage } from "@/components/land-tool-page";
import { AreaConverter } from "@/components/land-tools";
import { buildMetadata } from "@/lib/seo";

const DESCRIPTION =
  "Convert land area between Marla, Kanal, square feet, square yards (gaz), square meters and acres. Supports both the 225 sq ft Marla and the 272.25 sq ft Punjab Marla.";

export const metadata = buildMetadata({
  title: "Area Unit Converter — Marla, Kanal, Sq Ft, Sq Yd & Acre",
  description: DESCRIPTION,
  path: "/tools/area-converter",
  keywords: ["marla to sq ft", "kanal to marla", "area converter pakistan", "marla calculator", "sq yd to marla", "acre to kanal"],
});

const REFERENCE = [
  ["1 Marla", "225 sq ft", "25 sq yd", "20.9 sq m"],
  ["1 Marla (Punjab)", "272.25 sq ft", "30.25 sq yd", "25.3 sq m"],
  ["5 Marla", "1,125 sq ft", "125 sq yd", "104.5 sq m"],
  ["10 Marla", "2,250 sq ft", "250 sq yd", "209 sq m"],
  ["1 Kanal (20 Marla)", "5,445 sq ft", "605 sq yd", "505.9 sq m"],
  ["1 Acre (8 Kanal)", "43,560 sq ft", "4,840 sq yd", "4,046.9 sq m"],
];

const FAQS = [
  {
    question: "How many square feet are in one Marla?",
    answer:
      "Most housing societies (DHA, Bahria Town and others) use 225 sq ft per Marla. Punjab land revenue records use 272.25 sq ft per Marla. Pick the right one before you compare plots.",
  },
  {
    question: "How many Marla make one Kanal?",
    answer: "20 Marla make one Kanal, and 8 Kanal make one Acre.",
  },
  {
    question: "Is a square yard the same as a gaz?",
    answer: "Yes. In Pakistan a square yard is commonly called a gaz. One square yard equals 9 square feet.",
  },
  {
    question: "Why do plot sizes differ between societies?",
    answer:
      "Each developer can define its Marla size. Always ask for the exact plot dimensions in feet and convert them yourself before paying.",
  },
];

export default function AreaConverterPage() {
  return (
    <LandToolPage
      slug="area-converter"
      eyebrow="Area Unit Converter"
      title="Land Area Unit Converter"
      description={DESCRIPTION}
      keywords={["area converter", "marla", "kanal", "square feet", "square yard", "acre"]}
      faqs={FAQS}
      aside={
        <div>
          <h2 className="font-sans text-[1.15rem] font-semibold text-navy-900">Quick reference</h2>
          <div className="land-tool-table-wrap mt-4">
            <table className="land-tool-table">
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">Square feet</th>
                  <th scope="col">Square yards</th>
                  <th scope="col">Square meters</th>
                </tr>
              </thead>
              <tbody>
                {REFERENCE.map(([size, ...values]) => (
                  <tr key={size}>
                    <th scope="row">{size}</th>
                    {values.map((value) => (
                      <td key={value}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    >
      <AreaConverter />
    </LandToolPage>
  );
}
