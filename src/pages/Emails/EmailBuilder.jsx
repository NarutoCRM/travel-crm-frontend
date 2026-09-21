import { useEffect, useMemo, useState } from "react";
import { apiPost } from "../../api/client.js";
import { getLeadsApi } from "../../api/lead.api.js";

const AIRLINES = [
  ["Emirates", "#D71920"],
  ["Qatar Airways", "#5C0632"],
  ["Etihad Airways", "#BD8B13"],
  ["Turkish Airlines", "#C70A0C"],
  ["British Airways", "#1D4F91"],
  ["Virgin Atlantic", "#D6001C"],
  ["Lufthansa", "#05164D"],
  ["Air France", "#002157"],
  ["KLM", "#0091DA"],
  ["Iberia", "#C8102E"],
  ["TAP Air Portugal", "#00805B"],
  ["Swiss", "#E2001A"],
  ["Austrian Airlines", "#D40F14"],
  ["Brussels Airlines", "#E2001A"],
  ["SAS", "#003D87"],
  ["Finnair", "#0B1560"],
  ["Aer Lingus", "#00847C"],
  ["LOT", "#123B73"],
  ["ITA Airways", "#005B96"],
  ["Icelandair", "#003B71"],
  ["Aegean", "#003B70"],
  ["Singapore Airlines", "#1B2A5B"],
  ["Cathay Pacific", "#006564"],
  ["Qantas", "#E40000"],
  ["ANA", "#13448F"],
  ["Japan Airlines", "#C8102E"],
  ["Korean Air", "#00256C"],
  ["Thai Airways", "#5A277E"],
  ["Malaysia Airlines", "#16528C"],
  ["EVA Air", "#007A53"],
  ["United Airlines", "#002244"],
  ["Delta Air Lines", "#003366"],
  ["American Airlines", "#0078D2"],
  ["Alaska Airlines", "#01426A"],
  ["JetBlue", "#003876"],
  ["Southwest", "#304CB2"],
  ["Air Canada", "#D82B2F"],
  ["WestJet", "#00A3E0"],
  ["Aeromexico", "#003D7C"],
  ["LATAM", "#211466"],
  ["Avianca", "#DA291C"],
  ["Copa Airlines", "#005DAA"],
  ["Air India", "#D71920"],
  ["IndiGo", "#1D3F94"],
  ["Vistara", "#5A2D82"],
  ["SpiceJet", "#C8102E"],
  ["Saudia", "#006C35"],
  ["flydubai", "#E65C2F"],
  ["Gulf Air", "#D5A928"],
  ["Oman Air", "#B38B59"],
  ["Air Arabia", "#E31837"],
  ["Ethiopian", "#2E7D32"],
  ["EgyptAir", "#002F6C"],
  ["Royal Air Maroc", "#B01E36"],
  ["South African Airways", "#005DAA"],

  ["Carnival Cruise Line", "#D71920"],
  ["Royal Caribbean", "#003B70"],
  ["Norwegian Cruise Line", "#003B70"],
  ["MSC Cruises", "#003B70"],
  ["Princess Cruises", "#7A1F5B"],
  ["Celebrity Cruises", "#222222"],
  ["Holland America", "#003B70"],
  ["Disney Cruise Line", "#111111"],
  ["Costa Cruises", "#0072CE"],
  ["Virgin Voyages", "#D6001C"],
];

const HEADER_TYPES = [
  ["new_booking", "New Booking"],
  ["new_miles", "New Booking with Miles"],
  ["changes", "Changes"],
  ["seat_selection", "Seat Selection"],
  ["pet_cabin", "Pet-In-Cabin"],
  ["name_correction", "Name Correction"],
  ["dob_correction", "DOB Correction"],
  ["unmr", "UNMR Reservation"],
  ["ticket_reissue", "Ticket Re-Issuance"],
  ["cancel_credit", "Cancellation with Credit"],
  ["cancel_refund", "Cancellation with Refund"],
  ["cancel_miles_refund", "Cancellation with Miles & Refund"],
  ["cancel_reissue", "Cancel & Re-Issue"],
  ["cancel_rebook", "Cancel & Re-Book"],
  ["other", "Other (write manually)"],
];

const CARD_TYPES = [
  "Visa",
  "Mastercard",
  "Amex",
  "Discover",
  "Diners",
  "RuPay",
  "Other",
];

const CURRENCIES = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  CAD: "C$",
  AUD: "A$",
  SGD: "S$",
  SAR: "﷼",
  THB: "฿",
};

const DEFAULT_GREETING = `Dear {pax},

As discussed and agreed, we have prepared your itinerary as outlined below.

Please review all itinerary details carefully, including the passenger information, flight details, dates, times, and total price. Once you have reviewed the information and are completely satisfied with the itinerary and price, simply click the “I Authorize” button at the bottom of this email to confirm your authorization.`;

const DEFAULT_TERMS = `Booking Acknowledgement

By confirming your booking, you agree that you've read, understood, and accepted these terms.


Changes & Cancellations

Your booking may be changed or refunded, subject to the applicable fare and airline policy.
Where a refund is permitted, penalties and service fees may apply.
Once the booked services have been provided, no disputes or claims will be accepted.
Minor name corrections for genuine typing errors may be permitted, subject to Fare rules and applicable fees.

Travel Documents

You are responsible for having valid visas and travel documents. We are not liable for denied entry or boarding.

Refunds on Agency/Third-Party Bookings

Refunds go to the issuing agency. Contact them directly. No chargebacks will be accepted by our agency.

Disputes

If you have any questions or disputes, please contact us directly. We are committed to resolving issues promptly and efficiently. Please note, we do not entertain disputes filed directly through your bank.

Promotions

We may contact you for promotional or advertising purposes.

Declaration

If our agency is required to take legal action to enforce these Terms and Conditions, you agree to cover all related legal fees, litigation costs, and any other remedies entitled by law. By confirming this booking, you acknowledge that the travel dates and times are accurate, your name matches your government-issued ID or passport, and you are aware of all applicable fare rules and conditions. You also agree to reconfirm your flight at least 72 hours prior to departure.

Customer Support

Our customer support team is available to assist you with any questions or concerns regarding your booking. We are committed to providing timely responses to ensure your travel experience is smooth.

Itinerary Changes

Should your itinerary change, please contact us immediately. While we will do our best to accommodate any changes, additional fees may apply based on airline policies.

Force Majeure

Reservations Desk is not liable for any failure to perform our obligations under these terms due to circumstances beyond our control, including but not limited to natural disasters, war, terrorism, or changes in government regulations.

Promotional Communications

By booking with us, you consent to receive promotional materials and communications from Reservations Desk. You may opt out at any time by contacting us directly.

Refund Processing Time

Refunds will be processed only after we receive the approved amount from the airline. Please note that this may take up to 12-16 weeks in accordance with airline policies.

Communication Regarding Refunds

We will keep you informed throughout the refund process. Once we receive confirmation from the airline, we will notify you immediately and initiate the refund to your original payment method.

Non-Refundable Fees

Certain fees, such as service fees and processing charges, may be non-refundable regardless of the airline's refund policy.

Policy Changes

Airline policies regarding refunds and processing times are subject to change. We recommend checking with us or the airline for the most current information if your travel plans are affected.

Dispute Resolution for Refunds

If there are any discrepancies regarding your refund or if you do not receive it within the expected time frame, please contact us directly.

Final Confirmation

By proceeding with this booking, you confirm that all details regarding dates and times are accurate, your name is correct as it appears on your passport, you are aware of all fare rules and conditions, and you will reconfirm your flights 72 hours prior to departure.`;

