import { LockKeyhole, Shield, CreditCard as CardIcon } from "lucide-react";

export default function SelectedPaymentPartners() {
  const paymentPartners = [
    { id: 1, name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", description: "Accepted globally with buyer and seller protection", popular: true },
    { id: 2, name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png", description: "Credit & debit cards accepted worldwide", popular: true },
    { id: 3, name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png", description: "Worldwide credit & debit card payment network", popular: true },
    { id: 4, name: "OVO", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/640px-Logo_ovo_purple.svg.png", description: "Indonesian digital payment platform", popular: true },
    { id: 5, name: "GoPay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Logo_Gopay.svg/640px-Logo_Gopay.svg.png", description: "Indonesian digital wallet by GoJek", popular: true },
    { id: 6, name: "Shopee Pay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopee_logo.svg/640px-Shopee_logo.svg.png", description: "Digital payment service by Shopee e-commerce platform", popular: true }
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center bg-[#e0e2e0] font-mono py-8 mx-auto">
      <h2 className="text-center text-xl sm:text-2xl font-bold mb-6">Selected Payment Partners</h2>
      <div className="max-w-screen-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
        {paymentPartners.map(({ id, name, logo, description, popular }) => (
          <div key={id} className="relative border rounded p-4 bg-white hover:shadow transition">
            {popular && (
              <div className="absolute top-0 right-0 bg-blue-400 text-white text-xs px-2 py-0.5 rounded-bl rounded-tr font-semibold">Popular</div>
            )}
            <div className="flex items-center mb-3">
              <div className="mr-3 p-2 bg-gray-100 rounded-full">
                <img
                  src={logo}
                  alt={name}
                  className="w-6 h-6 object-contain"
                  onError={e => (e.currentTarget.src = "/logos/default.png")}
                />
              </div>
              <h4 className="font-semibold text-sm sm:text-base">{name}</h4>
            </div>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm space-y-3 max-w-2xl mx-auto px-2">
        <div className="flex justify-center flex-wrap gap-5">
          <div className="flex items-center gap-1">
            <LockKeyhole className="w-4 h-4 text-gray-700" /> Secure Transactions
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-gray-700" /> Fraud Protection
          </div>
          <div className="flex items-center gap-1">
            <CardIcon className="w-4 h-4 text-gray-700" /> Encrypted Data
          </div>
        </div>
        <p>
          DashCraft uses industry-standard security measures. Payment info is encrypted and never stored. Contact customer service for inquiries.
        </p>
      </div>
    </div>
  );
}
