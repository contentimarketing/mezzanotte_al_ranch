import React, { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Camera, Lock, Unlock, Map, Skull, FileText, X, ChevronDown, ChevronUp, Search, PenTool, Eye, Key } from 'lucide-react';

// --- DATA & CONTENT ---

const TEAMS = [
    { id: 'peccatori', name: 'I Peccatori del Canyon', password: 'sin' },
    { id: 'bayou', name: 'La Banda del Bayou', password: 'alligator' },
    { id: 'stivali', name: 'Gli Stivali Sporchi', password: 'spurs' },
    { id: 'peyotes', name: 'I Peyotes', password: 'weed' },
    { id: 'candie', name: 'La Famiglia Candie', password: 'django' }
];

const CHARACTERS = [
    {
        id: 'lola',
        name: 'Lola "Red Velvet"',
        role: 'La Regina del Saloon',
        desc: "La conoscete tutti. La donna più desiderata della frontiera. Per anni si è mormorato che lei e Cyrus Vane fossero molto più che amici. Non era la solita storia d'amore: Lola era il suo architetto. Ha ripulito Vane, trasformandolo da bifolco a magnate. Ma ora che lui punta a Washington, la guarda dall'alto in basso, come un vecchio peccato da nascondere.",
        image: '💃'
    },
    {
        id: 'silenzio',
        name: '"Silenzio"',
        role: 'Il Cacciatore',
        desc: "Nessuno sa il suo vero nome. È arrivato giorni fa su un cavallo nero, con la polvere di tre stati addosso. Non ordina da bere, non parla. È chiaramente un cacciatore di taglie. Si vocifera seguisse Vane da tempo. Era qui per catturarlo... o per finirlo?",
        image: '🤠'
    },
    {
        id: 'buck',
        name: 'Buck Miller',
        role: 'L\'Ex Padrone',
        desc: "L'uomo che ha costruito questo posto asse dopo asse. Fino a ieri era il suo regno, oggi è un ospite sgradito. Vane gli ha preso il ranch, i cavalli e l'orgoglio per un pugno di debiti. Ha il cuore spezzato e il fegato pieno di rabbia e bourbon.",
        image: '👴'
    },
    {
        id: 'corvo',
        name: 'Corvo Grigio',
        role: 'Lo Stalliere',
        desc: "Lavora nelle ombre delle scuderie. Sente cose che noi non sentiamo. Dice che sotto le stalle dormono gli spiriti dei suoi antenati e che il 'Cavallo di Fuoco' è venuto a punire l'uomo bianco. Vane lo trattava come un cane, ma Corvo Grigio non ha mai abbassato la testa.",
        image: '🦅'
    },
    {
        id: 'higgins',
        name: 'Sceriffo Higgins',
        role: 'La Legge',
        desc: "Lo chiamano 'Iron', ferro... ma sembra più ruggine. Vane lo teneva al guinzaglio pagando i suoi vizi per chiudere un occhio. Ma forse i pagamenti erano finiti. E forse, Higgins ha deciso che era meglio un padrone morto che una carriera finita.",
        image: '⭐'
    }
];

const CLUES_DB = [
    {
        id: 1,
        code: '12',
        title: 'Vecchio Volantino Strappato',
        type: 'Indizio Fisico',
        content: "Un vecchio poster circense trovato nella bacheca. Ritrae un mago in smoking e una donna familiare...",
        detail: "TESTO DEL POSTER: 'Il Grande Illusionista Mysterio e la sua assistente! - Lo Spettacolo Imperdibile'",
        imagePlaceholder: "🎪",
        image: "/volantino.png"
    },
    {
        id: 2,
        code: '34',
        title: 'Telegramma',
        type: 'Documento',
        content: "Una striscia di carta da telegrafo incastrata nei raggi di un carro.",
        detail: "TESTO: 'Vane ricercato per diserzione. STOP. Portalo al forte VIVO. STOP. Pagamento alla consegna.'",
        imagePlaceholder: "📜",
        image: "https://placehold.co/600x400/262220/dcb878?text=Telegramma+Militare"
    },
    {
        id: 3,
        code: '56',
        title: 'Lettera Legale',
        type: 'Documento',
        content: "Una lettera spiegazzata trovata nella cassetta di pulizia dei cavalli.",
        detail: "TESTO: 'Signor Miller, domani le ruspe abbatteranno la stalla centrale. Se oppone resistenza, le porteremo via tutto, anche gli effetti personali.'",
        imagePlaceholder: "⚖️",
        image: "https://placehold.co/600x400/262220/dcb878?text=Lettera+Sfratto"
    },
    {
        id: 4,
        code: '78',
        title: 'Diario Manoscritto',
        type: 'Oggetto Personale',
        content: "Una pagina di diario nascosta nel fieno.",
        detail: "TESTO: 'Ho usato la polvere luminosa e la salvia per il rituale sacro di stasera. Gli spiriti vedranno, gli uomini temeranno.'",
        imagePlaceholder: "📓",
        image: "https://placehold.co/600x400/262220/dcb878?text=Pagina+Diario"
    },
    {
        id: 5,
        code: '90',
        title: 'Libro Mastro',
        type: 'Contabilità',
        content: "Una pagina di contabilità strappata trovata all'ingresso della zona cena.",
        detail: "LISTA PAGAMENTI: 'Higgins - $50 (Silenzio su rissa)', 'Higgins - $100 (Ignorare confini)'. NOTA A MARGINE: 'Vane minaccia di parlare se gli chiedo altri soldi.'",
        imagePlaceholder: "💰",
        image: "https://placehold.co/600x400/262220/dcb878?text=Libro+Mastro"
    }
];