const emptyDraft = () => ({
  airline: "",
  airlineColor: "#5C0632",
  customAirlineColor: false,
  bannerImage: "",

  bookingNo: "",
  subjectTpl: "{airline} | {service} | {booking}",

  headerType: "new_booking",
  headerLabel: "New Booking",
  headerLine: "",

  greeting: DEFAULT_GREETING,

  passengers: [{ name: "", dob: "" }],
  paxEmail: "",

  itineraryText: "",
  itineraryImages: [],

  merchants: [{ name: "", amount: "", breakdown: "" }],
  currency: "USD",

  cardName: "",
  cardNumber: "",
  cardLast4: "",
  cardType: "Visa",
  cardExpiry: "",
  billingAddress: "",
  paymentLink: "",

  terms: DEFAULT_TERMS,

  employeeName: "",
  employeePhone: "+1 (877) 341-1026",
  tncEmail: "airlinesupport@reservationssupports.com",

  creditAmount: "",
  cancelFee: "",
  refundAmount: "",
  refundMethod: "Original Payment Method",
  refundTimeline: "",

  newBookingNo: "",

  milesUsed: "",
  milesDollars: "",
  milesRefunded: "",

  seatMap: [],

  petName: "",
  petBreed: "",
  petWeight: "",
  petAge: "",
  petPayMethod: "",
  petPayAmount: "",
});

const headerMessage = (type, draft) => {
  const total = draft.merchants.reduce(
    (sum, m) => sum + Number(m.amount || 0),
    0,
  );

  const money = `${CURRENCIES[draft.currency] || "$"}${total.toFixed(2)}`;

  switch (type) {
    case "refund":
      return `Your refund request has been processed as requested. The applicable refund amount is ${money}.`;

    case "name_correction":
      return "The passenger name has been corrected as requested.";

    case "dob_correction":
      return "The date of birth has been corrected as requested.";

    case "new_booking_miles":
      return `Your new booking has been confirmed using the applicable miles and payment details.`;

    case "seat_selection":
      return "Your seat selection has been confirmed as requested: ____.";

    case "unmr":
      return "An Unaccompanied Minor (UNMR) reservation has been arranged as requested. Our team will coordinate the required assistance throughout the minor’s journey.";

    case "ticket_reissue":
      return "Your ticket has been re-issued as requested. Please review the updated details below.";

    case "pet_in_cabin":
      if (draft.petPayMethod === "Online Payment") {
        return "Your pet-in-cabin request has been arranged as requested. The pet-in-cabin fee has been collected via online payment.";
      }

      if (draft.petPayMethod === "Pay at desk") {
        return "Your pet-in-cabin request has been arranged as requested. A pet-in-cabin fee is payable at the airport check-in desk.";
      }

      return "Your pet-in-cabin request has been arranged as requested.";

    case "cancellation":
      return "Your cancellation request has been processed as requested.";

    default:
      return "";
  }
};

const primaryPassenger = (draft) =>
  draft.passengers.find((p) => p.name.trim())?.name || "Passenger";

const replacePlaceholders = (text, draft) => {
  const total = draft.merchants.reduce(
    (sum, m) => sum + Number(m.amount || 0),
    0,
  );

  return String(text || "")
    .replaceAll("{pax}", primaryPassenger(draft))
    .replaceAll("{agency}", "Reservations Desk")
    .replaceAll("{airline}", draft.airline || "Airline")
    .replaceAll(
      "{amount}",
      `${CURRENCIES[draft.currency] || "$"}${total.toFixed(2)}`,
    )
    .replaceAll("{last4}", draft.cardLast4 || "____");
};

const makeSubject = (draft) =>
  replacePlaceholders(
    draft.subjectTpl || "{airline} | {service} | {booking}",
    draft,
  )
    .replaceAll("{service}", draft.headerLabel || "Booking")
    .replaceAll("{booking}", draft.bookingNo || "")
    .trim();

const formatPhone = (value) => value.replace(/\D/g, "").slice(0, 10);

const imageToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });

const formatCardExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const buildEmailHtml = (draft, acceptanceUrl = "#") => {
  const greeting = replacePlaceholders(draft.greeting, draft);
  const terms = replacePlaceholders(draft.terms, draft);
  const message = replacePlaceholders(draft.headerLine, draft);

  const merchantRows = draft.merchants
    .filter((m) => m.name || m.amount)
    .map((m) => {
      const amount = `${CURRENCIES[draft.currency] || "$"}${Number(
        m.amount || 0,
      ).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;

      return {
        name: m.name || "Merchant",
        amount,
        breakdown: String(m.breakdown || "").trim(),
      };
    });

  const passengers = draft.passengers
    .filter((p) => p.name)
    .map(
      (p) =>
        `<tr><td style="padding:7px 0;font:13px Arial">${escapeHtml(
          p.name,
        )}</td><td style="padding:7px 0;font:13px Arial;text-align:right">${
          p.dob || "____"
        }</td></tr>`,
    )
    .join("");

  const total = draft.merchants.reduce(
    (sum, m) => sum + Number(m.amount || 0),
    0,
  );

  const paymentLinkHtml = draft.paymentLink?.trim()
    ? `
        <h3 style="
            margin-top:18px;
            font:700 14px Arial, Helvetica, sans-serif;
            color:#172033;
            border-bottom:2.5px solid #b67b2e;
            padding-bottom:8px;
            text-transform:uppercase;
            margin-bottom:12px;
        ">
            Secure Payment Link
        </h3>

        <table
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse:collapse;margin-bottom:18px;"
        >
            <tr>
                <td
                    align="center"
                    style="padding:18px 12px;background:#f8fafc;border:1px solid #e5e7eb;"
                >
                    <p style="
                        margin:0 0 14px 0;
                        font:14px/1.6 Arial, Helvetica, sans-serif;
                        color:#263248;
                    ">
                        Please use the secure link below to complete your payment.
                    </p>

                    <a
                        href="${escapeHtml(draft.paymentLink.trim())}"
                        target="_blank"
                        style="
                            display:inline-block;
                            padding:12px 24px;
                            background:#172033;
                            color:#ffffff;
                            text-decoration:none;
                            font:700 14px Arial, Helvetica, sans-serif;
                            border-radius:6px;
                        "
                    >
                        Make Secure Payment
                    </a>
                </td>
            </tr>
        </table>
    `
    : "";

  const currencySymbol = CURRENCIES[draft.currency] || "$";

  const paymentSentence =
    merchantRows.length > 0
      ? `There will be ${merchantRows.length} charge${
          merchantRows.length > 1 ? "s" : ""
        } on your card ending ${draft.cardLast4 || "____"}, from ${merchantRows
          .map(
            (m) =>
              `${m.name} (${m.amount}${
                m.breakdown ? ` — ${m.breakdown}` : ""
              })`,
          )
          .join(", ")}.`
      : `There will be charges on your card ending ${
          draft.cardLast4 || "____"
        }.`;

  const snips = draft.itineraryImages
    .map(
      (img) =>
        `<img src="${img}" alt="Itinerary" style="width:100%;display:block;margin:10px 0;border-radius:8px">`,
    )
    .join("");

  return `
<!doctype html>
<html>
<body style="margin:0;background:#f4f6f8;padding:24px">
<div style="max-width:760px;margin:auto;background:#fff;border:1px solid #e2e5e9;border-radius:14px;overflow:hidden">

  ${
    draft.bannerImage
      ? `<div style="text-align:center;padding:14px;background:#fff">
          <img src="${draft.bannerImage}" alt="Banner" style="max-width:100%;max-height:150px;object-fit:contain">
         </div>`
      : ""
  }

  <div style="padding:24px 28px;border-bottom:1px solid #eee">
    <div 
    id="booking-header"
    style="
        background-color:${draft.airlineColor || "#16233D"};
        padding:28px 30px;
        border-radius:15px 15px 0 0;
        font-family:Arial,Helvetica,sans-serif;
        color:#ffffff;
        "
    >
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
    <tr>
      
      <!-- LEFT: NEW BOOKING + AIRLINE -->
      <td width="70%" valign="top" style="width:70%;vertical-align:top;">
        
        <div style="
          color:#ffffff;
          font-size:12px;
          font-weight:700;
          letter-spacing:3px;
          line-height:1.2;
          margin-bottom:8px;
        ">
          ${escapeHtml(draft.headerLabel || "NEW BOOKING_______")}
        </div>

        <div style="
          color:#ffffff;
          font-size:30px;
          font-weight:700;
          line-height:1.1;
        ">
          ${escapeHtml(draft.airline)}
        </div>

      </td>

      <!-- RIGHT: BOOKING REF + NUMBER -->
      <td width="30%" valign="top" align="right" style="width:30%;vertical-align:top;text-align:right;">
        
        <div style="
          color:#ffffff;
          font-size:10px;
          font-weight:700;
          letter-spacing:1.5px;
          line-height:1.2;
          margin-bottom:12px;
        ">
          BOOKING REF
        </div>

        <div style="
          color:#ffffff;
          font-size:16px;
          font-weight:700;
          line-height:1.2;
        ">
          ${escapeHtml(draft.bookingNo)}
        </div>

      </td>

    </tr>
  </table>

</div>

  </div>

  <div style="padding:5px 50px">

    ${paragraphHtml(greeting)}

    ${
      message
        ? `<div style="font:14px Arial;color:#263248;line-height:1.65;margin:15px 0">${paragraphHtml(
            message,
          )}</div>`
        : ""
    }

    <h3 style="
    font:700 14px Arial;
    color:#172033;
    border-bottom:2.5px solid #b67b2e;
    padding-bottom:8px;
    text-transform: uppercase;
    margin-bottom: 12px;
    ">
      Passenger(s)
    </h3>

    <table width="100%" cellspacing="0">
      <thead>
        <tr style="text-transform:uppercase">
          <th align="left" style="font:12px Arial;color:#777">Name</th>
          <th align="right" style="font:12px Arial;color:#777">Date of birth</th>
        </tr>
      </thead>
      <tbody>${passengers}</tbody>
    </table>

    <h3 style="
    margin-top:12px;
    font:700 14px Arial;
    color:#172033;
    border-bottom:2.5px solid #b67b2e;
    padding-bottom:8px;
    text-transform: uppercase;
    margin-bottom: 12px;
    ">
      Your Trip
    </h3>

    

    ${snips}

    <h3 style="
    margin-top:12px;
    font:700 14px Arial;
    color:#172033;
    border-bottom:2.5px solid #b67b2e;
    padding-bottom:8px;
    text-transform:uppercase;
    margin-bottom:12px;
">
    Payment
</h3>

<div style="
    font:14px/1.65 Arial, Helvetica, sans-serif;
    color:#263248;
    margin-bottom:18px;
">
    ${escapeHtml(paymentSentence)}
</div>

<table width="100%" cellspacing="0" style="border-collapse:collapse">
    <tfoot>
        <tr>
            <td style="
                padding:12px 8px;
                font:700 14px Arial;
                border-top:1px solid #e5e7eb;
            ">
                Total amount to be charged
            </td>

            <td style="
                padding:12px 8px;
                font:700 14px Arial;
                text-align:right;
                border-top:1px solid #e5e7eb;
            ">
                ${currencySymbol}${total.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
            </td>
        </tr>
    </tfoot>
</table>
    
${paymentLinkHtml}


    

    <h3 style="
        margin-top:12px;
        font:700 14px Arial;
        color:#172033;
        border-bottom:2.5px solid #b67b2e;
        padding-bottom:8px;
        text-transform: uppercase;
        margin-bottom: 12px;
    ">
    Card to be Charged
    </h3>

<div style="
    box-sizing:border-box;
    width:100%;
    padding:18px 22px 20px 22px;
    background:#f7f8fb;
    border:2px solid #e1e6ef;
    border-radius:17px;
    font-family:Arial, Helvetica, sans-serif;
    color:#30394b;
">

    <!-- Cardholder -->
    <div style="
        margin-bottom:20px;
    ">
        <div style="
            margin-bottom:7px;
            font:700 10px Arial, Helvetica, sans-serif;
            letter-spacing:1px;
            color:#8b96ab;
            text-transform:uppercase;
        ">
            Name on Card
        </div>

        <div style="
            font:400 15px Arial, Helvetica, sans-serif;
            line-height:1;
            color:#30394b;
        ">
            ${escapeHtml(draft.cardName || "____")}
        </div>
    </div>


    <!-- Card Details -->
    <!-- Card Details -->
<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="width:100%;border-collapse:collapse;margin:0 0 25px 0;"
>
  <tr>

    <!-- Card Type -->
    <td
      width="33.33%"
      valign="top"
      style="
        width:33.33%;
        padding:0 20px 0 0;
        vertical-align:top;
      "
    >
      <div style="
        margin-bottom:7px;
        color:#8b96ab;
        font-family:Arial,Helvetica,sans-serif;
        font-size:10px;
        font-weight:700;
        letter-spacing:1.4px;
        text-transform:uppercase;
      ">
        Card Type
      </div>

      <div style="
        color:#30394b;
        font-family:Arial,Helvetica,sans-serif;
        font-size:15px;
        line-height:1.2;
      ">
        ${escapeHtml(draft.cardType || "____")}
      </div>
    </td>


    <!-- Card Number -->
    <td
      width="33.33%"
      valign="top"
      style="
        width:33.33%;
        padding:0 20px;
        vertical-align:top;
      "
    >
      <div style="
        margin-bottom:7px;
        color:#8b96ab;
        font-family:Arial,Helvetica,sans-serif;
        font-size:10px;
        font-weight:700;
        letter-spacing:1.4px;
        text-transform:uppercase;
      ">
        Card Number
      </div>

      <div style="
        color:#30394b;
        font-family:Arial,Helvetica,sans-serif;
        font-size:15px;
        line-height:1.2;
      ">
        ${escapeHtml(draft.cardLast4 || "____")}
      </div>
    </td>


    <!-- Expiry -->
    <td
      width="33.33%"
      valign="top"
      style="
        width:33.33%;
        padding:0 0 0 20px;
        vertical-align:top;
      "
    >
      <div style="
        margin-bottom:7px;
        color:#8b96ab;
        font-family:Arial,Helvetica,sans-serif;
        font-size:10px;
        font-weight:700;
        letter-spacing:1.4px;
        text-transform:uppercase;
      ">
        Expiry
      </div>

      <div style="
        color:#30394b;
        font-family:Arial,Helvetica,sans-serif;
        font-size:15px;
        line-height:1.2;
      ">
        ${escapeHtml(draft.cardExpiry || "____")}
      </div>
    </td>

  </tr>
</table>

    <!-- Billing Address -->
    <div>
        <div style="
            
            font:700 10px Arial, Helvetica, sans-serif;
            letter-spacing:1px;
            color:#8b96ab;
            text-transform:uppercase;
        ">
            Billing Address
        </div>

        <div style="
            font:400 15px Arial, Helvetica, sans-serif;
            line-height:1.2;
            color:#30394b;
        ">
            ${escapeHtml(draft.billingAddress || "____")}
        </div>
    </div>

</div>

    <h3 style="
    margin-top:12px;
    font:700 14px Arial;
    color:#172033;
    border-bottom:2.5px solid #b67b2e;
    padding-bottom:8px;
    text-transform: uppercase;
    margin-bottom: 12px;
    ">
      Terms & Conditions
    </h3>

    <div style="max-height:260px;
    overflow:auto;
    border:1px solid #e5e7eb;
    border-radius:8px;
    padding:14px;
    background-color:#F7F6F1
    ">
      ${termsToEmailHtml(terms)}
    </div>

    <div style="
    margin-top:22px;
    padding:18px;
    background:#f7f8fa;
    border-radius:10px;
    background-color:#c4eed0;
    ">
    <div style="
      color:#0f5223;
      text-align:center;
      font:700 13px Arial;
      margin-bottom:8px
      ">
        Authorization
      </div>

      <div style="font:13px Arial;
      color:#4b5563;
      line-height:1.6
      ">
        By replying with “I Authorize” you confirm that you are the cardholder named above, that the details shown are correct, and that you authorize to charge your card for the services described.
      </div>

      <div style="text-align:center;margin-top:18px">
        <a href="${acceptanceUrl}"
           style="
           display:inline-block;
           background:${draft.airlineColor || "#16233D"};
           color:#fff;
           text-decoration:none;
           padding:12px 25px;
           border-radius:7px;
           font:700 13px Arial
           ">
          I Authorize
        </a>
      </div>
    </div>

    <div style="margin-top:30px;border-top:1px solid #eee;padding-top:18px">
      <div style="font:700 13px Arial;color:#172033">
        ${escapeHtml(draft.employeeName || "Employee")}
      </div>
      <div style="font:13px Arial;color:#555;margin-top:3px">
        Reservations Desk
      </div>
      ${
        draft.tncEmail
          ? `<div style="font:13px Arial;color:#555;margin-top:3px">
        Email: ${escapeHtml(draft.tncEmail)}
      </div>`
          : ""
      }

${
  draft.employeePhone
    ? `<div style="font:13px Arial;color:#555;margin-top:3px">
        Callback No: ${escapeHtml(draft.employeePhone)}
      </div>`
    : ""
}
    </div>

  </div>
</div>
</body>
</html>`;
};

const paragraphHtml = (text) =>
  String(text || "")
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 12px;font:14px/1.65 Arial;color:#2a3244">${escapeHtml(
          p,
        ).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

const termsToEmailHtml = (text) =>
  String(text || "")
    .split("\n")
    .map((line) => {
      if (!line.trim()) return "";

      const heading =
        line.length < 46 &&
        !/[.!?:]$/.test(line.trim()) &&
        line.trim().split(/\s+/).length <= 6;

      return heading
        ? `<div style="font:700 12px Arial;color:#172033;margin:13px 0 5px">${escapeHtml(
            line,
          )}</div>`
        : `<div style="font:11.5px/1.55 Arial;color:#4b5563;margin-bottom:5px">${escapeHtml(
            line,
          )}</div>`;
    })
    .join("");

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const Field = ({ label, required, children, hint }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";

const Section = ({ number, title, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
        {number}
      </div>
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
    </div>
    <div className="space-y-5 p-5">{children}</div>
  </section>
);

export default function EmailBuilder() {
  const [draft, setDraft] = useState(emptyDraft);
  const [airlineSearch, setAirlineSearch] = useState("");
  const [activeTab, setActiveTab] = useState("draft");
  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [sending, setSending] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

  useEffect(() => {
    getLeadsApi()
      .then((res) => setLeads(res?.data || []))
      .catch(() => {});
  }, []);

  const filteredAirlines = useMemo(() => {
    const q = airlineSearch.trim().toLowerCase();

    if (!q) return AIRLINES;

    return AIRLINES.filter(
      ([name]) =>
        name
          .toLowerCase()
          .split(/\s+/)
          .some((word) => word.includes(q)) || name.toLowerCase().includes(q),
    );
  }, [airlineSearch]);

  const update = (key, value) => {
    if (key === "cardExpiry") {
      setDraft((old) => ({
        ...old,
        [key]: value.replace(/\D/g, "").slice(0, 4),
      }));

      return;
    }
    setDraft((old) => ({ ...old, [key]: value }));
  };
  const showToast = (type, text) => {
    setToast({ type, text });

    window.setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const clearFieldError = (field) => {
    setFieldErrors((old) => {
      if (!old[field]) return old;

      const next = { ...old };
      delete next[field];
      return next;
    });
  };
  const selectAirline = (name, color) => {
    setDraft((old) => ({
      ...old,
      airline: name,
      airlineColor: color,
      customAirlineColor: false,
    }));
    setAirlineSearch("");
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, "").slice(0, 16);
  };
  const formatUSPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 3) {
      return digits.length ? `(${digits}` : "";
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };
  const getHeaderMessage = (type, draft) => {
    const symbol = CURRENCIES[draft.currency] || "$";

    const amount = (value) =>
      value !== undefined && value !== null && String(value).trim() !== ""
        ? `${symbol}${Number(value).toFixed(2)}`
        : "____";

    switch (type) {
      case "new_miles":
        return `This booking has been made using ${
          draft.milesUsed || "____"
        } miles.`;

      case "changes":
        return "As per your request, your flight has been changed. Please review your updated itinerary below.";

      case "seat_selection": {
        const passengers = draft.passengers || [];
        const seats = passengers
          .map((passenger, index) =>
            passenger?.name?.trim() ? draft.seatMap?.[index] || "____" : null,
          )
          .filter(Boolean);

        return `Your seat selection has been confirmed as requested: ${
          seats.length ? seats.join(", ") : "____"
        }.`;
      }

      case "pet_cabin":
        if (draft.petPayMethod === "Online Payment") {
          return "Your pet-in-cabin request has been arranged as requested. The pet-in-cabin fee has been collected via online payment.";
        }

        if (draft.petPayMethod === "Pay at desk") {
          return "Your pet-in-cabin request has been arranged as requested. A pet-in-cabin fee is payable at the airport check-in desk.";
        }

        return "Your pet-in-cabin request has been arranged as requested.";

      case "name_correction":
        return "The passenger name has been corrected as requested.";

      case "dob_correction":
        return "The date of birth has been corrected as requested.";

      case "unmr":
        return "An Unaccompanied Minor (UNMR) reservation has been arranged as requested. Our team will coordinate the required assistance throughout the minor’s journey.";

      case "ticket_reissue":
        return "Your ticket has been re-issued as requested. Please review the updated details below.";

      case "cancel_credit":
        return `As requested, your flight has been cancelled. A credit of ${amount(
          draft.creditAmount,
        )} is being issued${
          draft.cancelFee
            ? ` (a cancellation fee of ${amount(
                draft.cancelFee,
              )} has been deducted and is non-refundable)`
            : ""
        }.`;

      case "cancel_refund":
        return `As requested, your flight has been cancelled. A refund of ${amount(
          draft.refundAmount,
        )} is being processed to your Original Payment Method${
          draft.cancelFee
            ? ` (a cancellation fee of ${amount(
                draft.cancelFee,
              )} has been deducted and is non-refundable)`
            : ""
        }${draft.refundTimeline ? `, within ${draft.refundTimeline}` : ""}.`;

      case "cancel_miles_refund":
        return `As requested, your booking has been cancelled. ${
          draft.milesRefunded || "____"
        } miles have been refunded to your miles account${
          draft.refundAmount
            ? ` and a refund of ${amount(
                draft.refundAmount,
              )} is being processed to your Original Payment Method`
            : ""
        }${
          draft.cancelFee
            ? ` (a cancellation fee of ${amount(
                draft.cancelFee,
              )} has been deducted and is non-refundable)`
            : ""
        }${draft.refundTimeline ? `, within ${draft.refundTimeline}` : ""}.`;

      case "cancel_reissue":
        return `Your booking ${draft.bookingNo || "____"} has been cancelled and re-issued.${
          draft.refundAmount
            ? ` A refund of ${amount(
                draft.refundAmount,
              )} is being processed to your Original Payment Method${
                draft.refundTimeline ? ` within ${draft.refundTimeline}` : ""
              }.`
            : ""
        }`;

      case "cancel_rebook":
        return `Your booking ${draft.bookingNo || "____"} has been cancelled and a new booking ${
          draft.newBookingNo || "____"
        } has been created.${
          draft.refundAmount
            ? ` A refund of ${amount(
                draft.refundAmount,
              )} is being processed to your Original Payment Method${
                draft.refundTimeline ? ` within ${draft.refundTimeline}` : ""
              }.`
            : ""
        }`;

      case "other":
        return draft.headerLine || "";

      default:
        return "";
    }
  };

  const validateHeaderFields = () => {
    const errors = {};
    const type = draft.headerType;

    switch (type) {
      case "new_miles":
        if (!String(draft.milesUsed || "").trim()) {
          errors.milesUsed = "Miles used is required.";
        }
        break;

      case "seat_selection": {
        const passengers = draft.passengers || [];

        passengers.forEach((passenger, index) => {
          if (
            passenger?.name?.trim() &&
            !String(draft.seatMap?.[index] || "").trim()
          ) {
            errors[`seat-${index}`] =
              `Seat is required for passenger ${index + 1}.`;
          }
        });
        break;
      }

      case "pet_cabin":
        if (!String(draft.petName || "").trim()) {
          errors.petName = "Pet name is required.";
        }
        if (!String(draft.petBreed || "").trim()) {
          errors.petBreed = "Breed is required.";
        }
        if (!String(draft.petWeight || "").trim()) {
          errors.petWeight = "Weight is required.";
        }
        if (!String(draft.petAge || "").trim()) {
          errors.petAge = "Age is required.";
        }
        break;

      case "cancel_credit":
        if (!String(draft.creditAmount || "").trim()) {
          errors.creditAmount = "Credit amount is required.";
        }
        break;

      case "cancel_refund":
      case "cancel_miles_refund":
      case "cancel_reissue":
        if (!String(draft.refundTimeline || "").trim()) {
          errors.refundTimeline = "Processing timeline is required.";
        }
        break;

      case "cancel_rebook":
        if (!String(draft.newBookingNo || "").trim()) {
          errors.newBookingNo = "New booking number is required.";
        }
        if (!String(draft.refundTimeline || "").trim()) {
          errors.refundTimeline = "Processing timeline is required.";
        }
        break;

      case "other":
        if (!String(draft.headerLabel || "").trim()) {
          errors.headerLabel = "Banner label is required.";
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const updateHeaderField = (key, value) => {
    setDraft((old) => {
      const previousAutoMessage = getHeaderMessage(old.headerType, old);
      const shouldUpdateMessage = old.headerLine === previousAutoMessage;

      const next = { ...old, [key]: value };

      if (shouldUpdateMessage && old.headerType !== "other") {
        next.headerLine = getHeaderMessage(old.headerType, next);
      }

      return next;
    });

    clearFieldError(key);
  };

  const changeHeaderType = (type) => {
    const selected = HEADER_TYPES.find(([id]) => id === type);
    const label = selected?.[1] || "New Booking";

    setFieldErrors({});
    setError("");

    setDraft((old) => ({
      ...old,
      headerType: type,
      headerLabel: label,
      headerLine: getHeaderMessage(type, {
        ...old,
        headerType: type,
        headerLabel: label,
      }),
    }));
  };

  const addPassenger = () => {
    setDraft((old) => ({
      ...old,
      passengers: [...old.passengers, { name: "", dob: "" }],
    }));
  };

  const removePassenger = (index) => {
    setDraft((old) => ({
      ...old,
      passengers:
        old.passengers.length === 1
          ? old.passengers
          : old.passengers.filter((_, i) => i !== index),
    }));
  };

  const updatePassenger = (index, key, value) => {
    setDraft((old) => ({
      ...old,
      passengers: old.passengers.map((p, i) =>
        i === index ? { ...p, [key]: value } : p,
      ),
    }));
  };

  const addMerchant = () => {
    setDraft((old) => ({
      ...old,
      merchants: [...old.merchants, { name: "", amount: "", breakdown: "" }],
    }));
  };

  const removeMerchant = (index) => {
    setDraft((old) => ({
      ...old,
      merchants:
        old.merchants.length === 1
          ? old.merchants
          : old.merchants.filter((_, i) => i !== index),
    }));
  };

  const updateMerchant = (index, key, value) => {
    setDraft((old) => ({
      ...old,
      merchants: old.merchants.map((m, i) =>
        i === index ? { ...m, [key]: value } : m,
      ),
    }));
  };

  const total = draft.merchants.reduce(
    (sum, merchant) => sum + Number(merchant.amount || 0),
    0,
  );

  const handleBanner = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const data = await imageToDataUrl(file);

    setDraft((old) => ({
      ...old,
      bannerImage: data,
    }));
  };

  const handleItineraryImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (draft.itineraryImages.length >= 6) {
      setError("Maximum 6 itinerary screenshots allowed.");
      return;
    }

    const data = await imageToDataUrl(file);

    setDraft((old) => ({
      ...old,
      itineraryImages: [...old.itineraryImages, data],
    }));
  };

  const handlePasteImage = async (event, type) => {
    const items = event.clipboardData?.items || [];

    for (const item of items) {
      if (!item.type.startsWith("image/")) continue;

      const file = item.getAsFile();
      if (!file) return;

      if (type === "banner") {
        await handleBanner(file);
      } else {
        await handleItineraryImage(file);
      }

      event.preventDefault();
      return;
    }
  };
  const htmlBody = buildEmailHtml(draft, "{{ACCEPTANCE_URL}}");

  const sendEmail = async () => {
    console.log("[EmailBuilder] SEND EMAIL CLICKED");

    setError("");
    setMessage("");

    if (sending) return;

    setFieldErrors({});

    const headerErrors = validateHeaderFields();

    if (Object.keys(headerErrors).length > 0) {
      setFieldErrors(headerErrors);
      const firstError = Object.values(headerErrors)[0];
      setError(firstError);
      showToast("error", firstError);
      return;
    }

    const firstPassenger = draft.passengers.find((p) => p.name?.trim());

    if (!draft.airline.trim()) {
      setFieldErrors((old) => ({
        ...old,
        airline: "Airline / Cruise line is required.",
      }));

      showToast("error", "Please fill all required fields.");
      return;
    }

    if (!draft.bookingNo.trim()) {
      setFieldErrors((old) => ({
        ...old,
        bookingNo: "Booking number / PNR is required.",
      }));

      showToast("error", "Please fill all required fields.");
      return;
    }

    if (!firstPassenger) {
      setFieldErrors((old) => ({
        ...old,
        passenger: "At least one passenger name is required.",
      }));

      showToast("error", "Please add at least one passenger.");
      return;
    }

    if (!draft.paxEmail.trim()) {
      setFieldErrors((old) => ({
        ...old,
        paxEmail: "Passenger email is required.",
      }));

      showToast("error", "Passenger email is required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(draft.paxEmail.trim())) {
      setError("Enter a valid passenger email.");
      showToast("error", "Enter a valid passenger email.");
      return;
    }

    if (!draft.employeeName.trim()) {
      setError("Employee name is required.");
      showToast("error", "Employee name is required.");
      return;
    }

    const phone = formatPhone(draft.employeePhone);

    if (phone.length !== 10) {
      setError("Toll-free number must be a full 10-digit US number.");
      showToast("error", "Toll-free number must be a full 10-digit US number.");
      return;
    }

    if (!draft.cardName.trim()) {
      setFieldErrors((old) => ({
        ...old,
        cardName: "Name on card is required.",
      }));

      showToast("error", "Cardholder name is required.");
      return;
    }

    if (!draft.cardNumber.trim()) {
      setFieldErrors((old) => ({
        ...old,
        cardNumber: "Card last 4 digits are required.",
      }));

      showToast("error", "Card number is required.");
      return;
    }

    if (!draft.cardExpiry.trim()) {
      setFieldErrors((old) => ({
        ...old,
        cardExpiry: "Card expiry is required.",
      }));

      showToast("error", "Card expiry is required.");
      return;
    }

    const cleanPan = draft.cardNumber.replace(/\D/g, "");

    if (cleanPan.length < 4 || cleanPan.length > 19) {
      setError("Enter a valid card number.");
      showToast("error", "Enter a valid card number.");
      return;
    }
    const payload = {
      leadId: null,

      subject: makeSubject(draft),

      htmlBody: buildEmailHtml(draft, "{{ACCEPTANCE_URL}}"),

      draft: {
        ...draft,
        cardNumber: undefined,
        cardLast4: cleanPan,
        employeePhone: phone,
      },

      recipientEmail: draft.paxEmail,

      cardLast4: cleanPan,
    };

    console.log("[EmailBuilder] Sending payload:", {
      ...payload,
      draft: {
        ...payload.draft,
        cardNumber: undefined,
      },
    });

    try {
      setSending(true);

      const result = await apiPost("/emails/send", payload);

      console.log("[EmailBuilder] API response:", result);

      setMessage(
        result?.message ||
          "Email sent successfully. Waiting for customer authorization.",
      );
      showToast(
        "success",
        "Email sent successfully. Waiting for customer authorization.",
      );
      setDraft((old) => ({
        ...old,
        cardNumber: "",
        cardLast4: cleanPan,
      }));

      // Refresh leads after successful send
      try {
        const leadResult = await getLeadsApi();
        setLeads(leadResult?.data || []);
      } catch {
        // Ignore refresh failure
      }
    } catch (err) {
      console.error("[EmailBuilder] SEND ERROR:", err);

      setError(err?.message || "Failed to send email.");
      showToast(err?.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  if (activeTab !== "draft") {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Authorization Desk
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {activeTab === "saved" ? "Saved Emails" : "Settings"}
              </h1>
            </div>

            <button
              onClick={() => setActiveTab("draft")}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Draft Email
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            {activeTab === "saved"
              ? "Saved email management can be connected to the backend next."
              : "Agency settings can be connected here."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[100] max-w-sm rounded-xl border px-4 py-3 shadow-xl ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 text-sm font-semibold">{toast.text}</div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-current opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-[1500px]">
        {/* TOP */}
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Authorization Desk
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              Reservations Desk
            </h1>
          </div>

          <div className="flex gap-2">
            {["draft", "saved", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${
                  activeTab === tab
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab === "draft" ? "Draft email" : tab}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_500px]">
          {/* LEFT BUILDER */}
          <div className="space-y-5">
            {/* SECTION 1 */}
            <Section number="1" title="Flight & Booking">
              <Field
                label="Top banner"
                hint="Optional — paste Ctrl/Cmd + V or upload a banner/logo."
              >
                <div
                  onPaste={(e) => handlePasteImage(e, "banner")}
                  className="flex min-h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500"
                >
                  {draft.bannerImage ? (
                    <div className="relative w-full">
                      <img
                        src={draft.bannerImage}
                        className="mx-auto max-h-32 max-w-full rounded-lg object-contain"
                        alt="Banner"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          update("bannerImage", "");
                        }}
                        className="mt-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span>
                      Click here and press Ctrl/Cmd + V to paste a banner
                    </span>
                  )}
                </div>

                <label className="inline-flex cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleBanner(e.target.files?.[0])}
                  />
                </label>
              </Field>

              <Field
                label="Airline / Cruise line"
                required
                hint="Search any word, scroll the list, select a carrier, or type your own."
              >
                <input
                  value={airlineSearch}
                  onChange={(e) => setAirlineSearch(e.target.value)}
                  className={`${inputClass} ${
                    fieldErrors.airline
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : ""
                  }`}
                  placeholder="Search airline / cruise line..."
                />
                {fieldErrors.airline && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {fieldErrors.airline}
                  </p>
                )}

                <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
                  {filteredAirlines.map(([name, color]) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() => selectAirline(name, color)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-white"
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span style={{ color }}>{name}</span>
                    </button>
                  ))}

                  {!filteredAirlines.length && (
                    <div className="p-3 text-sm text-slate-500">
                      No company found. Type your own name below.
                    </div>
                  )}
                </div>

                <input
                  value={draft.airline}
                  onChange={(e) => update("airline", e.target.value)}
                  className={inputClass}
                  placeholder="Or type any airline / cruise line"
                />
              </Field>

              <Field label="Airline colour">
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl border border-slate-200"
                    style={{ backgroundColor: draft.airlineColor }}
                  />

                  <input
                    type="text"
                    value={draft.airlineColor}
                    onChange={(e) =>
                      setDraft((old) => ({
                        ...old,
                        airlineColor: e.target.value,
                        customAirlineColor: true,
                      }))
                    }
                    className={`${inputClass} max-w-40 font-mono`}
                  />

                  <input
                    type="color"
                    value={draft.airlineColor}
                    onChange={(e) =>
                      setDraft((old) => ({
                        ...old,
                        airlineColor: e.target.value,
                        customAirlineColor: true,
                      }))
                    }
                    className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                </div>
              </Field>

              <Field label="Booking number / PNR" required>
                <input
                  value={draft.bookingNo}
                  onChange={(e) => update("bookingNo", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 6XK2PQ"
                />
              </Field>

              <Field
                label="Subject line"
                hint="Placeholders: {airline} {service} {booking} {pax}"
              >
                <input
                  value={draft.subjectTpl}
                  onChange={(e) => update("subjectTpl", e.target.value)}
                  className={inputClass}
                  placeholder="{airline} {service} {booking}"
                />
              </Field>
            </Section>

            {/* SECTION 2 */}
            <Section number="2" title="Header & Greeting">
              <Field label="Header type">
                <select
                  value={draft.headerType}
                  onChange={(e) => changeHeaderType(e.target.value)}
                  className={inputClass}
                >
                  {HEADER_TYPES.map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              {/* NEW BOOKING WITH MILES */}
              {draft.headerType === "new_miles" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Miles used" required hint="Example: 50000">
                    <input
                      type="number"
                      min="0"
                      value={draft.milesUsed || ""}
                      onChange={(e) =>
                        updateHeaderField("milesUsed", e.target.value)
                      }
                      className={`${inputClass} ${fieldErrors.milesUsed ? "border-red-500" : ""}`}
                      placeholder="e.g. 50000"
                    />
                    {fieldErrors.milesUsed && (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.milesUsed}
                      </p>
                    )}
                  </Field>

                  <Field label="Amount paid ($, optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.milesDollars || ""}
                      onChange={(e) =>
                        updateHeaderField("milesDollars", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>
                </div>
              )}

              {/* SEAT SELECTION */}
              {draft.headerType === "seat_selection" && (
                <div className="space-y-4">
                  {(draft.passengers || []).map((passenger, index) => {
                    if (!passenger?.name?.trim()) return null;

                    return (
                      <Field
                        key={index}
                        label={`Passenger ${index + 1} — seat`}
                        required
                        hint="Enter seat per passenger, e.g. 12A"
                      >
                        <input
                          value={draft.seatMap?.[index] || ""}
                          onChange={(e) => {
                            const nextSeats = [...(draft.seatMap || [])];
                            nextSeats[index] = e.target.value;
                            updateHeaderField("seatMap", nextSeats);
                          }}
                          className={`${inputClass} ${fieldErrors[`seat-${index}`] ? "border-red-500" : ""}`}
                          placeholder="e.g. 12A"
                        />
                        {fieldErrors[`seat-${index}`] && (
                          <p className="text-xs font-medium text-red-600">
                            {fieldErrors[`seat-${index}`]}
                          </p>
                        )}
                      </Field>
                    );
                  })}

                  {!draft.passengers?.some((p) => p?.name?.trim()) && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      Add at least one passenger in Section 3 before entering
                      seat selection.
                    </div>
                  )}
                </div>
              )}

              {/* PET IN CABIN */}
              {draft.headerType === "pet_cabin" && (
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["petName", "Pet name", "e.g. Bella"],
                    ["petBreed", "Breed", "e.g. Pomeranian"],
                    ["petWeight", "Weight", "e.g. 5 kg"],
                    ["petAge", "Age", "e.g. 3 years"],
                  ].map(([key, label, placeholder]) => (
                    <Field key={key} label={label} required>
                      <input
                        value={draft[key] || ""}
                        onChange={(e) => updateHeaderField(key, e.target.value)}
                        className={`${inputClass} ${fieldErrors[key] ? "border-red-500" : ""}`}
                        placeholder={placeholder}
                      />
                      {fieldErrors[key] && (
                        <p className="text-xs font-medium text-red-600">
                          {fieldErrors[key]}
                        </p>
                      )}
                    </Field>
                  ))}

                  <Field label="Fee payment (optional)">
                    <select
                      value={draft.petPayMethod || ""}
                      onChange={(e) =>
                        updateHeaderField("petPayMethod", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">--none--</option>
                      <option value="Online Payment">Online Payment</option>
                      <option value="Pay at desk">Pay at desk</option>
                    </select>
                  </Field>

                  <Field label="Fee amount ($, optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.petPayAmount || ""}
                      onChange={(e) =>
                        updateHeaderField("petPayAmount", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>
                </div>
              )}

              {/* CANCELLATION WITH CREDIT */}
              {draft.headerType === "cancel_credit" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Credit amount" required>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.creditAmount || ""}
                      onChange={(e) =>
                        updateHeaderField("creditAmount", e.target.value)
                      }
                      className={`${inputClass} ${fieldErrors.creditAmount ? "border-red-500" : ""}`}
                      placeholder="0.00"
                    />
                    {fieldErrors.creditAmount && (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.creditAmount}
                      </p>
                    )}
                  </Field>

                  <Field label="Cancellation fee (optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.cancelFee || ""}
                      onChange={(e) =>
                        updateHeaderField("cancelFee", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>
                </div>
              )}

              {/* CANCELLATION WITH REFUND */}
              {draft.headerType === "cancel_refund" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Refund amount ($, optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.refundAmount || ""}
                      onChange={(e) =>
                        updateHeaderField("refundAmount", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>

                  <Field label="Cancellation fee (optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.cancelFee || ""}
                      onChange={(e) =>
                        updateHeaderField("cancelFee", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>

                  <Field
                    label="Processing timeline"
                    required
                    hint="Example: 12–16 weeks"
                  >
                    <input
                      value={draft.refundTimeline || ""}
                      onChange={(e) =>
                        updateHeaderField("refundTimeline", e.target.value)
                      }
                      className={`${inputClass} ${fieldErrors.refundTimeline ? "border-red-500" : ""}`}
                      placeholder="e.g. 12–16 weeks"
                    />
                    {fieldErrors.refundTimeline && (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.refundTimeline}
                      </p>
                    )}
                  </Field>
                </div>
              )}

              {/* CANCELLATION WITH MILES & REFUND */}
              {draft.headerType === "cancel_miles_refund" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Miles refunded (optional)"
                    hint="Example: 50000"
                  >
                    <input
                      type="number"
                      min="0"
                      value={draft.milesRefunded || ""}
                      onChange={(e) =>
                        updateHeaderField("milesRefunded", e.target.value)
                      }
                      className={inputClass}
                      placeholder="e.g. 50000"
                    />
                  </Field>

                  <Field label="Refund amount ($, optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.refundAmount || ""}
                      onChange={(e) =>
                        updateHeaderField("refundAmount", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>

                  <Field label="Cancellation fee (optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.cancelFee || ""}
                      onChange={(e) =>
                        updateHeaderField("cancelFee", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>

                  <Field label="Processing timeline" required>
                    <input
                      value={draft.refundTimeline || ""}
                      onChange={(e) =>
                        updateHeaderField("refundTimeline", e.target.value)
                      }
                      className={`${inputClass} ${fieldErrors.refundTimeline ? "border-red-500" : ""}`}
                      placeholder="e.g. 12–16 weeks"
                    />
                    {fieldErrors.refundTimeline && (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.refundTimeline}
                      </p>
                    )}
                  </Field>
                </div>
              )}

              {/* CANCEL & RE-ISSUE */}
              {draft.headerType === "cancel_reissue" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Refund amount ($, optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.refundAmount || ""}
                      onChange={(e) =>
                        updateHeaderField("refundAmount", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>

                  <Field label="Processing timeline" required>
                    <input
                      value={draft.refundTimeline || ""}
                      onChange={(e) =>
                        updateHeaderField("refundTimeline", e.target.value)
                      }
                      className={`${inputClass} ${fieldErrors.refundTimeline ? "border-red-500" : ""}`}
                      placeholder="e.g. 12–16 weeks"
                    />
                    {fieldErrors.refundTimeline && (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.refundTimeline}
                      </p>
                    )}
                  </Field>
                </div>
              )}

              {/* CANCEL & RE-BOOK */}
              {draft.headerType === "cancel_rebook" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="New booking number" required>
                    <input
                      value={draft.newBookingNo || ""}
                      onChange={(e) =>
                        updateHeaderField("newBookingNo", e.target.value)
                      }
                      className={`${inputClass} ${fieldErrors.newBookingNo ? "border-red-500" : ""}`}
                      placeholder="e.g. 7ABQ2Z"
                    />
                    {fieldErrors.newBookingNo && (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.newBookingNo}
                      </p>
                    )}
                  </Field>

                  <Field label="Refund amount ($, optional)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.refundAmount || ""}
                      onChange={(e) =>
                        updateHeaderField("refundAmount", e.target.value)
                      }
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </Field>

                  <Field label="Processing timeline" required>
                    <input
                      value={draft.refundTimeline || ""}
                      onChange={(e) =>
                        updateHeaderField("refundTimeline", e.target.value)
                      }
                      className={`${inputClass} ${fieldErrors.refundTimeline ? "border-red-500" : ""}`}
                      placeholder="e.g. 12–16 weeks"
                    />
                    {fieldErrors.refundTimeline && (
                      <p className="text-xs font-medium text-red-600">
                        {fieldErrors.refundTimeline}
                      </p>
                    )}
                  </Field>
                </div>
              )}

              {/* OTHER */}
              {draft.headerType === "other" && (
                <Field
                  label="Banner label"
                  required
                  hint="Example: Cancel & Re-Book"
                >
                  <input
                    value={draft.headerLabel || ""}
                    onChange={(e) => {
                      update("headerLabel", e.target.value);
                      clearFieldError("headerLabel");
                    }}
                    className={`${inputClass} ${fieldErrors.headerLabel ? "border-red-500" : ""}`}
                    placeholder="e.g. Cancel & Re-Book"
                  />
                  {fieldErrors.headerLabel && (
                    <p className="text-xs font-medium text-red-600">
                      {fieldErrors.headerLabel}
                    </p>
                  )}
                </Field>
              )}

              <Field
                label="Header label"
                hint="Automatically filled from header type, but editable."
              >
                <input
                  value={draft.headerLabel}
                  onChange={(e) => update("headerLabel", e.target.value)}
                  className={inputClass}
                />
              </Field>

              {draft.headerType !== "new_booking" && (
                <Field
                  label="Message line"
                  hint="Pre-filled from header type and amounts. Edit freely. Blanks show as ____."
                >
                  <textarea
                    value={draft.headerLine}
                    onChange={(e) => update("headerLine", e.target.value)}
                    className={`${inputClass} min-h-24`}
                  />
                </Field>
              )}

              <Field
                label="Greeting message"
                hint="Placeholders auto-fill: {pax} {agency} {airline} {amount} {last4}"
              >
                <textarea
                  value={draft.greeting}
                  onChange={(e) => update("greeting", e.target.value)}
                  className={`${inputClass} min-h-40`}
                />
              </Field>
            </Section>

            {/* SECTION 3 */}
            <Section number="3" title="Passengers">
              {draft.passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_190px_auto]"
                >
                  <input
                    value={passenger.name}
                    onChange={(e) =>
                      updatePassenger(index, "name", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Passenger Full name"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={passenger.dob || ""}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "").slice(0, 8);

                      if (value.length > 4) {
                        value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
                      } else if (value.length > 2) {
                        value = `${value.slice(0, 2)}/${value.slice(2)}`;
                      }

                      updatePassenger(index, "dob", value);
                    }}
                    className={inputClass}
                    placeholder="MM/DD/YYYY"
                  />

                  <button
                    type="button"
                    onClick={() => removePassenger(index)}
                    className="rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addPassenger}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                + Add passenger
              </button>

              <Field label="Send to (email)" required>
                <input
                  type="email"
                  value={draft.paxEmail}
                  onChange={(e) => update("paxEmail", e.target.value)}
                  className={inputClass}
                  placeholder="Passenger email"
                />
              </Field>
            </Section>

            {/* SECTION 4 */}
            <Section number="4" title="Flight Itinerary">
              <Field
                label=" Add a snip"
                hint="Paste or upload a screenshot. Maximum 6."
              >
                <div
                  onPaste={(e) => handlePasteImage(e, "itinerary")}
                  className="flex min-h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500"
                >
                  Click here and press Ctrl/Cmd + V to paste a screenshot, or
                  drag one in.
                </div>

                <label className="inline-flex cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">
                  Add image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleItineraryImage(e.target.files?.[0])}
                  />
                </label>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {draft.itineraryImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-xl border border-slate-200"
                    >
                      <img
                        src={img}
                        alt={`Itinerary ${index + 1}`}
                        className="h-28 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((old) => ({
                            ...old,
                            itineraryImages: old.itineraryImages.filter(
                              (_, i) => i !== index,
                            ),
                          }))
                        }
                        className="absolute right-2 top-2 rounded-lg bg-slate-900/80 px-2 py-1 text-xs text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </Field>
            </Section>

            {/* SECTION 5 */}
            <Section number="5" title="Merchants & Amounts">
              {draft.merchants.map((merchant, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr_170px_auto]">
                    <input
                      value={merchant.name}
                      onChange={(e) =>
                        updateMerchant(index, "name", e.target.value)
                      }
                      placeholder="Merchant name (e.g. Emirates, Consolidator)"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={merchant.amount}
                      onChange={(e) =>
                        updateMerchant(index, "amount", e.target.value)
                      }
                      className={`${inputClass} font-mono`}
                      placeholder="0.00"
                    />

                    <button
                      type="button"
                      onClick={() => removeMerchant(index)}
                      className="rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    value={merchant.breakdown}
                    onChange={(e) =>
                      updateMerchant(index, "breakdown", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Bifurcation (optional) — e.g. Base fare $100, Taxes $50, Fees $30"
                  />
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={addMerchant}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
                >
                  + Add merchant
                </button>

                <div className="text-lg font-bold text-slate-900">
                  Total {CURRENCIES[draft.currency]}
                  {total.toFixed(2)}
                </div>
              </div>

              <Field label="Currency">
                <select
                  value={draft.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  className={inputClass}
                >
                  {Object.keys(CURRENCIES).map((currency) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
              </Field>

              <p className="text-xs leading-5 text-slate-500">
                Add as many merchants as you need for a split transaction. The
                optional bifurcation box lets you note what a charge covers.
              </p>
            </Section>

            {/* SECTION 6 */}
            <Section number="6" title="Secure Payment Link">
              <Field
                label="Secure Payment Link"
                hint="Optional — if provided, this link will be included in the email."
              >
                <input
                  type="url"
                  value={draft.paymentLink || ""}
                  onChange={(e) => update("paymentLink", e.target.value)}
                  className={inputClass}
                  placeholder="https://secure-payment-link.com/..."
                />
              </Field>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">
                  Optional Payment Link
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Leave this field blank if no payment link is required. If a
                  secure HTTPS payment link is entered, it will automatically
                  appear in the email as a payment button.
                </p>
              </div>
            </Section>

            {/* SECTION 7 */}
            <Section number="7" title="Card Authorization">
              <Field
                label="Name on card (cardholder)"
                hint="As printed on the card"
              >
                <input
                  value={draft.cardName}
                  onChange={(e) => update("cardName", e.target.value)}
                  className={inputClass}
                  placeholder="As printed on the card"
                />
              </Field>

              <Field label="Card type">
                <select
                  value={draft.cardType}
                  onChange={(e) => update("cardType", e.target.value)}
                  className={inputClass}
                >
                  {CARD_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>

              <Field
                label="Card number"
                required
                hint="The full number is used only during entry. Only the last 4 digits are included in the email."
              >
                <div className="relative">
                  <input
                    type={showCardNumber ? "text" : "password"}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    placeholder=" last 4 digits card number"
                    value={draft.cardNumber || ""}
                    onChange={(e) => {
                      const value = formatCardNumber(e.target.value);

                      setDraft((old) => ({
                        ...old,
                        cardNumber: value,
                        cardLast4: value.slice(-4),
                      }));
                    }}
                    className="w-full pr-20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCardNumber((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showCardNumber ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>

              <Field label="Expiry (MM/YY)">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={draft.cardExpiry || ""}
                  onChange={(e) =>
                    setDraft((old) => ({
                      ...old,
                      cardExpiry: formatCardExpiry(e.target.value),
                    }))
                  }
                />
              </Field>

              <Field
                label="Billing address"
                hint="Address registered to the card"
              >
                <textarea
                  value={draft.billingAddress}
                  onChange={(e) => update("billingAddress", e.target.value)}
                  className={`${inputClass} min-h-24`}
                  placeholder="Address registered to the card"
                />
              </Field>

              {/* <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                                Passenger and other CRM users will see only the last 4 digits.
                                The email also contains only the last 4 digits. Full PAN/CVV
                                must not be stored in EmailRecord.
                            </div> */}
            </Section>

            {/* SECTION 8 */}
            <Section number="8" title="Terms & Conditions">
              <Field
                label="Terms & conditions"
                hint="This text remains editable and appears inside a scrollable box in the email."
              >
                <textarea
                  value={draft.terms}
                  onChange={(e) => update("terms", e.target.value)}
                  className={`${inputClass} min-h-[150px]`}
                />
              </Field>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                I Authorize
              </div>
            </Section>

            {/* SECTION 9 */}
            <Section number="9" title="Employee Sign-off">
              <Field label="Employee name" hint="Name that signs off the email">
                <input
                  value={draft.employeeName}
                  onChange={(e) => update("employeeName", e.target.value)}
                  className={inputClass}
                  placeholder="Name that signs off the email"
                />
              </Field>

              <Field
                label="Employee Number / Callback No"
                hint="Callback number shown in the email"
              >
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="(800) 555-1234"
                  maxLength={14}
                  value={draft.employeePhone || ""}
                  onChange={(e) =>
                    setDraft((old) => ({
                      ...old,
                      employeePhone: formatUSPhone(e.target.value),
                    }))
                  }
                />
              </Field>
              <Field
                label="Email"
                hint="Email address shown in the email signature"
              >
                <input
                  type="email"
                  value={draft.tncEmail || ""}
                  onChange={(e) => update("tncEmail", e.target.value)}
                  className={inputClass}
                  placeholder="airlinesupport@reservationssupports.com"
                />
              </Field>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  {draft.employeeName || "Employee"}
                </p>
                <p className="text-sm text-slate-500">Reservations Desk</p>
                <p className="text-sm text-slate-500">
                  {draft.employeePhone || "Toll-free number"}
                </p>
              </div>

              <button
                type="button"
                disabled={sending}
                onClick={sendEmail}
                className="w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending Email..." : "Send Email"}
              </button>
            </Section>
          </div>

          {/* PREVIEW */}
          <aside className="xl:sticky xl:top-4 xl:h-[calc(100vh-32px)]">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Passenger email preview ggg
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                  {makeSubject(draft)}
                </p>
              </div>

              <div className="flex-1 overflow-auto bg-slate-100 p-3">
                <div
                  className="min-h-full rounded-xl bg-white shadow-sm"
                  dangerouslySetInnerHTML={{
                    __html: buildEmailHtml(draft),
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
