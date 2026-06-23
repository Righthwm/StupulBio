import { listMessages } from "@/lib/db/messages";
import { markRead } from "./actions";

export default async function MessagesPage() {
  const messages = await listMessages();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl">Mesaje</h1>
      {messages.length === 0 ? (
        <p className="text-text-muted text-sm">Niciun mesaj încă.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`card p-5 ${m.read ? "" : "border-gold-400/40"}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {m.name}{" "}
                    {!m.read && <span className="text-gold-300 text-xs">(necitit)</span>}
                  </p>
                  <p className="text-text-muted text-xs">
                    {m.email}{m.phone ? ` · ${m.phone}` : ""} · {m.subject}
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{m.message}</p>
                  <p className="text-text-muted text-xs mt-2">
                    {new Date(m.createdAt).toLocaleDateString("ro-RO")}
                  </p>
                </div>
                {!m.read && (
                  <form action={markRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="btn-secondary text-xs px-3 py-1 whitespace-nowrap">
                      Marchează citit
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
