import { useState } from "react"
import {
  bookValueAt,
  DAYS_PER_MONTH,
  defaultScenario,
  repairDaysAt,
  validateScenario,
  type AssetScenario,
  type DepreciationMethod,
} from "../lib/depreciation"

type ScenarioForm = { [K in keyof AssetScenario]: string }

interface ScenarioField {
  key: keyof AssetScenario
  label: string
  min: number
  max: number
  step: number
  hint: string
}

const fields: ScenarioField[] = [
  {
    key: "cost",
    label: "Asset cost (₱)",
    min: 1,
    max: 10000000,
    step: 0.01,
    hint: "Purchase value",
  },
  {
    key: "salvage",
    label: "Residual value (₱)",
    min: 0,
    max: 10000000,
    step: 0.01,
    hint: "Minimum value retained",
  },
  {
    key: "lifespanMonths",
    label: "Useful life (months)",
    min: 3,
    max: 120,
    step: 1,
    hint: "3–120 months",
  },
  {
    key: "elapsedDays",
    label: "Days since procurement",
    min: 0,
    max: 3650,
    step: 1,
    hint: "Evaluation point · 0–3,650",
  },
  {
    key: "repairStartDay",
    label: "Repair begins (day)",
    min: 0,
    max: 3650,
    step: 1,
    hint: "One sample repair window",
  },
  {
    key: "repairDays",
    label: "Repair duration (days)",
    min: 0,
    max: 730,
    step: 1,
    hint: "0–730 days",
  },
]

function toForm(scenario: AssetScenario): ScenarioForm {
  return Object.fromEntries(
    Object.entries(scenario).map(([key, value]) => [key, String(value)]),
  ) as ScenarioForm
}

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
})
const formatMoney = (value: number) => currency.format(value)

interface ValueChartProps {
  scenario: AssetScenario
  method: DepreciationMethod
}

