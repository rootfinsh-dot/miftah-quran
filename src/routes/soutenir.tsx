import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DONATE_ACCOUNTS, DONATE_AMOUNTS } from "@/lib/site";
import { buildDonateURL } from "@/lib/donate";
import { Heart, ShieldCheck, ExternalLink, CreditCard } from "lucide-react";

export const Route = createFileRoute("/soutenir")({
  component: SoutenirPage,
});

function SoutenirPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");

  const activeAmount = customAmount ? parseFloat(customAmount) || selectedAmount : selectedAmount;

  const paypalUrl = buildDonateURL("paypal", DONATE_ACCOUNTS.paypal, activeAmount);
  const redotpayUrl = buildDonateURL("redotpay", DONATE_ACCOUNTS.redotpay, activeAmount);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full text-emerald-600 mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Soutenir Miftah Quran</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Miftah est et restera 100% gratuit, sans publicité intrusive et sans barrière payante pour l'essentiel.
          Votre soutien aide à couvrir les frais d'hébergement et à faire évoluer la recherche.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4 text-center">Choisissez un montant</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {DONATE_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
              className={`py-3 px-4 rounded-xl font-medium border transition-all ${
                selectedAmount === amt && !customAmount
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                  : "bg-background hover:bg-muted/50 border-border"
              }`}
            >
              {amt} €
            </button>
          ))}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-center text-muted-foreground">
            Ou entrez un montant libre (€)
          </label>
          <input
            type="number"
            min="1"
            placeholder="Ex : 15"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full max-w-xs mx-auto block px-4 py-2 rounded-xl border border-input bg-background text-center text-lg"
          />
        </div>

        <div className="border-t pt-8">
          <h3 className="text-md font-semibold mb-6 text-center">Sélectionnez votre moyen de paiement</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option PayPal */}
            <div className="border rounded-2xl p-6 flex flex-col justify-between bg-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-500" /> PayPal / Carte
                  </span>
                  <span className="text-xs bg-blue-500/10 text-blue-600 font-medium px-2.5 py-1 rounded-full">
                    Recommandé
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Don sécurisé via PayPal ou carte bancaire (via PayPal.Me sans restriction).
                </p>
              </div>
              {paypalUrl ? (
                <a
                  href={paypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  Faire un don de {activeAmount} € via PayPal <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 bg-muted text-muted-foreground font-medium rounded-xl text-center cursor-not-allowed"
                >
                  Bientôt disponible
                </button>
              )}
            </div>

            {/* Option RedotPay */}
            <div className="border rounded-2xl p-6 flex flex-col justify-between bg-card">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> RedotPay / Crypto
                  </span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-600 font-medium px-2.5 py-1 rounded-full">
                    International
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Paiement sécurisé et rapide via RedotPay ou cryptomonnaies.
                </p>
              </div>
              {redotpayUrl ? (
                <a
                  href={redotpayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  Faire un don de {activeAmount} € via RedotPay <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 bg-muted text-muted-foreground font-medium rounded-xl text-center cursor-not-allowed"
                >
                  Bientôt disponible
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Transactions 100% sécurisées. Aucun stockage de données bancaires sur nos serveurs.</span>
      </div>
    </div>
  );
}
