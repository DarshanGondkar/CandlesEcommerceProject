import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const AboutUs = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-background border-b border-border pb-2 md:pb-0">
        <Header /> 
      </div>

        {/* ================= HERO SECTION ================= */}
      <section className="px-4 sm:px-10 md:px-20 lg:px-40 py-10">
        <div className="max-w-[960px] mx-auto">
          <div
            className="flex min-h-[480px] flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat rounded-lg p-6 text-center"
            style={{
              backgroundImage: `linear-gradient(rgba(247, 229, 133, 0.54), rgba(0,0,0,0.5)),
              url("https://lh3.googleusercontent.com/aida-public/AB6AXuC03GLu1vPnE_Lzh18OZz8ekXtmnNIkAtTv0WMEbwQ_AFEXsc6hXRM169pMY12ziNmdpGdf8cpDTADrQcQ6rvC23Qc7ohSJ0Ex534Kmwmqz_2n7kJu0IT-Fh6rtqeEPgDvO9cmGZWmJjPB9bA4q0HqAq0bZBKgcNciQ3guBJ6IbnjqDj99ND-0_VdEIE-RHbGuJiDEjzjXt4qrHf3JqiYyDffW6hWS28bYh1hOfYNnt1f8hEFuvvXi6i-O1leqQqcPbaENWCo_eMjpG")`,
            }}
          >
            <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight">
              Crafted by Hand, Inspired by Nature.
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl font-sans">
              Discover the story behind our sustainable soy and coco wax candles,
              designed to illuminate your space.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className="px-4 py-10">
        <div className="max-w-[960px] mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Our Commitment to Quality & Sustainability
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-[720px] mx-auto font-sans">
            We believe in creating products that are both beautiful and mindful.
            Our philosophy is rooted in craftsmanship, natural ingredients, and a
            deep respect for the environment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: "spa",
                title: "Sustainable Sourcing",
                desc: "We exclusively use natural soy and coco wax, sourced from renewable and ethical suppliers.",
              },
              {
                icon: "gesture",
                title: "Hand-Poured in Small Batches",
                desc: "Every candle is meticulously mixed, poured, and finished by hand.",
              },
              {
                icon: "science",
                title: "Non-Toxic & Clean Burning",
                desc: "Free from parabens, phthalates, and harmful chemicals.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-lg p-4 text-center space-y-2"
              >
                <span className="material-symbols-outlined text-3xl text-primary">
                  {item.icon}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOUNDER NOTE ================= */}
      <section className="px-4 py-10">
        <div className="max-w-[960px] mx-auto border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
          <div
            className="w-32 h-32 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRH4jxFzDVy8uWR42m-n0-pU3VxWtVJrJoxQQ-m3uLUyD13OTsX_e3_VEgqGj2ZE3KNAIDWCxPPDmVcDo-Qhq17kqnRR9BGu01zqMqmjdN2bm6Q3RMIoBcJNGVIqJfwZsap5JEMo53-LcKVceBxa1c_OO5QQclLhNq4_5P-u6krBBbSepbrbXuNsKLgB9uNytK4xbO5Y3f403ZM3h1L2FIK8VRUlowdGlwh6DzxmO5OF4sw_Wb13j6P6LnACTBTTgJ2-INC6OWuASJ")',
            }}
          />
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              A Note from the Founder
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 font-sans">
              "My vision was to create more than just a candle; it was to craft an
              experience. A moment of tranquility and elegance, captured in a
              flickering flame."
            </p>
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="px-4 py-10">
        <div className="max-w-[960px] mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Gallery of Craft
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              className="col-span-2 row-span-2 rounded-lg object-cover w-full h-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgVXi33cjofCt0wsAO2ZDwyxAZ-aMvVn_QQ_-Hwqg1pTTIobsENlC3pUBeffhc1LjtcybrhDkPcbT8-Mey1kXpssw5S5lp36xzcfLP4TYNhK8nYuxiSz39s-y_QyYbcssE3YaC4K9Y0EUh787WoWQxNSL1Ucstv-EEGpn_nqHpV8UR_lFvAq3bLnbuyrYo5SZ0z5L903Wc1l5-TJqMZJj5-pDOT9NHkaihrsNV1sBxLhQmVZ6yMWqkyFCZxLzi_XB9cyuinj2wxcMT"
              alt=""
            />
            {[
              "AB6AXuA8ByBHFMGdzdroCh4AaPedqb4ZZ8z9znkyGghFpLhclLSnhtBvagpG1r1MR5eue8XAt46kQIb0Z1eyvYlfRjzqo83lCIVSzrzt2uew_fT4CTTL8qBFTSNsC2reWhSV0c-4qBVP8mgHD3GNDt3sPWDWey7T4P1CrZTWRR1yKkqVLa7KqU6Xo_zzzigTLI4fzmz3YcsWVNSLJppNBErvEBz8ijPe9alSkNsXZXfXXxDd-ZkLq6Af7sSq6FRUzorZ38KfgFyHtmpfHyoL",
              "AB6AXuCYi17myxDq1Pvo5WF-faFdhQ6_i1dn7Lv-XveZMvO6fJX2xmWJ4bgzAduPH1j45mFGIsKAc1EIrcQ2eCBF4kmgVO25-VGbaupp0DT0f3-gOHYL2SuGj1CimDcRsBOCQY3P98zDaG2RnLCZWDPnJAdzsav_GG3CPxpJGl0WSpwsuGhkTCzFR83WwUb-fbvRT9HnoUHvPpMmfHcmVuuWRN-5kAP359iEE6_sSh0MnGDxaFr_db90CDPbV66dTlZFaS1a5sp-IsSRJmXd",
            ].map((img) => (
              <img
                key={img}
                className="rounded-lg object-cover aspect-square"
                src={`https://lh3.googleusercontent.com/aida-public/${img}`}
                alt=""
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-4 py-12 border-t border-gray-200 dark:border-white/10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Ready to Find Your Scent?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mt-2 font-sans">
          Explore our curated collections and bring home a fragrance that tells
          your story.
        </p>
     <a href="/ProductListing">
  <button className="mt-6 px-6 py-3 bg-primary text-white rounded-lg font-bold">
    Explore Our Collections
  </button>
</a>
      </section>


{/* ================= FOOTER ================= */}
<Footer/>
    </div>
  );
};

export default AboutUs;