// --- CUSTOM ICONS ---

const GhostHorseIcon = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Green Infernal Flames Background */}
        <path d="M20 80 Q 10 70 20 60 Q 10 50 30 40 Q 20 20 40 30 Q 50 10 60 30 Q 80 10 90 40 Q 100 60 80 70 Q 90 90 60 80" fill="#4ade80" opacity="0.8" className="animate-pulse" />
        <path d="M25 85 Q 15 75 25 65 Q 15 55 35 45 Q 25 25 45 35 Q 55 15 65 35" fill="#22c55e" opacity="0.9" className="animate-pulse" style={{ animationDelay: '0.2s' }} />

        {/* Horse Head Silhouette */}
        <path d="M35 80 L 35 60 L 30 50 L 40 30 L 50 25 L 70 30 L 80 50 L 75 60 L 80 70 L 60 80 Z" fill="#262220" stroke="#dcb878" strokeWidth="2" />
        <path d="M35 80 Q 45 90 60 80" fill="#262220" />

        {/* Glowing Eyes */}
        <circle cx="50" cy="40" r="3" fill="#4ade80" className="animate-ping" />
        <circle cx="65" cy="40" r="3" fill="#4ade80" className="animate-ping" style={{ animationDelay: '0.5s' }} />
    </svg>
);

const WOOD_TEXTURE = "url('https://www.transparenttextures.com/patterns/wood-pattern.png')";
// Darker gradient overlay to ensure text readability on wood
const WOOD_STYLE = {
    backgroundImage: `linear-gradient(rgba(38, 34, 32, 0.85), rgba(38, 34, 32, 0.9)), ${WOOD_TEXTURE}`,
    backgroundSize: 'auto, 300px', // Texture repeats, gradient covers
};

const HORSE_ICON_URL = "/icon.png"; // Local App Icon

// --- FOG EFFECT COMPONENT (Adapted from Gist) ---
const FogEffect = () => (
    <>
        <style>
            {`
            /* Keyframes */
            @keyframes foglayer_01_opacity {
                0% { opacity: .1; }
                22% { opacity: .5; }
                40% { opacity: .28; }
                58% { opacity: .4; }
                80% { opacity: .16; }
                100% { opacity: .1; }
            }
            @keyframes foglayer_02_opacity {
                0% { opacity: .5; }
                25% { opacity: .2; }
                50% { opacity: .1; }
                80% { opacity: .3; }
                100% { opacity: .5; }
            }
            @keyframes foglayer_03_opacity {
                0% { opacity: .8; }
                27% { opacity: .2; }
                52% { opacity: .6; }
                68% { opacity: .3; }
                100% { opacity: .8; }
            }
            @keyframes foglayer_moveme {
                0% { left: 0; }
                100% { left: -100%; }
            }

            /* Container & Layers */
            .fog-wrapper {
                height: 100%;
                position: absolute;
                width: 200%;
                top:0; 
                left:0;
            }
            .fog-image-01, .fog-image-02 {
                float: left;
                height: 100%;
                width: 50%;
                background-position: center center;
                background-size: 100% 100%; /* Force stretch to match edges seamlessly */
                background-repeat: no-repeat;
                background-color: transparent;
            }
            
            /* Layer Specifics */
            .fog-layer-01 {
                animation: foglayer_01_opacity 10s linear infinite, foglayer_moveme 15s linear infinite;
            }
            .fog-layer-01 .fog-image-01, .fog-layer-01 .fog-image-02 {
                background-image: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog1.png");
            }

            .fog-layer-02 {
                animation: foglayer_02_opacity 21s linear infinite, foglayer_moveme 13s linear infinite;
            }
            .fog-layer-02 .fog-image-01, .fog-layer-02 .fog-image-02 {
                background-image: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png");
            }

            /* Adjust mobile speed and opacity for performance/look */
            @media (max-width: 768px) {
                .fog-layer-01 { animation-duration: 10s, 20s; } /* Slower move on mobile */
                .fog-layer-02 { animation-duration: 21s, 18s; }
                .fog-layer-03 { animation-duration: 27s, 18s; }
            }

            .fog-layer-03 {
                animation: foglayer_03_opacity 27s linear infinite, foglayer_moveme 13s linear infinite;
            }
            .fog-layer-03 .fog-image-01, .fog-layer-03 .fog-image-02 {
                background-image: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png");
            }
            `}
        </style>

        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden opacity-60">
            <div className="fog-wrapper fog-layer-01">
                <div className="fog-image-01"></div>
                <div className="fog-image-02"></div>
            </div>
            <div className="fog-wrapper fog-layer-02">
                <div className="fog-image-01"></div>
                <div className="fog-image-02"></div>
            </div>
            <div className="fog-wrapper fog-layer-03">
                <div className="fog-image-01"></div>
                <div className="fog-image-02"></div>
            </div>
        </div>
    </>
);

