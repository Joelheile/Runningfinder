"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Imprint = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-screen max-w-full min-h-screen p-8">
      <nav className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center hover:bg-slate-100 rounded-md px-2 py-1 transition-colors"
        >
          <ChevronLeft className="stroke-primary" />
          <span className="text-primary">Back</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto w-full bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Imprint</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <p className="text-gray-700">
              Joel Heil Escobar
              <br />
              Köpenicker Straße 43
              <br />
              c/o The Fizz
              <br />
              10179 Berlin
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-gray-700">
              Phone: 01715871414
              <br />
              Email: contact@runningfinder.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">VAT ID</h2>
            <p className="text-gray-700">
              VAT Identification Number according to § 27 a of the German VAT
              Act:
              <br />
              DE366514999
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              EU Dispute Resolution
            </h2>
            <p className="text-gray-700">
              The European Commission provides a platform for online dispute
              resolution (ODR):{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              <br />
              Our email address can be found above in the imprint.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              Consumer Dispute Resolution/Universal Arbitration Board
            </h2>
            <p className="text-gray-700">
              We are not willing or obliged to participate in dispute resolution
              proceedings before a consumer arbitration board.
            </p>
          </section>

          <section>
            <p className="text-gray-700">
              Source:{" "}
              <a
                href="https://www.e-recht24.de"
                className="text-primary hover:underline"
              >
                https://www.e-recht24.de
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
