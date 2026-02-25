import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api";


export default function NewsLetter() {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSending(true);
            await axios.post(`${API_BASE_URL}/newsletter/subscribe`, { email });
            setSuccess("Subscribed successfully");
            setError("");
            toast.success("Subscribed successfully");
            setSending(false);
        } catch (error) {
            setError("Failed to subscribe");
            setSuccess("");
            toast.error("Failed to subscribe: " + error.response.data.message);
            setSending(false);
        }
    };

    return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 py-20 px-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-flaire-pink/20"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">Join the Flaire Club</h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Be the first to know about new collections and exclusive offers. Plus, get 15% off your first order.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-flaire-coral flex-grow max-w-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-flaire-coral text-zinc-900 font-bold px-8 py-4 rounded-full hover:bg-flaire-orange transition-colors"
                onClick={handleSubmit}
              >
                {sending? "Sending..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
