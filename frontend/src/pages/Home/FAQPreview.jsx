import { Link } from "react-router-dom";
import { faqs } from "../../data/faqs";
import FAQItem from "../../components/FAQItem";

const PREVIEW_COUNT = 5;

export default function FAQPreview() {
  const preview = faqs.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Got Questions?
          </span>
          <h2 className="text-4xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Quick answers to the most common questions about BloodLink.
          </p>
        </div>

        {/* Top 5 items */}
        <div className="space-y-3 text-gray-700">
          {preview.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* See more link */}
        <div className="mt-10 text-center">
          <Link
            to="/faq"
            className="text-white inline-flex items-center gap-2 bg-linear-to-r from-red-500 via-red-500 to-[#F73397] px-6 py-2.5 rounded-lg font-medium text-sm hover:scale-105 transition-transform duration-400"
          >
            See all FAQs
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