// --- COMPONENTS ---

const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a1614] text-paper p-4 shadow-md border-b-4 border-rust flex items-center justify-between">
        <div className="flex items-center gap-3">
            <img
                src={HORSE_ICON_URL}
                alt="Skull Icon"
                className="w-10 h-10 rounded-full border-2 border-[#1a1614] object-cover"
                style={{ animation: 'green-fire 2s infinite alternate', boxShadow: '0 0 5px #00ff00' }}
            />
            <div>
                <h1 className="font-black text-xl tracking-widest uppercase text-rust font-serif leading-none" style={{ textShadow: '1px 1px 0 #000' }}>
                    MEZZANOTTE
                </h1>
                <p className="text-[10px] text-[#9c8c74] font-bold uppercase tracking-[0.2em]">Caccia al Ranch</p>
            </div>
        </div>
        <div className="text-right border-l-2 border-rust pl-3 relative z-10">
            <p className="text-[10px] text-[#9c8c74] font-mono tracking-wider font-bold">CASO #1908</p>
            <p className="text-[10px] text-blood font-black font-mono uppercase">Vittima: Vane</p>
        </div>
    </header>
);

const Nav = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'story', label: 'Dossier', icon: <Map size={24} /> },
        { id: 'clues', label: 'Indizi', icon: <Search size={24} /> },
        { id: 'accuse', label: 'Accusa', icon: <Skull size={24} /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-charcoal border-t-4 border-rust pb-safe z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.6)]">
            <div className="flex justify-around items-center h-20 relative">
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative z-10 ${activeTab === tab.id
                            ? 'text-paper bg-[#3a3028] border-t-4 border-paper -mt-1'
                            : 'text-[#8a7a6a] hover:text-rust'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-[10px] mt-1 font-black uppercase tracking-widest font-serif">{tab.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

// --- LOGIN COMPONENT ---

const LoginScreen = ({ onLogin }) => {
    // const [selectedTeam, setSelectedTeam] = useState(''); // Removed as we infer team from password
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const inputPwd = password.toLowerCase().trim();

        // Find team based on password
        const team = TEAMS.find(t => t.password.toLowerCase() === inputPwd);

        if (team) {
            onLogin(team);
        } else {
            setError("Parola d'ordine errata. O non sei dei nostri.");
        }
    };

    return (
        <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-6 text-paper relative overflow-hidden">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'linear-gradient(to bottom, #1a1614 0%, #3e2b22 100%)' }}></div>
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

            {/* Keyframes for Green Fire */}
            <style>
                {`
                @keyframes green-fire {
                    0% { box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; }
                    50% { box-shadow: 0 0 25px #33ff33, 0 0 40px #ccff00; }
                    100% { box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; }
                }
                `}
            </style>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md p-8 rounded-sm shadow-[10px_10px_0_#000] border-4 border-[#262220] text-center"
                style={WOOD_STYLE}>

                {/* Skull Icon with Fire Animation */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20">
                    <img
                        src={HORSE_ICON_URL}
                        alt="Ghost Horse Skull"
                        className="w-32 h-32 rounded-full border-4 border-[#1a1614] object-cover bg-black"
                        style={{ animation: 'green-fire 2s infinite alternate' }}
                    />
                </div>

                <div className="mb-8 border-b-4 border-rust pb-4 mt-12 w-full text-center">
                    <h1 className="font-black text-3xl sm:text-4xl mb-2 text-[#dcb878] uppercase tracking-widest font-serif w-full" style={{ textShadow: '2px 2px 0 #000' }}>
                        MEZZANOTTE
                    </h1>
                    <h2 className="font-bold text-lg sm:text-xl text-rust tracking-[0.5em] uppercase w-full">Al Ranch</h2>
                </div>

                <p className="mb-8 text-[#e6dcc3] font-serif text-lg leading-relaxed italic">
                    "Benvenuti al Ranch Maledetto. <br />Identificate la vostra banda."
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nome in Codice"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1a1614] border-2 border-[#5a3a2a] p-4 text-center text-[#dcb878] font-black uppercase tracking-widest placeholder-[#5a3a2a] focus:outline-none focus:border-rust transition-all"
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <Lock size={20} className="text-[#5a3a2a]" />
                        </div>
                    </div>

                    {error && <p className="text-blood font-bold uppercase tracking-wider text-sm animate-pulse bg-[#1a1614] p-2 border border-blood">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-rust hover:bg-blood text-paper-light font-black uppercase tracking-[0.2em] py-4 transition-all border-2 border-transparent hover:border-paper shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none"
                    >
                        Entra nel Caso
                    </button>
                </form>
            </div>


            <FogEffect />
        </div>
    );
}

// --- MODAL COMPONENT ---

const ClueModal = ({ clue, onClose }) => {
    if (!clue) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg p-6 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#262220] max-h-[90vh] overflow-y-auto"
                style={WOOD_STYLE}>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#dcb878] hover:text-rust transition-colors bg-[#1a1614] p-1 border border-[#5a3a2a]"
                >
                    <X size={24} />
                </button>

                <div className="mb-6 border-b-2 border-[#5a3a2a] pb-4 pr-10">
                    <span className="bg-rust text-paper-light px-3 py-1 text-xs font-bold uppercase tracking-widest inline-block mb-2">
                        {clue.type === 'object' ? 'Reperto' : clue.type === 'document' ? 'Documento' : 'Testimonianza'}
                    </span>
                    <h3 className="font-black text-2xl text-[#dcb878] font-serif mt-1">{clue.title}</h3>
                </div>

                {/* Evidence Image */}
                {clue.image && (
                    <div className="mb-6 p-2 bg-[#1a1614] border border-[#5a3a2a] rotate-1 shadow-md">
                        <img
                            src={clue.image}
                            alt={clue.title}
                            className="w-full h-48 object-cover sepia-50 brightness-90 contrast-125"
                        />
                    </div>
                )}

                <div className="bg-[#1a1614] p-4 text-[#e6dcc3] font-mono text-sm leading-relaxed border border-[#5a3a2a] shadow-inner mb-4">
                    {clue.content}
                </div>

                {/* Detail Section */}
                <div className="bg-[#3e2b22] px-3 py-2 border-l-4 border-rust">
                    <p className="text-[#dcb878] font-bold text-xs font-serif uppercase tracking-wider">Dettagli Nascosti:</p>
                    <p className="text-paper-light text-xs italic font-mono mt-1">{clue.detail}</p>
                </div>

            </div>
        </div>
    );
};


// --- TABS ---

const StoryTab = ({ teamName }) => {
    const [openChar, setOpenChar] = useState(null);

    return (
        <div className="p-4 pb-24 pt-20 space-y-8 animate-fadeIn">


            {/* Intro Card - Wood Texture */}
            <div className="p-6 rounded-sm shadow-[8px_8px_0_#000] border-4 border-[#262220] relative"
                style={WOOD_STYLE}>

                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blood text-paper-light px-6 py-2 text-sm font-black tracking-[0.2em] uppercase shadow-[3px_3px_0_#000] border-2 border-[#262220] skew-x-[-10deg]">
                    Il Crimine
                </div>
                <h3 className="font-black text-4xl mb-4 text-[#dcb878] text-center mt-4 border-b-4 border-[#5a3a2a] pb-2 font-serif" style={{ textShadow: '1px 1px 0 #000' }}>
                    MEZZANOTTE AL RANCH
                </h3>
                {/* Team Subtitle */}
                <div className="bg-[#1a1614] text-[#dcb878] inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-[0.2em] transform -rotate-2 border-2 border-[#5a3a2a] shadow-sm">
                    Caccia aperta per: {teamName}
                </div>
                <div className="bg-[#1a1614] p-4 transform -rotate-1 shadow-sm mb-4 border border-[#5a3a2a]">
                    <p className="font-bold italic text-[#e6dcc3] text-sm leading-relaxed text-justify font-serif">
                        "Fuori, il cielo è nero come la coscienza di un impiccato. La pioggia trasforma la terra rossa in fango che inghiotte speranze."
                    </p>
                </div>
                <p className="text-paper-light text-sm leading-relaxed font-bold text-justify font-mono bg-[#3e2b22] p-3 border-2 border-rust">
                    Cyrus Vane è morto. Il petto sfondato in una stalla chiusa a chiave.
                    Un lampo ha mostrato un'ombra gigantesca. Un cavallo fantasma?
                    O qualcuno tra voi mente?
                </p>
            </div>

            {/* Suspects Grid */}
            <div className="grid grid-cols-1 gap-4">
                {CHARACTERS.map(char => (
                    <div key={char.id} className="border-4 border-[#262220] shadow-[5px_5px_0_#000] overflow-hidden group" style={WOOD_STYLE}>
                        <button
                            onClick={() => setOpenChar(openChar === char.id ? null : char.id)}
                            className="w-full flex items-center text-left"
                        >
                            <div className="w-20 h-20 bg-[#1a1614] flex-shrink-0 border-r-4 border-[#262220] flex items-center justify-center">
                                <span className="text-4xl filter sepia contrast-125">{char.image}</span>
                            </div>
                            <div className="p-4 flex-grow flex items-center justify-between">
                                <h4 className="font-black text-xl uppercase tracking-wider text-[#dcb878] font-serif pr-2 group-hover:text-rust transition-colors">
                                    {char.name}
                                </h4>
                                {openChar === char.id ? <ChevronUp className="text-rust" /> : <ChevronDown className="text-[#5a3a2a]" />}
                            </div>
                        </button>

                        {openChar === char.id && (
                            <div className="p-4 bg-[rgba(0,0,0,0.3)] border-t-4 border-[#262220] text-[#e6dcc3] text-sm font-mono leading-relaxed animate-slideDown">
                                <p className="mb-2"><strong className="text-rust uppercase tracking-wider">Ruolo:</strong> {char.role}</p>
                                <p className="italic opacity-90">{char.desc}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CluesTab = ({ unlockedClues, onUnlock }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState(null);
    const [selectedClue, setSelectedClue] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // --- QR Logic ---
    const handleScan = (result, error) => {
        if (result) {
            verifyCode(result?.text);
        }
        if (error) {
            // Minimal feedback or ignore as per request
            // console.info(error); 
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        verifyCode(manualCode);
    };

    const verifyCode = (code) => {
        const clue = CLUES_DB.find(c => c.code === code);
        if (clue) {
            if (!unlockedClues.includes(clue.id)) {
                onUnlock(clue.id);
                setNotification(`Nuovo Indizio: ${clue.title}`);
                setSelectedClue(clue); // Auto open
                setTimeout(() => setNotification(null), 3000);
            } else {
                setError("Indizio già scoperto.");
                setTimeout(() => setError(''), 2000);
            }
            setManualCode('');
            setIsScanning(false);
        } else {
            setError("Codice errato.");
            setTimeout(() => setError(''), 2000);
        }
    };

    const handleOpenClue = (clue) => {
        setSelectedClue(clue);
    };

    return (
        <div className="p-4 pb-24 min-h-screen relative">

            {/* Modal for Clue Details */}
            {selectedClue && (
                <ClueModal clue={selectedClue} onClose={() => setSelectedClue(null)} />
            )}

            {/* Scanner Overlay - Sepia/Old Photo Style */}
            {isScanning && (
                <div className="fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center">
                    <div className="relative w-full h-full flex flex-col bg-black">

                        {/* QR READER with SEPIA Filter */}
                        <div className="w-full h-full relative overflow-hidden">
                            <QrReader
                                onResult={handleScan}
                                constraints={{ facingMode: 'environment' }}
                                videoContainerStyle={{ paddingTop: 0, height: '100%' }}
                                videoStyle={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'sepia(0.5) contrast(1.1) brightness(1.1) grayscale(0)'
                                }}
                                ViewFinder={() => null} // No default viewfinder
                            />
                        </div>

                        {/* Old Photo Overlay Effects - Reduced opacity/interference */}
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.6)_100%)] z-10"></div>
                        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] z-10"></div>
                        <div className="absolute inset-0 pointer-events-none border-[20px] border-ink opacity-90 z-10"></div>


                        {/* UI */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                            <div className="w-64 h-64 border-[3px] border-paper rounded-sm relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-rust"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-rust"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-rust"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-rust"></div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1 h-4 bg-rust opacity-50"></div>
                                    <div className="h-1 w-4 bg-rust absolute opacity-50"></div>
                                </div>
                            </div>
                            <p className="mt-8 text-paper-light font-black font-serif bg-charcoal px-4 py-2 rounded-sm border border-rust uppercase tracking-widest shadow-lg skew-x-[-5deg]">Inquadra Codice</p>
                        </div>

                        <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-4 p-4 z-50">
                            {error && (
                                <div className="bg-blood text-paper-light p-3 rounded-sm border border-[#3e2b22] mb-4 text-center text-sm max-w-xs font-bold shadow-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={() => setIsScanning(false)}
                                className="bg-paper text-[#3e2b22] px-8 py-3 rounded-sm font-black shadow-[4px_4px_0_#262220] border-2 border-charcoal uppercase tracking-[0.2em] text-sm hover:bg-[#c5a065] transition-all"
                            >
                                Chiudi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-8">
                {/* Controls */}
                <div className="bg-[#c5a065] p-6 rounded-sm shadow-[8px_8px_0_#262220] border-4 border-charcoal relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                    <div className="relative z-10">
                        <h3 className="text-charcoal font-serif font-black uppercase tracking-widest text-center mb-6 text-lg" style={{ textShadow: '1px 1px 0 #e6dcc3' }}>Ricerca Prove</h3>

                        <button
                            onClick={() => setIsScanning(true)}
                            className="w-full bg-rust hover:bg-[#964b2e] text-paper-light py-4 px-4 rounded-sm font-serif uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 transition-all shadow-[4px_4px_0_#262220] active:translate-y-1 active:shadow-[2px_2px_0_#262220] border-4 border-charcoal mb-8"
                        >
                            <Camera size={28} strokeWidth={3} />
                            Apri Scanner
                        </button>

                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="h-1 bg-charcoal flex-1 opacity-50"></div>
                            <span className="text-xs uppercase text-[#3e2b22] font-black bg-paper px-3 py-1 border border-charcoal skew-x-[-10deg]">Oppure inserisci codice</span>
                            <div className="h-1 bg-charcoal flex-1 opacity-50"></div>
                        </div>

                        <form onSubmit={handleManualSubmit} className="flex gap-3">
                            <input
                                type="tel"
                                maxLength="2"
                                placeholder="##"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                className="w-28 bg-[#3e2b22] border-4 border-rust text-paper text-center font-mono text-3xl rounded-sm p-2 focus:border-paper outline-none placeholder-[#5a483c] font-bold shadow-inner"
                            />
                            <button
                                type="submit"
                                className="flex-1 bg-charcoal hover:bg-[#3e2b22] text-paper border-4 border-rust py-2 rounded-sm font-serif uppercase text-sm tracking-widest font-black shadow-[4px_4px_0_#3e2b22] active:translate-y-1 active:shadow-[2px_2px_0_#3e2b22] transition-all"
                            >
                                Decodifica
                            </button>
                        </form>
                        {error && !isScanning && <p className="text-paper-light text-sm mt-4 text-center font-bold bg-blood py-2 border-2 border-charcoal shadow-[3px_3px_0_#262220]">{error}</p>}
                    </div>
                </div>

                {/* Clue List */}
                <div>
                    <h3 className="font-black text-2xl text-paper mb-6 border-l-8 border-rust pl-4 uppercase tracking-wider font-serif" style={{ textShadow: '2px 2px 0 #262220' }}>
                        Reperti
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        {CLUES_DB.map((clue) => {
                            const isUnlocked = unlockedClues.includes(clue.id);
                            return (
                                <button
                                    key={clue.id}
                                    onClick={() => isUnlocked ? handleOpenClue(clue) : null}
                                    className={`
                                    relative aspect-square border-4 flex flex-col items-center justify-center p-4 text-center transition-all duration-300 group
                                    ${isUnlocked
                                            ? 'border-[#dcb878] bg-black/40 hover:bg-black/60 shadow-[0_0_15px_rgba(220,184,120,0.2)] hover:scale-[1.02] cursor-pointer'
                                            : 'border-[#5a3a2a] bg-black/20 opacity-70 cursor-not-allowed border-dashed'
                                        }
                                `}
                                >
                                    {/* Eye Icon (Top Right) */}
                                    <div className="absolute top-2 right-2">
                                        {isUnlocked ? (
                                            <Eye size={20} className="text-[#dcb878] drop-shadow-[0_2px_0_#000]" />
                                        ) : (
                                            <Lock size={20} className="text-[#5a3a2a] drop-shadow-[0_1px_0_#000]" />
                                        )}
                                    </div>

                                    {/* Main Icon (Center) */}
                                    <div className="flex-1 flex items-center justify-center transform transition-transform group-hover:scale-110">
                                        <span className={`text-5xl block filter drop-shadow-[0_4px_0_#000] ${isUnlocked ? 'sepia contrast-125' : 'grayscale brightness-50'}`}>
                                            {isUnlocked ? clue.imagePlaceholder : '🔒'}
                                        </span>
                                    </div>

                                    {/* Title (Bottom) */}
                                    <div className="mt-auto w-full">
                                        <span className={`font-black text-xs uppercase tracking-widest font-serif block truncate ${isUnlocked ? 'text-[#dcb878]' : 'text-[#5a3a2a]'}`} style={{ textShadow: '1px 1px 0 #000' }}>
                                            {isUnlocked ? clue.title : `Riservato #${clue.id}`}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Global Notification */}
            {notification && (
                <div className="fixed top-24 left-4 right-4 bg-rust text-paper-light p-4 rounded-sm shadow-[8px_8px_0_#262220] z-50 animate-bounce text-center font-serif border-4 border-charcoal transform rotate-2">
                    <h4 className="font-black text-xl uppercase tracking-widest" style={{ textShadow: '2px 2px 0 #262220' }}>Ritrovamento!</h4>
                    <p className="text-base font-bold mt-1">{notification}</p>
                </div>
            )}
        </div>
    );
};

const AccuseTab = ({ characters, teamName }) => {
    const [selectedSuspect, setSelectedSuspect] = useState('');
    const [motive, setMotive] = useState('');
    const [weapon, setWeapon] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        const suspectDetails = characters.find(c => c.id === selectedSuspect);

        return (
            <div className="p-4 pb-24 pt-20 flex flex-col items-center min-h-screen text-center animate-fadeIn relative overflow-hidden bg-[#1a1614]">
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

                {/* WANTED POSTER */}
                <div className="relative w-full max-w-sm p-6 shadow-[10px_10px_0_#262220] border-4 border-[#262220] text-center transform rotate-1 relative z-10"
                    style={WOOD_STYLE}>
                    {/* Header */}
                    <div className="border-b-4 border-[#5a3a2a] pb-4 mb-6">
                        <h1 className="font-black text-5xl text-[#dcb878] tracking-widest uppercase font-serif" style={{ textShadow: '2px 2px 0 #000' }}>WANTED</h1>
                        <p className="font-bold font-mono text-blood text-sm tracking-[0.5em] uppercase mt-2">Dead or Alive</p>
                    </div>

                    {/* Suspect */}
                    <div className="bg-[#1a1614] p-2 inline-block shadow-[5px_5px_0_#000] mb-4 transform -rotate-1 border border-[#5a3a2a]">
                        <div className="w-32 h-32 bg-[#2c1a0e] flex items-center justify-center border-2 border-[#5a3a2a] relative overflow-hidden">
                            <span className="text-7xl filter sepia contrast-125 drop-shadow-lg">{suspectDetails?.image}</span>
                        </div>
                    </div>
                    <h2 className="font-black text-2xl text-[#dcb878] uppercase font-serif tracking-wider mb-6 underline decoration-rust decoration-4 underline-offset-4" style={{ textShadow: '1px 1px 0 #000' }}>
                        {suspectDetails?.name}
                    </h2>

                    {/* Details */}
                    <div className="text-left space-y-3 bg-[#1a1614] p-4 border-2 border-[#5a3a2a] shadow-inner font-mono text-sm relative">
                        <div className="absolute -top-3 -left-3 bg-blood text-paper px-2 py-1 text-xs font-bold uppercase tracking-wider transform -skew-x-12 border border-[#262220]">
                            Dettagli Crimine
                        </div>
                        <div className="mt-2">
                            <span className="font-black text-rust uppercase mr-2 text-xs">Movente:</span>
                            <span className="font-bold text-[#e6dcc3] block border-b border-dashed border-[#5a3a2a] pb-1 text-xs">{motive}</span>
                        </div>
                        <div>
                            <span className="font-black text-rust uppercase mr-2 text-xs">Arma:</span>
                            <span className="font-bold text-[#e6dcc3] block border-b border-dashed border-[#5a3a2a] pb-1 text-xs">{weapon}</span>
                        </div>
                    </div>

                </div>

                <div className="mt-12 text-center relative z-10 w-full px-8">
                    <p className="text-paper-light font-mono text-xs bg-charcoal p-3 shadow-[4px_4px_0_#b05a39] border border-rust leading-relaxed">
                        "La vostra accusa è stata registrata. Se avete ragione, sarete ricompensati. Se avete torto... il deserto è grande."
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 pb-24 relative">
            <div className="border-4 border-[#262220] p-2 shadow-[10px_10px_0_#1a1614] relative overflow-hidden"
                style={WOOD_STYLE}>

                <div className="border-4 border-rust p-4 h-full relative z-10">
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#1a1614] text-[#dcb878] px-8 py-2 text-sm font-black tracking-[0.2em] uppercase shadow-[5px_5px_0_#000] border-2 border-rust skew-x-[-10deg]" style={{ fontFamily: '"Rye", serif' }}>
                        Mandato d'Arresto
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 mt-16">

                        <div>
                            <label className="block font-serif text-[#dcb878] font-black mb-4 uppercase text-sm tracking-[0.2em] border-b-4 border-rust pb-2 inline-block">
                                L'Assassino
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {characters.map(char => (
                                    <button
                                        key={char.id}
                                        type="button"
                                        onClick={() => setSelectedSuspect(char.id)}
                                        className={`flex items-center p-3 border-2 transition-all ${selectedSuspect === char.id
                                            ? 'bg-rust text-paper border-paper shadow-[3px_3px_0_#000] translate-x-1 translate-y-1'
                                            : 'bg-[#1a1614] border-[#5a3a2a] text-[#9c8c74] hover:border-rust hover:text-rust'
                                            }`}
                                    >
                                        <span className="text-2xl mr-4 filter sepia">{char.image}</span>
                                        <span className="font-black uppercase tracking-wider font-serif">{char.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block font-serif text-[#dcb878] font-black mb-4 uppercase text-sm tracking-[0.2em] border-b-4 border-rust pb-2 inline-block">
                                Il Movente
                            </label>
                            <textarea
                                required
                                value={motive}
                                onChange={(e) => setMotive(e.target.value)}
                                placeholder="SCRIVI QUI LE MOTIVAZIONI..."
                                className="w-full h-32 bg-charcoal border-4 border-rust p-4 text-paper font-bold font-mono rounded-sm focus:border-paper outline-none resize-none shadow-inner placeholder-[#5a483c] uppercase"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block font-serif text-[#dcb878] font-black mb-4 uppercase text-sm tracking-[0.2em] border-b-4 border-rust pb-2 inline-block">
                                L'Arma / Metodo
                            </label>
                            <input
                                required
                                type="text"
                                value={weapon}
                                onChange={(e) => setWeapon(e.target.value)}
                                placeholder="ES. VELENO, COLTELLO, MAGIA..."
                                className="w-full bg-charcoal border-4 border-rust p-4 text-paper font-bold font-mono rounded-sm focus:border-paper outline-none shadow-inner placeholder-[#5a483c] uppercase"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedSuspect || !motive || !weapon}
                            className={`w-full py-4 font-black uppercase tracking-[0.3em] transition-all border-4 shadow-[5px_5px_0_#000] relative overflow-hidden ${!selectedSuspect || !motive || !weapon
                                ? 'bg-[#1a1614] text-[#5a3a2a] border-[#3e2b22] cursor-not-allowed'
                                : 'bg-rust text-paper border-[#262220] hover:bg-blood hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <PenTool size={20} />
                                Firma Condanna
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
    const [activeTab, setActiveTab] = useState('story');
    const [unlockedClues, setUnlockedClues] = useState([]);
    const [userTeam, setUserTeam] = useState(null);

    // Load state from local storage (persistence)
    useEffect(() => {
        const savedClues = localStorage.getItem('ranch_clues');
        if (savedClues) {
            setUnlockedClues(JSON.parse(savedClues));
        }

        const savedTeam = localStorage.getItem('ranch_team');
        if (savedTeam) {
            setUserTeam(JSON.parse(savedTeam));
        }
    }, []);

    const handleUnlock = (clueId) => {
        const newUnlocked = [...unlockedClues, clueId];
        setUnlockedClues(newUnlocked);
        localStorage.setItem('ranch_clues', JSON.stringify(newUnlocked));
    };

    const handleLogin = (team) => {
        setUserTeam(team);
        localStorage.setItem('ranch_team', JSON.stringify(team));
    };

    if (!userTeam) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-ink text-paper font-sans selection:bg-rust selection:text-paper-light overflow-x-hidden">
            {/* Main Comic Panel Background with Muted Sunset Gradient */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'linear-gradient(to bottom, #1a1614 0%, #3e2b22 50%, #5a3a2a 100%)' }}></div>

            {/* Comic Texture Overlays for Opaque Feel */}
            <div className="fixed inset-0 pointer-events-none opacity-30 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[url('https://www.transparenttextures.com/patterns/halftone.png')]"></div>
            <div className="fixed inset-0 pointer-events-none opacity-10 z-0 bg-[url('https://www.transparenttextures.com/patterns/crissxcross.png')] mix-blend-multiply"></div>


            {/* Vignette & Border */}
            <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_20%,#1a1614_100%)] opacity-80"></div>
            <div className="fixed inset-0 pointer-events-none z-50 border-[12px] border-charcoal"></div>


            <Header />

            <main className="relative z-20 max-w-md mx-auto min-h-screen shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-transparent pb-20">
                {activeTab === 'story' && <StoryTab teamName={userTeam.name} />}
                {activeTab === 'clues' && <CluesTab unlockedClues={unlockedClues} onUnlock={handleUnlock} />}
                {activeTab === 'accuse' && <AccuseTab characters={CHARACTERS} teamName={userTeam.name} />}
            </main>

            <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
            <FogEffect />
        </div>
    );
}
