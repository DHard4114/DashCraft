import {
    LockKeyhole, 
    Shield, 
    CreditCard as CardIcon 
} from "lucide-react";

    export default function SelectedPaymentPartners() {
    // Data mitra pembayaran dengan URL logo asli
    const paymentPartners = [
        {
        id: 1,
        name: "PayPal",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
        description: "Accepted globally with buyer and seller protection",
        popular: true
        },
        {
        id: 2,
        name: "Visa",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
        description: "Credit & debit cards accepted worldwide",
        popular: true
        },
        {
        id: 3,
        name: "Mastercard",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
        description: "Worldwide credit & debit card payment network",
        popular: true
        },
        {
        id: 4,
        name: "OVO",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/640px-Logo_ovo_purple.svg.png",
        description: "Indonesian digital payment platform",
        popular: true
        },
        {
        id: 5,
        name: "GoPay",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Logo_Gopay.svg/640px-Logo_Gopay.svg.png",
        description: "Indonesian digital wallet by GoJek",
        popular: true
        },
        {
        id: 6,
        name: "Shopee Pay",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopee_logo.svg/640px-Shopee_logo.svg.png",
        description: "Digital payment service by Shopee e-commerce platform",
        popular: true
        }
    ];

    return (
        <div className="bg-gray-100 font-mono py-12">
        <div className="max-w-4xl mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Selected Payment Partners</h2>
            </div>

            {/* Payment Partners Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentPartners.map(partner => (
                <div
                key={partner.id}
                className="border border-gray-300 rounded-lg p-6 bg-white hover:shadow-md hover:bg-gray-50 transition-all duration-300 relative"
                >
                {partner.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-semibold">
                    Popular
                    </div>
                )}
                <div className="flex items-center mb-4">
                    <div className="mr-4 bg-gray-100 p-3 rounded-full">
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-7 h-7 object-contain"
                        onError={e => { e.currentTarget.src = "/logos/default.png" }}
                    />
                    </div>
                    <h4 className="text-lg font-bold">{partner.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{partner.description}</p>
                </div>
            ))}
            </div>

            {/* Security Information */}
            <div className="mt-12 text-center">
            <div className="flex justify-center mb-4 gap-6 flex-wrap">
                <div className="flex items-center my-2">
                <LockKeyhole className="w-6 h-6 mr-2 text-gray-700" />
                <span>Secure Transactions</span>
                </div>
                <div className="flex items-center my-2">
                <Shield className="w-6 h-6 mr-2 text-gray-700" />
                <span>Fraud Protection</span>
                </div>
                <div className="flex items-center my-2">
                <CardIcon className="w-6 h-6 mr-2 text-gray-700" />
                <span>Encrypted Data</span>
                </div>
            </div>
            <p className="text-sm max-w-3xl mx-auto">
                DashCraft employs industry-standard security measures to ensure all payment transactions are secure.
                Your payment information is encrypted and never stored on our servers. For any payment-related inquiries,
                please contact our customer service team.
            </p>
            </div>
        </div>
        </div>
    );
}
