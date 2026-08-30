# Come pubblicare Nova — guida passo passo

Questa cartella contiene un sito web completo e funzionante. Segui questi passaggi nell'ordine, senza saltarne nessuno.

---

## PARTE 1 — Ottenere la chiave API (il "cervello" di Nova)

1. Vai su **https://console.anthropic.com** e crea un account (email + password).
2. Una volta dentro, cerca nel menu a sinistra **"API Keys"** (o "Chiavi API").
3. Clicca **"Create Key"**, dai un nome a piacere (es. "Nova"), e copia la chiave che appare (inizia con `sk-ant-...`). Salvala da qualche parte al sicuro — non potrai rivederla dopo.
4. Nella stessa console, vai su **"Billing"** e aggiungi un metodo di pagamento con un piccolo importo (anche 5$ bastano per iniziare — con il modello economico usato qui, durano moltissimo).

⚠️ Non condividere mai questa chiave con nessuno e non incollarla in nessun file di questo progetto: andrà inserita solo nel pannello di Netlify (vedi Parte 3).

---

## PARTE 2 — Caricare il progetto su GitHub

1. Vai su **https://github.com** e crea un account gratuito, se non ce l'hai.
2. Clicca sul **+** in alto a destra → **"New repository"**.
3. Dai un nome (es. `nova-ai`), lascialo **pubblico o privato** (indifferente), NON aggiungere nessun file extra, poi clicca **"Create repository"**.
4. Nella pagina che si apre, clicca **"uploading an existing file"** (o "Add file" → "Upload files").
5. Trascina dentro **tutti i file e le cartelle** di questa cartella (`index.html`, `netlify.toml`, la cartella `netlify`, e le icone `.png`).
6. Scorri in basso e clicca **"Commit changes"**.

---

## PARTE 3 — Pubblicare su Netlify (gratis)

1. Vai su **https://app.netlify.com** e crea un account (puoi accedere direttamente con GitHub, è più veloce).
2. Clicca **"Add new site"** → **"Import an existing project"**.
3. Scegli **GitHub**, autorizza l'accesso, e seleziona il repository `nova-ai` che hai appena creato.
4. Netlify mostrerà le impostazioni di build: lasciale come sono (non serve modificare nulla), clicca **"Deploy site"**.
5. Aspetta che finisca (di solito meno di un minuto).

## PARTE 4 — Inserire la chiave API in modo sicuro

1. Nel pannello del tuo sito su Netlify, vai su **"Site configuration"** → **"Environment variables"**.
2. Clicca **"Add a variable"**.
3. Come nome scrivi esattamente: `ANTHROPIC_API_KEY`
4. Come valore incolla la chiave che hai copiato nella Parte 1 (quella che inizia con `sk-ant-...`).
5. Salva, poi vai su **"Deploys"** e clicca **"Trigger deploy"** → **"Deploy site"** per far ripartire il sito con la chiave attivata.

---

## Fatto!

Netlify ti darà un link tipo `https://nova-ai-xyz123.netlify.app` — quello è il link pubblico di Nova, funzionante, che puoi condividere con chiunque.

## Note su sicurezza e costi

- La chiave API resta sempre nascosta nel backend: nessun visitatore del sito può vederla.
- Il modello usato (Haiku) è il più economico disponibile: per un uso normale (decine di conversazioni al giorno) il costo è di pochi centesimi al mese.
- Nel file `netlify/functions/chat.js` c'è un limite di sicurezza che tronca le conversazioni troppo lunghe, per contenere i costi.
- Puoi controllare la spesa in ogni momento su console.anthropic.com → "Billing".
- Se un giorno vuoi fermare tutto, basta eliminare il sito da Netlify o rimuovere la chiave API.

Se qualcosa non torna in uno di questi passaggi, fammi uno screenshot e ti aiuto a capire cosa fare.
