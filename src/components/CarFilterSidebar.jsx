import React, { useState } from "react";
import SelectMakePopup from "./SelectMakePopup";

export default function CarFilterSidebar() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("cash");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [powerUnit, setPowerUnit] = useState("kW");

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  // Helper: Select-like UI for inputs
  const SelectInput = ({ placeholder, ...props }) => (
    <div className="relative w-full">
      <input
        {...props}
        placeholder={placeholder}
        className="w-full border border-[#bcc6dd] rounded-lg px-4 py-2 pr-8 text-[#1c274c] bg-white focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] appearance-none transition cursor-pointer"
        readOnly
        tabIndex={0}
      />
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
        width={16}
        height={16}
        fill="none"
        viewBox="0 0 16 16"
      >
        <path d="M4 6l4 4 4-4" stroke="#1c274c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  // Helper: Toggle group for Transmission/Fuel/Power
  const ToggleGroup = ({ options, value, setValue, rounded = true, blueActive = false }) => (
    <div className={`flex w-full border border-[#bcc6dd] ${rounded ? "rounded-lg" : "rounded-md"} overflow-hidden`}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`flex-1 py-2 text-center font-medium transition
            ${value === opt.value
              ? blueActive
                ? "bg-[#3452e1] text-white"
                : "bg-[#e9ecfa] text-[#3452e1]"
              : "bg-white text-[#1c274c] hover:bg-[#f4f6fc]"}
            ${opt.className || ""}
          `}
          onClick={() => setValue(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <aside className="w-full md:w-[340px] bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-bold text-[#253887]">Filter</h4>
        <button
          type="button"
          aria-label="close"
          className="p-2 rounded hover:bg-gray-100 transition"
          onClick={handleClosePopup}
        >
          <svg width={20} height={20} fill="none" viewBox="0 0 20 20" className="text-[#253887]">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button className="flex-1 flex flex-col items-center py-2 text-[#3452e1] border-b-2 border-[#3452e1] font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 20 20" className="mb-1">
            {/* Tab All icon */}
            <circle cx={10} cy={10} r={9} stroke="currentColor" strokeWidth={1.5} />
            <circle cx={7.5} cy={5.5} r={2} stroke="currentColor" strokeWidth={1.5} />
            <circle cx={12.5} cy={14.5} r={2} stroke="currentColor" strokeWidth={1.5} />
            <path d="M3.5 10h13" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">All</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-gray-400 font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" className="mb-1">
            {/* Tab Saved icon */}
            <rect x={5} y={3} width={14} height={18} rx={2} stroke="currentColor" strokeWidth={1.5} />
            <path d="M12 3v18" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">Saved</span>
        </button>
        <button className="flex-1 flex flex-col items-center py-2 text-gray-400 font-semibold focus:outline-none">
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" className="mb-1">
            {/* Tab History icon */}
            <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.5} />
            <path d="M12 7v5l4 2" stroke="currentColor" strokeWidth={1.5} />
          </svg>
          <span className="text-sm">History</span>
        </button>
      </div>

      {/* Filter Form */}
      <form id="form-search-filter" className="flex flex-col gap-5">
        {/* Price */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#253887] font-semibold">Price (€)</span>
            {/* Payment type toggle like your Image 2 */}
            <div
              data-testid="payment_type"
              className="flex bg-[#f4f6fc] rounded-lg px-2 py-1 w-fit"
            >
              <button
                type="button"
                data-test-value="installment"
                className={`px-4 py-1 rounded-lg font-medium transition
                    ${paymentType === "installment"
                      ? "bg-[#3452e1] text-white"
                      : "text-[#222] hover:bg-[#e9ecfa]"}`
                }
                onClick={() => setPaymentType("installment")}
                aria-pressed={paymentType === "installment"}
              >
                Instalments
              </button>
              <button
                type="button"
                data-test-value="cash"
                className={`px-4 py-1 rounded-lg font-medium transition ml-1
                    ${paymentType === "cash"
                      ? "bg-[#3452e1] text-white"
                      : "text-[#222] hover:bg-[#e9ecfa]"}`
                }
                onClick={() => setPaymentType("cash")}
                aria-pressed={paymentType === "cash"}
              >
                Cash
              </button>
              <input type="hidden" name="payment-type" value={paymentType} />
            </div>
          </div>
          <br></br>
          <div className="flex gap-2 mb-2 ">
            <SelectInput placeholder="From" />
            <SelectInput placeholder="To" />
          </div>
          <br></br>
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 text-[#1c274c] text-[15px] font-medium">
              <input type="checkbox" className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]" />
              VAT deduction
            </label>
            <label className="flex items-center gap-2 text-[#1c274c] text-[15px] font-medium">
              <input type="checkbox" className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]" />
              Discounted cars
              <span className="ml-1 flex items-center">
                <svg width={18} height={18} fill="none" viewBox="0 0 18 18">
                  <circle cx={9} cy={9} r={8} stroke="#bcc6dd" strokeWidth={1.3} fill="#fff" />
                  <text x="9" y="13" textAnchor="middle" fontSize="11" fill="#bcc6dd" fontWeight="bold">i</text>
                </svg>
              </span>
            </label>
            <label className="flex items-center gap-2 text-[#1c274c] text-[15px] font-medium">
              <input type="checkbox" className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]" />
              Premium partners
              <span className="ml-1 flex items-center">
                <svg width={18} height={18} fill="none" viewBox="0 0 18 18">
                  <circle cx={9} cy={9} r={8} stroke="#bcc6dd" strokeWidth={1.3} fill="#fff" />
                  <text x="9" y="13" textAnchor="middle" fontSize="11" fill="#bcc6dd" fontWeight="bold">i</text>
                </svg>
              </span>
            </label>
          </div>
        </section>

        {/* REGISTRATION */}
        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">REGISTRATION</div>
          <div className="flex gap-2">
            <SelectInput placeholder="From" />
            <SelectInput placeholder="To" />
          </div>
        </section>

        {/* MILEAGE */}
        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">MILEAGE</div>
          <div className="flex gap-2">
            <SelectInput placeholder="From" />
            <SelectInput placeholder="To" />
          </div>
        </section>

        {/* TRANSMISSION */}
        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">TRANSMISSION</div>
          <ToggleGroup
            options={[
              { value: "automatic", label: "Automatic" },
              { value: "manual", label: "Manual" },
            ]}
            value={transmission}
            setValue={setTransmission}
          />
        </section>

        {/* FUEL */}
        <section>
          <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">FUEL</div>
          <ToggleGroup
            options={[
              { value: "diesel", label: "Diesel" },
              { value: "petrol", label: "Petrol" },
            ]}
            value={fuel}
            setValue={setFuel}
          />
        </section>

        {/* POWER */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">POWER</span>
            <span className="flex gap-1">
              <button
                type="button"
                className={`px-2 py-1 text-xs font-bold rounded transition border border-[#bcc6dd] ${
                  powerUnit === "hp" ? "bg-[#e9ecfa] text-[#1c274c]" : "bg-white text-[#3452e1]"
                }`}
                onClick={() => setPowerUnit("hp")}
              >hp</button>
              <button
                type="button"
                className={`px-2 py-1 text-xs font-bold rounded transition border border-[#bcc6dd] ${
                  powerUnit === "kW" ? "bg-[#3452e1] text-white" : "bg-white text-[#3452e1]"
                }`}
                onClick={() => setPowerUnit("kW")}
              >kW</button>
            </span>
          </div>
          <div className="flex gap-2">
            <SelectInput placeholder="From" />
            <SelectInput placeholder="To" />
          </div>
        </section>
         {/* VEHICLE TYPE */}
         <section>
        <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">VEHICLE TYPE</div>
        <div className="mb-2">
          <div className="relative w-full">
            <select
              className="w-full border border-[#bcc6dd] rounded-lg px-4 py-2 pr-8 text-[#1c274c] bg-white focus:border-[#3452e1] focus:ring-2 focus:ring-[#3452e1] appearance-none transition cursor-pointer"
              defaultValue=""
            >
              <option value="">All</option>
              <option value="SUV">SUV</option>
              <option value="Estate">Estate</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Convertible">Convertible</option>
              {/* ...other types */}
            </select>
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              width={16}
              height={16}
              fill="none"
              viewBox="0 0 16 16"
            >
              <path d="M4 6l4 4 4-4" stroke="#1c274c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]" />
          <span className="text-[#1c274c] text-[15px]">Drive type 4x4</span>
        </label>
      </section>
      {/* EXTERIOR COLOR */}
      <section>
        <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">EXTERIOR COLOR</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Màu sắc phổ biến, mỗi ô là 1 div tròn màu */}
          {[
            { color: "#000", label: "Black" },
            { color: "#fff", label: "White", border: true },
            { color: "#a7b0bd", label: "Grey" },
            { color: "#e23c3c", label: "Red" },
            { color: "#456fed", label: "Blue" },
            { color: "#bfcbe3", label: "Silver" },
            { color: "#bfa678", label: "Beige" },
            { color: "#ffb84c", label: "Yellow" },
            { color: "#ff7a00", label: "Orange" },
            { color: "#a46a44", label: "Brown" },
            { color: "#6d66e8", label: "Purple" },
            { color: "#4fb548", label: "Green" }
          ].map(({ color, label, border }) => (
            <div
              key={label}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${border ? "border-[#bcc6dd]" : "border-transparent"}`}
              style={{ background: color }}
              title={label}
              tabIndex={0}
            />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-[#e6e8f0] pt-4">
        <div className="mb-2 text-xs font-extrabold uppercase text-[#1c274c] tracking-wider">FEATURES</div>
        <div className="flex flex-col gap-2">
          {[
            "Air conditioning",
            "Cruise control",
            "Heated front seats",
            "Multifunctional steering wheel",
            "Navigation system",
            "Trailer coupling",
            "LED headlights",
            "Xenon headlights"
          ].map(feat => (
            <label key={feat} className="flex items-center gap-3 text-[#1c274c] text-[15px] font-medium cursor-pointer">
              <input type="checkbox" className="w-5 h-5 border-[#bcc6dd] rounded focus:ring-[#3452e1]" />
              {feat}
            </label>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 ml-1 text-[#3452e1] text-[15px] font-semibold hover:underline flex items-center gap-1"
        >
          More features
          <svg width={16} height={16} fill="none" viewBox="0 0 16 16">
            <path d="M7 4l4 4-4 4" stroke="#3452e1" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>
      </section>
      </form>
<div className="border-t border-[#e6e8f0] pt-6 pb-2 flex">
        <button
          type="button"
          className="w-full bg-white text-[#3452e1] font-bold rounded-lg py-3 border-2 border-[#3452e1] text-lg transition hover:bg-[#e9ecfa] focus:outline-none"
        >
          Detailed search
        </button>
      </div>
      {/* Render SelectMakePopup conditionally */}
      {isPopupOpen && <SelectMakePopup onClose={handleClosePopup} />}
    </aside>
  );
}