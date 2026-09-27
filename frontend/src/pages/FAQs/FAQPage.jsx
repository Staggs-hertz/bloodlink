import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import FAQItem from "../../components/FAQItem";
import { faqs, faqCategories } from "../../data/faqs";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Always start at the top when navigating here
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filtered =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <section className="py-20 px-4 bg-secondary">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm hover:text-foreground transition-colors mb-10"
        >
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
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Help Center
          </span>
          <h1 className="text-4xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about donating and requesting blood on
            BloodLink.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {faqCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm cursor-pointer font-medium transition-colors duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "border border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* All FAQ items */}
        <div className="space-y-3 text-gray-700">
          {filtered.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center p-8 rounded-2xl bg-accent border border-border">
          <p className="font-semibold text-lg mb-1">Still have questions?</p>
          <p className="text-sm mb-5 text-gray-600">
            Our support team is available Monday – Friday, 8am to 6pm.
          </p>
          <a
            href="mailto:support@bloodlink.com"
            className="inline-flex text-white items-center gap-2 bg-linear-to-r from-red-500 via-red-500 to-[#F73397] px-6 py-2.5 rounded-lg font-medium text-sm hover:scale-105 transition-transform duration-400"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
