"use client";

import { useId, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";

/* -------------------------------------------------------------------------- */
/* Shared units                                                                */
/* -------------------------------------------------------------------------- */

export type AreaUnit = "sqft" | "sqyd" | "sqm" | "marla" | "marlaPunjab" | "kanal" | "acre";

/** Square feet in one unit. Kanal and acre use the official land-record values. */
export const SQFT_PER_UNIT: Record<AreaUnit, number> = {
  sqft: 1,
  sqyd: 9,
  sqm: 10.7639104,
  marla: 225,
  marlaPunjab: 272.25,
  kanal: 5445,
  acre: 43560,
};

const UNIT_LABEL: Record<AreaUnit, string> = {
  sqft: "Square Feet",
  sqyd: "Square Yards (Gaz)",
  sqm: "Square Meters",
  marla: "Marla (225 sq ft · Default)",
  marlaPunjab: "Marla (272.25 sq ft · Punjab)",
  kanal: "Kanal",
  acre: "Acre",
};

const UNIT_SHORT: Record<AreaUnit, string> = {
  sqft: "Sq Ft",
  sqyd: "Sq Yd",
  sqm: "Sq M",
  marla: "Marla",
  marlaPunjab: "Marla (Punjab)",
  kanal: "Kanal",
  acre: "Acre",
};

const UNIT_ORDER: AreaUnit[] = ["sqft", "sqyd", "sqm", "marla", "marlaPunjab", "kanal", "acre"];

function formatAmount(value: number) {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const digits = abs === 0 ? 0 : abs >= 1000 ? 2 : abs >= 1 ? 4 : 8;
  return value.toLocaleString("en-PK", { maximumFractionDigits: digits });
}

function toNumber(raw: string) {
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function NumberInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  step = "any",
  suffix,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  min?: number;
  step?: number | "any";
  suffix?: string;
  hint?: string;
}) {
  return (
    <div className="land-tool-field">
      <label htmlFor={id}>{label}</label>
      <div className="land-tool-input">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix && <span>{suffix}</span>}
      </div>
      {hint && <p className="land-tool-hint">{hint}</p>}
    </div>
  );
}