function ValueChart({ scenario, method }: ValueChartProps) {
  const horizon = Math.ceil(
    Math.max(
      scenario.elapsedDays,
      scenario.lifespanMonths * DAYS_PER_MONTH + scenario.repairDays,
    ),
  )
  const width = 720,
    height = 310,
    left = 72,
    right = 18,
    top = 22,
    bottom = 54
  const chartWidth = width - left - right,
    chartHeight = height - top - bottom
  const x = (day: number) => left + (day / horizon) * chartWidth
  const y = (value: number) => top + (1 - value / scenario.cost) * chartHeight
  const days = [
    ...new Set([
      ...Array.from({ length: 61 }, (_, i) => (horizon * i) / 60),
      scenario.elapsedDays,
      Math.min(horizon, scenario.repairStartDay),
      Math.min(horizon, scenario.repairStartDay + scenario.repairDays),
    ]),
  ].sort((a, b) => a - b)
  const path = (adjusted: boolean) =>
    days
      .map(
        (day, index) =>
          `${
            index ? "L" : "M"
          }${x(day).toFixed(2)},${y(bookValueAt(scenario, method, day, adjusted)).toFixed(2)}`,
      )
      .join(" ")
  const current = bookValueAt(scenario, method, scenario.elapsedDays)
  const baseline = bookValueAt(scenario, method, scenario.elapsedDays, false)
  const ticks = [
    ...new Set([
      0,
      ...Array.from(
        { length: Math.floor(horizon / 365) },
        (_, i) => (i + 1) * 365,
      ),
      scenario.elapsedDays,
      horizon,
    ]),
  ].sort((a, b) => a - b)

  return (
    <div className="valuation-chart">
      <div className="chart-legend">
        <span>
          <i className="chart-key-adjusted" />
          With repair adjustment
        </span>
        <span>
          <i className="chart-key-baseline" />
          Without repair adjustment
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="valuation-chart-title valuation-chart-description"
      >
        <title id="valuation-chart-title">Asset value over time</title>
        <desc id="valuation-chart-description">
          At day {scenario.elapsedDays}, the adjusted value is{" "}
          {formatMoney(current)}, compared with {formatMoney(baseline)} without
          repair adjustment. The shaded interval represents one sample repair
          window. Exact values are available in the table below.
        </desc>
        {[0, 0.5, 1].map((fraction) => (
          <g key={fraction}>
            <line
              x1={left}
              x2={width - right}
              y1={y(scenario.cost * fraction)}
              y2={y(scenario.cost * fraction)}
              className="chart-grid"
            />
            <text
              x={left - 10}
              y={y(scenario.cost * fraction) + 4}
              textAnchor="end"
            >
              {Math.round((scenario.cost * fraction) / 1000)}k
            </text>
          </g>
        ))}
        {scenario.repairDays > 0 && scenario.repairStartDay < horizon && (
          <rect
            x={x(scenario.repairStartDay)}
            y={top}
            width={
              x(
                Math.min(
                  horizon,
                  scenario.repairStartDay + scenario.repairDays,
                ),
              ) - x(scenario.repairStartDay)
            }
            height={chartHeight}
            className="chart-repair-window"
          />
        )}
        <path d={path(false)} className="chart-baseline" />
        <path d={path(true)} className="chart-adjusted" />
        <line
          x1={x(scenario.elapsedDays)}
          x2={x(scenario.elapsedDays)}
          y1={top}
          y2={height - bottom}
          className="chart-cursor"
        />
        <circle
          cx={x(scenario.elapsedDays)}
          cy={y(current)}
          r="5"
          className="chart-point"
        />
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <text
            key={fraction}
            x={x(horizon * fraction)}
            y={height - bottom + 24}
            textAnchor="middle"
          >
            {Math.round(horizon * fraction)}
          </text>
        ))}
        <text x={left + chartWidth / 2} y={height - 8} textAnchor="middle">
          Days since procurement
        </text>
        <text x={left} y={12}>
          Value (₱ thousands)
        </text>
      </svg>
      <p className="chart-caption">
        Shading marks the repair window. The blue line pauses while the asset is
        under repair.
      </p>
      <details className="valuation-table-details">
        <summary>View the values as a table</summary>
        <div className="valuation-table-wrap">
          <table>
            <caption>
              Annual checkpoints, the evaluation day, and the chart endpoint.
            </caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Repair days elapsed</th>
                <th scope="col">Adjusted value</th>
                <th scope="col">Without repairs</th>
              </tr>
            </thead>
            <tbody>
              {ticks.map((day) => (
                <tr key={day}>
                  <th scope="row">
                    {day}
                    {day === scenario.elapsedDays ? " · now" : ""}
                  </th>
                  <td>{repairDaysAt(scenario, day)}</td>
                  <td>{formatMoney(bookValueAt(scenario, method, day))}</td>
                  <td>
                    {formatMoney(bookValueAt(scenario, method, day, false))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

export default function AssetValuationDemo({ caseStudyHref = "/#project-centralog" }: { caseStudyHref?: string }) {
  const [form, setForm] = useState<ScenarioForm>(() => toForm(defaultScenario))
  const [method, setMethod] = useState<DepreciationMethod>("straight-line")
  const parse = (value: string) => (value.trim() ? Number(value) : NaN)
  const scenario: AssetScenario = {
    cost: parse(form.cost),
    salvage: parse(form.salvage),
    lifespanMonths: parse(form.lifespanMonths),
    elapsedDays: parse(form.elapsedDays),
    repairStartDay: parse(form.repairStartDay),
    repairDays: parse(form.repairDays),
  }
  const errors = validateScenario(scenario)
  const valid = errors.length === 0
  const current = valid
    ? bookValueAt(scenario, method, scenario.elapsedDays)
    : 0
  const baseline = valid
    ? bookValueAt(scenario, method, scenario.elapsedDays, false)
    : 0
  const repairDays = valid ? repairDaysAt(scenario, scenario.elapsedDays) : 0

  return (
    <div className="valuation-demo">
      <div className="valuation-demo-bar font-mono">
        <span>CENTRALOG / ASSET VALUATION</span>
        <span>SAMPLE DATA · INTERACTIVE</span>
      </div>
      <div className="valuation-demo-grid">
        <div className="valuation-controls">
          <h3>Set up a sample asset</h3>
          <p>
            Change the inputs to compare how repair downtime affects the
            calculation.
          </p>
          <fieldset className="valuation-method">
            <legend>Calculation method</legend>
            <label>
              <input
                type="radio"
                name="depreciation-method"
                value="straight-line"
                checked={method === "straight-line"}
                onChange={() => setMethod("straight-line")}
              />
              Straight-line
            </label>
            <label>
              <input
                type="radio"
                name="depreciation-method"
                value="double-declining"
                checked={method === "double-declining"}
                onChange={() => setMethod("double-declining")}
              />
              Double-declining
            </label>
          </fieldset>
          <div className="valuation-fields">
            {fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={`asset-${field.key}`}>{field.label}</label>
                <input
                  id={`asset-${field.key}`}
                  type="number"
                  inputMode={field.step === 1 ? "numeric" : "decimal"}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={form[field.key]}
                  aria-describedby={`asset-${field.key}-hint${
                    errors.length ? " valuation-errors" : ""
                  }`}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      [field.key]: event.target.value,
                    }))
                  }
                />
                <span id={`asset-${field.key}-hint`}>{field.hint}</span>
              </div>
            ))}
          </div>
          <div className="valuation-actions">
            <button
              type="button"
              onClick={() =>
                setForm((previous) => ({ ...previous, repairDays: "0" }))
              }
            >
              Try without repairs
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(toForm(defaultScenario))
                setMethod("straight-line")
              }}
            >
              Reset example
            </button>
          </div>
          {errors.length > 0 && (
            <ul id="valuation-errors" className="valuation-errors" role="alert">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="valuation-results">
          {valid ? (
            <>
              <p className="project-eyebrow font-mono">
                AT DAY {scenario.elapsedDays}
              </p>
              <div
                className="valuation-total"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <span>Calculated book value</span>
                <strong>{formatMoney(current)}</strong>
                <p>
                  {repairDays} repair days excluded ·{" "}
                  {(
                    (scenario.elapsedDays - repairDays) /
                    DAYS_PER_MONTH
                  ).toFixed(2)}{" "}
                  active months
                </p>
              </div>
              <div className="valuation-comparison">
                <div>
                  <span>Without repair adjustment</span>
                  <strong>{formatMoney(baseline)}</strong>
                </div>
                <div>
                  <span>Difference from repair time</span>
                  <strong>
                    {formatMoney(Math.max(0, current - baseline))}
                  </strong>
                </div>
              </div>
              <ValueChart scenario={scenario} method={method} />
            </>
          ) : (
            <p className="valuation-invalid">
              Complete the inputs above to see the calculated value and chart.
            </p>
          )}
        </div>
      </div>
      <div className="valuation-explanation">
        <p>
          <strong>How this example works</strong> Repair time is excluded from
          active use. The formulas use a 30.4375-day month and retain the
          residual-value floor. This browser illustration uses one repair window
          and follows CentraLog's strategy formulas.
        </p>
        <div className="font-mono">
          <a href={caseStudyHref}>Read the case study ↗</a>
          <a
            href={`https://github.com/JamesIan-Bayonas/centralog/blob/main/CentraLog.Infrastructure/Services/Depreciation/${
              method === "straight-line" ? "StraightLine" : "DoubleDeclining"
            }Strategy.cs`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View the calculation source ↗
          </a>
        </div>
      </div>
    </div>
  )
}
