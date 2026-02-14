# Mezzanotte al Ranch - PWA

Questa è la Progressive Web App per il LARP "Mezzanotte al Ranch", riscritta in React con Vite e Tailwind CSS.

## Installazione

1.  Apri il terminale in questa cartella.
2.  Installa le dipendenze:
    ```bash
    npm install
    ```

## Sviluppo

Per avviare il server di sviluppo locale:

```bash
npm run dev
```

Apri il browser all'indirizzo mostrato (solitamente `http://localhost:5173`).

## Build per Produzione

Per creare la versione ottimizzata per la produzione:

```bash
npm run build
```

Per vedere l'anteprima della build:

```bash
npm run preview
```

## Funzionalità PWA

L'applicazione è configurata come PWA. Su mobile, puoi aggiungerla alla schermata Home.

- **Login**: Seleziona una banda e usa la password corrispondente (es. `peccatori`).
- **Scanner**: Richiede accesso alla fotocamera (funziona meglio su HTTPS o localhost).
- **Persistenza**: I progressi sono salvati nel localStorage del browser.
