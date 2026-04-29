const getChatUrl = () => {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api").replace(
    /\/$/,
    ""
  );
  return `${base}/chatbot/vitrine`;
};

export const chatWithCyna = async (
  message: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const res = await fetch(getChatUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
    const data = (await res.json()) as { text?: string; message?: string; error?: string };
    if (!res.ok) {
      const errMsg =
        (typeof data.message === "string" && data.message) ||
        data.error ||
        "Désolé, je n'ai pas pu générer de réponse.";
      return errMsg;
    }
    return data.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "J'ai du mal à me connecter au serveur sécurisé pour le moment. Veuillez réessayer plus tard.";
  }
};
