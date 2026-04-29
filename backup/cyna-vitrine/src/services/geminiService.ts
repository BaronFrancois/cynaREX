const DEFAULT_API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001/api"
    : "https://cyna-api.onrender.com/api";

const getChatUrl = () => {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
  return `${base}/chatbot/vitrine`;
};

export const chatWithCyna = async (
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  locale: "fr" | "en" = "fr"
): Promise<string> => {
  try {
    const res = await fetch(getChatUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, locale }),
    });
    const data = (await res.json()) as { text?: string; message?: string; error?: string };
    const fallbackNoAnswer =
      locale === "en"
        ? "Sorry, I couldn't generate a response."
        : "Désolé, je n'ai pas pu générer de réponse.";
    if (!res.ok) {
      const errMsg =
        (typeof data.message === "string" && data.message) || data.error || fallbackNoAnswer;
      return errMsg;
    }
    return data.text || fallbackNoAnswer;
  } catch (error) {
    console.error("Chat Error:", error);
    return locale === "en"
      ? "I'm having trouble connecting to the secure server right now. Please try again later."
      : "J'ai du mal à me connecter au serveur sécurisé pour le moment. Veuillez réessayer plus tard.";
  }
};