function UnitCards({ sqft, highlight }: { sqft: number; highlight?: AreaUnit }) {
  return (
    <ul className="land-tool-units" aria-live="polite">
      {UNIT_ORDER.map((unit) => (
        <li key={unit} data-active={highlight === unit}>
          <span>{UNIT_SHORT[unit]}</span>
          <strong>{formatAmount(sqft / SQFT_PER_UNIT[unit])}</strong>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. Area unit converter                                                      */
/* -------------------------------------------------------------------------- */

export function AreaConverter() {
  const id = useId();
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState<AreaUnit>("marla");
  const sqft = toNumber(amount) * SQFT_PER_UNIT[unit];

  return (
    <div className="land-tool" data-testid="area-converter">
      <div className="land-tool-panel">
        <h2 className="land-tool-heading">Convert an area</h2>
        <div className="land-tool-grid-2 mt-5">
          <NumberInput id={`${id}-amount`} label="Amount" value={amount} onChange={setAmount} />
          <div className="land-tool-field">
            <label htmlFor={`${id}-unit`}>Unit to convert from</label>
            <select id={`${id}-unit`} value={unit} onChange={(event) => setUnit(event.target.value as AreaUnit)}>
              {UNIT_ORDER.map((option) => (
                <option key={option} value={option}>
                  {UNIT_LABEL[option]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="land-tool-quick" role="group" aria-label="Common sizes">
          {[
            { label: "5 Marla", amount: "5", unit: "marla" as AreaUnit },
            { label: "10 Marla", amount: "10", unit: "marla" as AreaUnit },
            { label: "1 Kanal", amount: "1", unit: "kanal" as AreaUnit },
            { label: "500 Sq Yd", amount: "500", unit: "sqyd" as AreaUnit },
            { label: "1 Acre", amount: "1", unit: "acre" as AreaUnit },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setAmount(preset.amount);
                setUnit(preset.unit);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="land-tool-panel">
        <h2 className="land-tool-heading">Converted values</h2>
        <UnitCards sqft={sqft} highlight={unit} />
        <p className="land-tool-hint mt-4">
          The highlighted card is your input unit. “Marla” uses 225 sq ft; use “Marla (Punjab)” for the 272.25 sq ft
          land-record standard. 20 Marla = 1 Kanal and 8 Kanal = 1 Acre.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Plot size & price calculator                                             */
/* -------------------------------------------------------------------------- */

type LengthUnit = "ft" | "yd" | "m";
const FEET_PER: Record<LengthUnit, number> = { ft: 1, yd: 3, m: 3.2808399 };
type RateUnit = "marla" | "marlaPunjab" | "kanal" | "sqyd" | "sqft";
const RATE_LABEL: Record<RateUnit, string> = {
  marla: "Marla (225)",
  marlaPunjab: "Marla (Punjab)",
  kanal: "Kanal",
  sqyd: "Square Yard",
  sqft: "Square Foot",
};

const PLOT_PRESETS = [
  { label: "3 Marla", length: "27", width: "25" },
  { label: "5 Marla", length: "45", width: "25" },
  { label: "7 Marla", length: "45", width: "35" },
  { label: "10 Marla", length: "50", width: "45" },
  { label: "1 Kanal", length: "90", width: "50" },
  { label: "2 Kanal", length: "120", width: "75" },
];

export function PlotSizeCalculator() {
  const id = useId();
  const [length, setLength] = useState("90");
  const [width, setWidth] = useState("50");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("ft");
  const [rate, setRate] = useState("");
  const [rateUnit, setRateUnit] = useState<RateUnit>("marla");

  const sqft = toNumber(length) * FEET_PER[lengthUnit] * toNumber(width) * FEET_PER[lengthUnit];
  const rateValue = toNumber(rate);
  const value = rateValue > 0 ? (sqft / SQFT_PER_UNIT[rateUnit]) * rateValue : 0;

  return (
    <div className="land-tool" data-testid="plot-size-calculator">
      <div className="land-tool-panel">
        <h2 className="land-tool-heading">Plot dimensions</h2>
        <div className="land-tool-grid-2 mt-5">
          <NumberInput id={`${id}-length`} label="Length" value={length} onChange={setLength} />
          <NumberInput id={`${id}-width`} label="Width" value={width} onChange={setWidth} />
        </div>
        <div className="land-tool-field mt-4">
          <span className="land-tool-label">Dimensions are in</span>
          <div className="land-tool-segment" role="radiogroup" aria-label="Dimension unit">
            {(["ft", "yd", "m"] as LengthUnit[]).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={lengthUnit === option}
                onClick={() => setLengthUnit(option)}
              >
                {option === "ft" ? "Feet" : option === "yd" ? "Yards (Gaz)" : "Meters"}
              </button>
            ))}
          </div>
        </div>
        <div className="land-tool-quick" role="group" aria-label="Common plot sizes">
          {PLOT_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setLength(preset.length);
                setWidth(preset.width);
                setLengthUnit("ft");
              }}
            >
              {preset.label}
              <small>
                {preset.width} × {preset.length} ft
              </small>
            </button>
          ))}
        </div>

        <h2 className="land-tool-heading mt-8">Estimate the price (optional)</h2>
        <p className="land-tool-hint">Enter the going market rate and we’ll value the plot.</p>
        <div className="land-tool-grid-2 mt-4">
          <NumberInput id={`${id}-rate`} label="Rate (PKR)" value={rate} onChange={setRate} step={1000} hint="e.g. 1500000 per Marla" />
          <div className="land-tool-field">
            <label htmlFor={`${id}-rate-unit`}>Per</label>
            <select id={`${id}-rate-unit`} value={rateUnit} onChange={(event) => setRateUnit(event.target.value as RateUnit)}>
              {(Object.keys(RATE_LABEL) as RateUnit[]).map((option) => (
                <option key={option} value={option}>
                  {RATE_LABEL[option]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="land-tool-panel">
        <div className="land-tool-result">
          <p>Total area</p>
          <strong data-testid="plot-total-area">{formatAmount(sqft / SQFT_PER_UNIT.marla)} Marla</strong>
          <span>
            {formatAmount(sqft / SQFT_PER_UNIT.kanal)} Kanal · {formatAmount(sqft)} sq ft · {formatAmount(sqft / SQFT_PER_UNIT.sqyd)} sq yd
          </span>
        </div>
        <div className="land-tool-result land-tool-result--soft mt-3">
          <p>Estimated value</p>
          <strong>{value > 0 ? formatPrice(Math.round(value)) : "—"}</strong>
          <span>{value > 0 ? `Rs ${Math.round(value).toLocaleString("en-PK")}` : "Add a market rate to estimate the value"}</span>
        </div>
        <h3 className="land-tool-subheading">Area in every unit</h3>
        <UnitCards sqft={sqft} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Islamic home financing (Diminishing Musharakah)                          */
/* -------------------------------------------------------------------------- */

interface ScheduleRow {
  year: number;
  rent: number;
  ownershipBought: number;
  bankShareLeft: number;
  ownedPct: number;
}

export function islamicFinancingPlan(price: number, downPct: number, years: number, ratePct: number) {
  const financed = Math.max(0, price * (1 - downPct / 100));
  const months = Math.max(1, Math.round(years * 12));
  const r = ratePct / 100 / 12;
  const monthly = r === 0 ? financed / months : (financed * r) / (1 - Math.pow(1 + r, -months));
  const rows: ScheduleRow[] = [];
  let balance = financed;
  let yearRent = 0;
  let yearPrincipal = 0;
  for (let month = 1; month <= months; month += 1) {
    const rent = balance * r;
    const principal = Math.min(balance, monthly - rent);
    balance = Math.max(0, balance - principal);
    yearRent += rent;
    yearPrincipal += principal;
    if (month % 12 === 0 || month === months) {
      rows.push({
        year: Math.ceil(month / 12),
        rent: yearRent,
        ownershipBought: yearPrincipal,
        bankShareLeft: balance,
        ownedPct: price > 0 ? ((price - balance) / price) * 100 : 0,
      });
      yearRent = 0;
      yearPrincipal = 0;
    }
  }
  const totalPaid = monthly * months;
  return { financed, monthly, months, totalRent: Math.max(0, totalPaid - financed), totalPaid, rows };
}

export function IslamicFinancingCalculator() {
  const id = useId();
  const [price, setPrice] = useState("20000000");
  const [downPct, setDownPct] = useState("20");
  const [years, setYears] = useState("15");
  const [rate, setRate] = useState("20");

  const priceValue = toNumber(price);
  const downValue = Math.min(95, toNumber(downPct));
  const plan = useMemo(
    () => islamicFinancingPlan(priceValue, downValue, Math.min(30, Math.max(1, toNumber(years))), Math.min(60, toNumber(rate))),
    [priceValue, downValue, years, rate],
  );
  const principalShare = plan.totalPaid > 0 ? (plan.financed / plan.totalPaid) * 100 : 0;

  return (
    <div className="land-tool" data-testid="islamic-financing-calculator">
      <div className="land-tool-panel">
        <h2 className="land-tool-heading">Your details</h2>
        <div className="mt-5 space-y-4">
          <NumberInput
            id={`${id}-price`}
            label="Property price (PKR)"
            value={price}
            onChange={setPrice}
            step={100000}
            hint={priceValue > 0 ? formatPrice(priceValue) : undefined}
          />
          <div>
            <NumberInput id={`${id}-down`} label="Your down payment (equity)" value={downPct} onChange={setDownPct} suffix="%" step={1} />
            <div className="land-tool-quick mt-2" role="group" aria-label="Down payment presets">
              {["20", "30", "40", "50"].map((preset) => (
                <button key={preset} type="button" aria-pressed={downPct === preset} onClick={() => setDownPct(preset)}>
                  {preset}%
                </button>
              ))}
            </div>
            <p className="land-tool-hint">
              You pay {formatPrice(Math.round((priceValue * downValue) / 100))} upfront · bank finances {formatPrice(Math.round(plan.financed))}
            </p>
          </div>
          <div className="land-tool-grid-2">
            <NumberInput id={`${id}-years`} label="Financing tenure (years)" value={years} onChange={setYears} step={1} />
            <NumberInput id={`${id}-rate`} label="Expected rent rate (% / year)" value={rate} onChange={setRate} suffix="%" step={0.25} />
          </div>
        </div>
      </div>

      <div className="land-tool-panel">
        <div className="land-tool-result">
          <p>Monthly installment</p>
          <strong data-testid="islamic-monthly">Rs {Math.round(plan.monthly).toLocaleString("en-PK")}</strong>
          <span>per month for {plan.months} months</span>
        </div>
        <dl className="land-tool-summary">
          <div>
            <dt>Bank’s financed share</dt>
            <dd>{formatPrice(Math.round(plan.financed))}</dd>
          </div>
          <div>
            <dt>Total rent (profit) paid</dt>
            <dd>{formatPrice(Math.round(plan.totalRent))}</dd>
          </div>
          <div>
            <dt>Total you’ll pay the bank</dt>
            <dd>{formatPrice(Math.round(plan.totalPaid))}</dd>
          </div>
        </dl>
        <div className="land-tool-split" aria-hidden="true">
          <span style={{ width: `${principalShare}%` }} />
        </div>
        <p className="land-tool-legend">
          <span className="is-principal">Ownership (principal)</span>
          <span className="is-profit">Rent (profit)</span>
        </p>
      </div>

      <div className="land-tool-panel land-tool-panel--wide">
        <h2 className="land-tool-heading">Year-by-year ownership schedule</h2>
        <div className="land-tool-table-wrap">
          <table className="land-tool-table">
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Rent paid</th>
                <th scope="col">Ownership bought</th>
                <th scope="col">Bank share left</th>
                <th scope="col">You own</th>
              </tr>
            </thead>
            <tbody>
              {plan.rows.map((row) => (
                <tr key={row.year}>
                  <th scope="row">Year {row.year}</th>
                  <td>{Math.round(row.rent).toLocaleString("en-PK")}</td>
                  <td>{Math.round(row.ownershipBought).toLocaleString("en-PK")}</td>
                  <td>{Math.round(row.bankShareLeft).toLocaleString("en-PK")}</td>
                  <td>{Math.round(row.ownedPct)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="land-tool-hint mt-3">
          Estimate for planning only. It excludes processing fees, takaful and any change in a floating rent rate. Confirm
          the exact figures with your Islamic bank.
        </p>
      </div>
    </div>
  );
}
