import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DONATE_ACCOUNTS, DONATE_AMOUNTS } from "@/lib/site";
import { buildDonateURL } from "@/lib/donate";
import { Heart, ShieldCheck, ExternalLink, CreditCard, Copy } from "lucide-react";

export const Route = createFileRoute("/soutenir")({
  component: SoutenirPage,
});

function SoutenirPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");

  const activeAmount = customAmount ? parseFloat(customAmount) || selectedAmount : selectedAmount;

  const paypalUrl = buildDonateURL("paypal", DONATE_ACCOUNTS.paypal, activeAmount);
  // RedotPay ne retourne pas d'URL
  const redotpayInfo = DONATE_ACCOUNTS.redotpay;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Soutenir Miftah Quran</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Votre soutien aide à couvrir les frais d'hébergement.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4 text-center">Choisissez un montant</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {DONATE_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
              className={`py-3 px-4 rounded-xl font-medium border ${
                selectedAmount === amt && !customAmount
                  ? "bg-emerald-600 text-white"
                  : "bg-background hover:bg-muted/50"
              }`}
            >
              {amt} €
            </button>
          ))}
        </div>

        <div className="border-t pt-8">
          <h3 className="text-md font-semibold mb-6 text-center">Moyens de paiement</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option PayPal */}
            <div className="border rounded-2xl p-6 flex flex-col justify-between bg-card">
              <span className="font-bold text-lg mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-500" /> PayPal</span>
              <a href={paypalUrl!} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl text-center">
                Faire un don de {activeAmount} €
              </a>
            </div>

            {/* Option RedotPay */}
            <div className="border rounded-2xl p-6 flex flex-col bg-card">
              <span className="font-bold text-lg mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> RedotPay</span>
              <p className="text-sm text-muted-foreground mb-4">Envoyez le don via votre application RedotPay :</p>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono break-all">
                {redotpayInfo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
