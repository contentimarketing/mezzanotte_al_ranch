import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
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
        image: '/personaggi/lola.jpg'
    },
    {
        id: 'silenzio',
        name: '"Silenzio"',
        role: 'Il Cacciatore',
        desc: "Nessuno sa il suo vero nome. È arrivato giorni fa su un cavallo nero, con la polvere di tre stati addosso. Non ordina da bere, non parla. È chiaramente un cacciatore di taglie. Si vocifera seguisse Vane da tempo. Era qui per catturarlo... o per finirlo?",
        image: '/personaggi/silenzio.jpg'
    },
    {
        id: 'buck',
        name: 'Buck Miller',
        role: 'L\'Ex Padrone',
        desc: "L'uomo che ha costruito questo posto asse dopo asse. Fino a ieri era il suo regno, oggi è un ospite sgradito. Vane gli ha preso il ranch, i cavalli e l'orgoglio per un pugno di debiti. Ha il cuore spezzato e il fegato pieno di rabbia e bourbon.",
        image: '/personaggi/buck-miller.jpg'
    },
    {
        id: 'corvo',
        name: 'Corvo Grigio',
        role: 'Lo Stalliere',
        desc: "Lavora nelle ombre delle scuderie. Sente cose che noi non sentiamo. Dice che sotto le stalle dormono gli spiriti dei suoi antenati e che il 'Cavallo di Fuoco' è venuto a punire l'uomo bianco. Vane lo trattava come un cane, ma Corvo Grigio non ha mai abbassato la testa.",
        image: '/personaggi/corvo-grigio.jpg'
    },
    {
        id: 'higgins',
        name: 'Sceriffo Higgins',
        role: 'La Legge',
        desc: "Lo chiamano 'Iron', ferro... ma sembra più ruggine. Vane lo teneva al guinzaglio pagando i suoi vizi per chiudere un occhio. Ma forse i pagamenti erano finiti. E forse, Higgins ha deciso che era meglio un padrone morto che una carriera finita.",
        image: '/personaggi/sceriffo-higgings.jpg'
    }
];

const CLUES_DB = [
    {
        id: 1,
        code: '12',
        title: 'Il Volantino',
        type: 'Indizio Fisico',
        content: "Un vecchio poster circense trovato nella bacheca. Ritrae un mago in smoking e una donna familiare...",
        detail: "TESTO DEL POSTER: 'Il Grande Illusionista Mysterio e la sua assistente! - Lo Spettacolo Imperdibile'",
        imagePlaceholder: "🎪",
        image: "/indizi/volantino.jpg"
    },
    {
        id: 2,
        code: '34',
        title: 'Telegramma',
        type: 'Documento',
        content: "Una striscia di carta da telegrafo incastrata nei raggi di un carro.",
        detail: "TESTO: 'Vane ricercato per diserzione. STOP. Portalo al forte VIVO. STOP. Pagamento alla consegna.'",
        imagePlaceholder: "📜",
        image: "/indizi/telegramma.jpg"
    },
    {
        id: 3,
        code: '56',
        title: 'La Lettera',
        type: 'Documento',
        content: "Una lettera spiegazzata trovata nella cassetta di pulizia dei cavalli.",
        detail: "TESTO: 'Signor Miller, domani le ruspe abbatteranno la stalla centrale. Se oppone resistenza, le porteremo via tutto, anche gli effetti personali.'",
        imagePlaceholder: "⚖️",
        image: "/indizi/sfratto.jpg"
    },
    {
        id: 4,
        code: '78',
        title: 'Manoscritto',
        type: 'Oggetto Personale',
        content: "Una pagina di diario nascosta nel fieno.",
        detail: "TESTO: 'Ho usato la polvere luminosa e la salvia per il rituale sacro di stasera. Gli spiriti vedranno, gli uomini temeranno.'",
        imagePlaceholder: "📓",
        image: "/indizi/rituale.jpg"
    },
    {
        id: 5,
        code: '90',
        title: 'Libro Mastro',
        type: 'Contabilità',
        content: "Una pagina di contabilità trovata all'ingresso della zona cena.",
        detail: "LISTA PAGAMENTI: 'Higgins - $50 (Silenzio su rissa)', 'Higgins - $100 (Ignorare confini)'. NOTA A MARGINE: 'Vane minaccia di parlare se gli chiedo altri soldi.'",
        imagePlaceholder: "💰",
        image: "/indizi/libro.jpg"
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
            /* Keyframes - Slightly Reduced Density */
            @keyframes foglayer_01_opacity {
                0% { opacity: .2; }
                22% { opacity: .6; }
                40% { opacity: .4; }
                58% { opacity: .5; }
                80% { opacity: .3; }
                100% { opacity: .2; }
            }
            @keyframes foglayer_02_opacity {
                0% { opacity: .5; }
                25% { opacity: .2; }
                50% { opacity: .1; }
                80% { opacity: .4; }
                100% { opacity: .5; }
            }
            @keyframes foglayer_03_opacity {
                0% { opacity: .65; }
                27% { opacity: .2; }
                52% { opacity: .5; }
                68% { opacity: .3; }
                100% { opacity: .65; }
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
                background-size: 50% auto; /* Dense fog effect */
                background-repeat: repeat; /* Repeat for density */
                background-color: transparent;
                /* Tint to Light Teal/White - Slightly dimmer brightness */
                filter: brightness(1.5) drop-shadow(0 0 10px #ccfbf1); 
            }
            
            /* Layer Specifics - Slower & Smoother */
            .fog-layer-01 {
                animation: foglayer_01_opacity 12s linear infinite, foglayer_moveme 45s linear infinite;
            }
            .fog-layer-01 .fog-image-01, .fog-layer-01 .fog-image-02 {
                background-image: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog1.png");
            }

            .fog-layer-02 {
                animation: foglayer_02_opacity 22s linear infinite, foglayer_moveme 35s linear infinite;
            }
            .fog-layer-02 .fog-image-01, .fog-layer-02 .fog-image-02 {
                background-image: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png");
            }

            /* Adjust mobile speed and opacity for performance/look */
            @media (max-width: 768px) {
                .fog-layer-01 { animation-duration: 12s, 40s; }
                .fog-layer-02 { animation-duration: 22s, 30s; }
                .fog-layer-03 { animation-duration: 28s, 25s; }
            }

            .fog-layer-03 {
                animation: foglayer_03_opacity 20s linear infinite, foglayer_moveme 10s linear infinite;
                z-index: 1;
            }
            .fog-layer-03 .fog-image-01, .fog-layer-03 .fog-image-02 {
                background-image: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png");
            }
            `}
        </style>

        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full mix-blend-screen opacity-100">
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
    <header className="fixed top-0 left-0 w-full z-[100] bg-charcoal opacity-100 shadow-[0_10px_20px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
        {/* Full width container, removed max-w-7xl for strict full width */}
        <div className="w-full px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-y-2 relative z-10">
            <div className="flex items-center gap-4">
                <img
                    src={HORSE_ICON_URL}
                    alt="Skull Icon"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#67e8f9] object-cover shrink-0"
                    style={{ animation: 'green-fire 2s infinite alternate', boxShadow: '0 0 8px #67e8f9, 0 0 20px rgba(103, 232, 249, 0.3)' }}
                />
                <div>
                    <h1 className="font-black text-xl sm:text-3xl tracking-[0.15em] uppercase text-rust font-serif leading-none" style={{ textShadow: '1px 1px 0 #000' }}>
                        MEZZANOTTE
                    </h1>
                    <p className="text-[10px] sm:text-xs text-[#9c8c74] font-bold uppercase tracking-[0.3em] mt-1">Orrore al Ranch</p>
                </div>
            </div>
            <div className="text-right relative z-10 shrink-0 block">
                <p className="text-[10px] sm:text-xs text-[#ff7f50] font-mono tracking-wider font-bold">CASO #1908</p>
                <p className="text-[10px] sm:text-xs text-blood font-black font-mono uppercase">Vittima: Vane</p>
            </div>
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
        <nav className="fixed bottom-0 left-0 w-full z-[100] bg-charcoal opacity-100 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.7)]">
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
            <div className="w-full max-w-md mx-auto grid grid-cols-3 h-20 relative z-10">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative z-10 ${activeTab === tab.id
                            ? 'text-paper bg-[#3a3028] -mt-1 shadow-inner'
                            : 'text-[#8a7a6a] hover:text-rust'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-[10px] sm:text-xs mt-1 font-black uppercase tracking-widest font-serif">{tab.label}</span>
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
        <div className="flex flex-col items-center justify-center p-6 text-paper relative overflow-hidden min-h-screen">
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
                        className="w-32 h-32 rounded-full border-4 border-[#67e8f9] object-cover bg-black"
                        style={{ animation: 'green-fire 2s infinite alternate', boxShadow: '0 0 10px #67e8f9, 0 0 25px rgba(103, 232, 249, 0.4)' }}
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

const ClueModal = ({ clue, onClose, onImageClick }) => {
    if (!clue) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg p-6 relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#262220] max-h-[85vh] overflow-y-auto overscroll-contain"
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
                            className="w-full h-48 object-cover sepia-50 brightness-90 contrast-125 cursor-pointer hover:scale-[1.02] transition-transform"
                            onClick={() => onImageClick && onImageClick(clue.image)}
                        />
                    </div>
                )}

                <div className="bg-[#1a1614] p-4 text-[#e6dcc3] font-mono text-sm leading-relaxed border border-[#5a3a2a] shadow-inner mb-4">
                    {clue.content}
                </div>

                {/* Detail Section */}
                <div className="bg-[#3e2b22] px-3 py-2 border-l-4 border-rust mb-6">
                    <p className="text-[#dcb878] font-bold text-xs font-serif uppercase tracking-wider">Dettagli Nascosti:</p>
                    <p className="text-paper-light text-xs italic font-mono mt-1">{clue.detail}</p>
                </div>

                {/* Extra spacer for mobile scrolling */}
                <div className="h-12 w-full"></div>

            </div>
        </div>
    );
};

const ImageModal = ({ image, onClose }) => {
    if (!image) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="relative max-w-full max-h-full flex flex-col items-center">
                <img
                    src={image}
                    alt="Ingrandimento"
                    className="max-w-full max-h-[80vh] object-contain border-4 border-[#b05a39] shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm"
                    onClick={(e) => e.stopPropagation()}
                />
                <button
                    onClick={onClose}
                    className="mt-6 bg-[#b05a39] text-paper-light px-8 py-2 font-black uppercase tracking-widest shadow-lg border-2 border-[#5a3a2a]"
                >
                    Chiudi
                </button>
            </div>
        </div>
    );
};

const TextModal = ({ title, content, onClose }) => {
    if (!content) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-[#e6dcc3] p-1 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#262220] flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-[#262220] p-4 flex justify-between items-center border-b-4 border-[#b05a39]">
                    <h3 className="text-[#dcb878] font-black font-serif uppercase tracking-widest text-lg">{title}</h3>
                    <button onClick={onClose} className="text-[#b05a39] hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] font-mono text-sm leading-relaxed text-[#262220]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {content}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#1a1614] border-t-4 border-[#262220] text-center">
                    <button
                        onClick={onClose}
                        className="bg-[#b05a39] text-paper-light px-8 py-2 font-black uppercase tracking-widest shadow-lg border-2 border-[#5a3a2a] hover:bg-rust transition-colors"
                    >
                        Chiudi Rapporto
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- TABS ---

const StoryTab = ({ teamName }) => {
    const [openChar, setOpenChar] = useState(null);
    const [viewingImage, setViewingImage] = useState(null);

    return (
        <div className="space-y-8 animate-fadeIn">

            {viewingImage && (
                <ImageModal image={viewingImage} onClose={() => setViewingImage(null)} />
            )}

            {/* Intro Card - Wood Texture */}
            <div className="p-6 rounded-sm shadow-[8px_8px_0_#000] border-4 border-[#262220] relative"
                style={WOOD_STYLE}>

                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#b05a39] text-paper-light px-6 py-2 text-sm font-black tracking-[0.2em] uppercase shadow-[3px_3px_0_#000] border-2 border-[#262220] skew-x-[-10deg] whitespace-nowrap">
                    Il Crimine
                </div>
                <h3 className="font-black text-4xl mb-4 text-[#dcb878] text-center mt-4 border-b-4 border-[#5a3a2a] pb-2 font-serif" style={{ textShadow: '1px 1px 0 #000' }}>
                    MEZZANOTTE AL RANCH
                </h3>
                {/* Team Subtitle */}
                <div className="w-full text-center mb-6">
                    <p className="text-[#dcb878] text-xs font-black uppercase tracking-[0.2em] font-serif">
                        Caccia aperta per: {teamName}
                    </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CHARACTERS.map(char => (
                    <div key={char.id} className="border-4 border-[#262220] shadow-[5px_5px_0_#000] overflow-hidden group" style={WOOD_STYLE}>
                        <div
                            className="w-full flex items-center text-left cursor-pointer"
                            onClick={() => setOpenChar(openChar === char.id ? null : char.id)}
                        >
                            <div
                                className="w-32 h-32 bg-[#1a1614] flex-shrink-0 border-r-4 border-[#262220] flex items-center justify-center overflow-hidden relative group-hover:brightness-110 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setViewingImage(char.image);
                                }}
                            >
                                <img src={char.image} alt={char.name} className="w-[120%] h-[120%] object-cover filter sepia contrast-125 hover:scale-125 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                                <div className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full border border-[#dcb878]">
                                    <Search size={12} className="text-[#dcb878]" />
                                </div>
                            </div>
                            <div className="p-4 flex-grow flex items-center justify-between">
                                <h4 className="font-black text-xl uppercase tracking-wider text-[#dcb878] font-serif pr-2 group-hover:text-rust transition-colors">
                                    {char.name}
                                </h4>
                                {openChar === char.id ? <ChevronUp className="text-rust" /> : <ChevronDown className="text-[#5a3a2a]" />}
                            </div>
                        </div>

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
    const [viewingImage, setViewingImage] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // --- QR Logic ---
    // (Old handleScan removed, logic moved to useEffect)

    const handleManualSubmit = (e) => {
        e.preventDefault();
        verifyCode(manualCode);
    };

    const verifyCode = (rawCode) => {
        // Clean up the scanned/entered code
        const code = String(rawCode).trim();

        // Try direct match first
        let clue = CLUES_DB.find(c => c.code === code);

        // If no match, try extracting just digits (QR might have extra content)
        if (!clue) {
            const digitsOnly = code.replace(/\D/g, '');
            clue = CLUES_DB.find(c => c.code === digitsOnly);
        }

        // If still no match, check if the code contains any valid clue code
        if (!clue) {
            clue = CLUES_DB.find(c => code.includes(c.code));
        }

        console.log('[QR Debug] Raw:', rawCode, '| Cleaned:', code, '| Found:', clue?.id);

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
            setError(`Codice "${code}" non valido.`);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleOpenClue = (clue) => {
        setSelectedClue(clue);
    };

    // --- HTML5 QR Scanner Logic (iOS-Compatible) ---
    useEffect(() => {
        let html5QrCode = null;
        let patchedCreateElement = false;
        const originalCreateElement = document.createElement.bind(document);

        if (isScanning) {
            const startScanner = async () => {
                try {
                    // 1. Wait for DOM to settle
                    await new Promise(r => setTimeout(r, 300));
                    if (!document.getElementById('reader')) return;

                    // 2. iOS FIX: Monkey-patch createElement to inject playsinline
                    //    BEFORE the library creates any <video> elements.
                    //    On iOS Safari, playsinline must be set at creation time,
                    //    not after the video starts playing.
                    patchedCreateElement = true;
                    document.createElement = function (tagName, options) {
                        const el = originalCreateElement(tagName, options);
                        if (tagName.toLowerCase() === 'video') {
                            el.setAttribute('playsinline', 'true');
                            el.setAttribute('webkit-playsinline', 'true');
                            el.setAttribute('muted', '');
                            el.setAttribute('autoplay', '');
                            el.playsInline = true;
                            el.muted = true;
                        }
                        return el;
                    };

                    // 3. Start html5-qrcode scanner — let it manage its own getUserMedia stream.
                    //    Do NOT call getUserMedia manually; iOS cannot handle two concurrent streams.
                    html5QrCode = new Html5Qrcode("reader");

                    await html5QrCode.start(
                        {
                            facingMode: 'environment',
                            // Richiediamo una risoluzione standard ideale, ma senza forzarla in modo bloccante (ideal vs exact)
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        },
                        {
                            fps: 10,
                            // Un qrbox calcolato dinamicamente è più sicuro del full-frame su alcuni Android
                            // Garantiamo un minimo di 200px per non far crashare la zona di crop
                            qrbox: (viewfinderWidth, viewfinderHeight) => {
                                const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                                const boxSize = Math.max(200, Math.floor(minEdge * 0.7));
                                return { width: boxSize, height: boxSize };
                            },
                            disableFlip: false
                        },
                        (decodedText) => {
                            verifyCode(decodedText);
                        },
                        () => { /* scanning... */ }
                    );

                    // iOS specific bug workaround: force video constraints after starting
                    setTimeout(async () => {
                        try {
                            if (html5QrCode.applyVideoConstraints) {
                                await html5QrCode.applyVideoConstraints({ focusMode: "continuous" }).catch(e => console.warn("applyVideoConstraints inner error", e));
                            }
                        } catch (e) {
                            console.warn("[QR Debug] applyVideoConstraints outer error:", e);
                        }

                        // Fallback: Apply directly to the video track
                        try {
                            const videoElement = document.querySelector('#reader video');
                            const track = videoElement?.srcObject?.getVideoTracks()[0];
                            if (track && track.applyConstraints) {
                                // Try advanced constraints
                                await track.applyConstraints({
                                    advanced: [{ focusMode: "continuous" }]
                                }).catch(async () => {
                                    // Try basic constraints if advanced fails
                                    await track.applyConstraints({ focusMode: "continuous" }).catch(e => console.warn("track basic constraints error", e));
                                });
                            }
                        } catch (e) {
                            console.warn("[QR Debug] track constraints error:", e);
                        }
                    }, 500); // Wait for the camera to fully initialize before forcing focus

                    // 4. Restore original createElement now that scanner is running
                    document.createElement = originalCreateElement;
                    patchedCreateElement = false;

                    // 5. Extra safety: also patch any video the library already created
                    const readerEl = document.getElementById('reader');
                    if (readerEl) {
                        const videos = readerEl.querySelectorAll('video');
                        videos.forEach(v => {
                            v.setAttribute('playsinline', 'true');
                            v.setAttribute('webkit-playsinline', 'true');
                            v.playsInline = true;
                        });
                    }

                } catch (err) {
                    // Restore createElement if we errored mid-patch
                    if (patchedCreateElement) {
                        document.createElement = originalCreateElement;
                    }
                    console.error("Error starting scanner:", err);
                    const errMsg = String(err?.message || err?.name || err || '');
                    if (errMsg.includes('Permission') || errMsg.includes('NotAllowed') || errMsg.includes('denied')) {
                        setError("Permesso fotocamera negato. Su iPhone, usa Safari e HTTPS.");
                    } else if (errMsg.includes('NotFound') || errMsg.includes('DevicesNotFound')) {
                        setError("Fotocamera non trovata. Usa il codice manuale.");
                    } else if (errMsg.includes('NotReadable') || errMsg.includes('Could not start')) {
                        setError("Fotocamera occupata. Chiudi altre app e riprova.");
                    } else {
                        setError("Errore fotocamera. Su iPhone usa Safari + HTTPS.");
                    }
                }
            };

            startScanner();
        }

        // Cleanup: stop scanner (it manages its own camera stream internally)
        return () => {
            // Restore createElement if cleanup runs while scanner is starting
            if (patchedCreateElement) {
                document.createElement = originalCreateElement;
            }
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear();
                }).catch(err => console.error("Error stopping scanner", err));
            }
        };
    }, [isScanning]);

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* Modal for Clue Details */}
            {selectedClue && (
                <ClueModal clue={selectedClue} onClose={() => setSelectedClue(null)} onImageClick={(img) => setViewingImage(img)} />
            )}

            {viewingImage && (
                <ImageModal image={viewingImage} onClose={() => setViewingImage(null)} />
            )}

            {/* Scanner Overlay - Sepia/Old Photo Style */}
            {isScanning && (
                <div className="fixed inset-0 z-50 bg-ink flex flex-col items-center justify-center">
                    <div className="relative w-full h-full flex flex-col bg-black">

                        {/* HTML5 QR READER container */}
                        <div id="reader" className="w-full h-full relative overflow-hidden bg-black [&>video]:object-cover [&>video]:w-full [&>video]:h-full">
                            {/* The library will inject the video here */}
                        </div>

                        {/* Old Photo Overlay Effects - REMOVED FOR VISIBILITY */}
                        {/* <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.6)_100%)] z-10"></div> */}
                        {/* <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] z-10"></div> */}
                        {/* <div className="absolute inset-0 pointer-events-none border-[20px] border-ink opacity-90 z-10"></div> */}


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
                            <button
                                onClick={() => setIsScanning(false)}
                                className="mt-4 pointer-events-auto bg-[#1a1614] hover:bg-[#3e2b22] text-[#dcb878] border border-[#5a3a2a] px-6 py-2 text-xs font-black uppercase tracking-widest font-serif rounded-sm shadow-md transition-all"
                            >
                                ✕ Chiudi Scanner
                            </button>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center gap-4 p-4 pb-safe z-[200] bg-gradient-to-t from-black/90 to-transparent" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 20px), 2rem)' }}>
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
                            className="w-full bg-[#b05a39] hover:bg-[#8a462c] text-paper-light py-4 px-4 rounded-sm font-serif uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3 transition-all shadow-[4px_4px_0_#262220] active:translate-y-1 active:shadow-[2px_2px_0_#262220] border-4 border-charcoal mb-8"
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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

    // Initialize state from local storage
    useEffect(() => {
        const savedAccusation = localStorage.getItem('ranch_accusation');
        if (savedAccusation) {
            const parsed = JSON.parse(savedAccusation);
            setSelectedSuspect(parsed.suspectId);
            setMotive(parsed.motive);
            setWeapon(parsed.weapon);
            setSubmitted(true);
        }
    }, []);

    const handleReset = () => {
        localStorage.removeItem('ranch_accusation');
        setSelectedSuspect('');
        setMotive('');
        setWeapon('');
        setSubmitted(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const accusationData = {
            suspectId: selectedSuspect,
            motive,
            weapon,
            submitted: true
        };

        localStorage.setItem('ranch_accusation', JSON.stringify(accusationData));
        setSubmitted(true);
    };

    const [textModalOpen, setTextModalOpen] = useState(null); // { title: '', content: '' }

    if (submitted) {
        const suspectDetails = characters.find(c => c.id === selectedSuspect);


        return (
            <div className="flex flex-col items-center justify-center animate-fadeIn relative overflow-hidden bg-transparent pb-12 pt-12">

                {textModalOpen && (
                    <TextModal
                        title={textModalOpen.title}
                        content={textModalOpen.content}
                        onClose={() => setTextModalOpen(null)}
                    />
                )}

                {/* RESULT CARD - "CONFIDENTIAL" FILE STYLE */}
                <div className="relative w-full max-w-md p-1 bg-[#e6dcc3] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform -rotate-1">

                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply z-10"></div>

                    {/* Folder Tab */}
                    <div className="absolute -top-6 left-0 bg-[#e6dcc3] px-6 py-2 rounded-t-lg border-t-2 border-l-2 border-r-2 border-[#cbbca0] font-mono text-xs font-bold text-[#5a483c] tracking-widest uppercase z-0">
                        Rapporto #001-{new Date().getFullYear()}
                    </div>

                    {/* Main Content Area */}
                    <div className="relative z-20 border-2 border-[#cbbca0] p-6 flex flex-col bg-transparent">

                        {/* Title */}
                        <h1 className="font-black text-3xl text-[#262220] uppercase font-serif mb-6 border-b-4 border-[#262220] pb-2 text-left" style={{ letterSpacing: '0.1em' }}>
                            Mandato d'Arresto
                        </h1>

                        {/* Suspect Photo & Name */}
                        <div className="flex items-start mb-6 gap-4">
                            <div className="w-24 h-24 bg-[#262220] p-1 shadow-md transform -rotate-2 flex-shrink-0">
                                <img src={suspectDetails?.image} alt="Suspect" className="w-full h-full object-cover filter sepia contrast-125" />
                            </div>
                            <div className="text-left">
                                <span className="block font-mono text-xs text-[#5a483c] uppercase mb-1">Sospettato Principale</span>
                                <h2 className="font-serif font-black text-2xl text-[#b05a39] uppercase leading-none">{suspectDetails?.name}</h2>
                            </div>
                        </div>

                        {/* Motive Section */}
                        <div className="mb-4 text-left">
                            <div className="bg-[#262220] text-[#e6dcc3] text-xs font-bold uppercase px-2 py-1 inline-block mb-1">Movente Identificato</div>
                            <div className="bg-[#fffdf5] border border-[#cbbca0] p-3 shadow-inner relative group cursor-pointer hover:border-[#b05a39] transition-colors" onClick={() => setTextModalOpen({ title: 'Movente', content: motive })}>
                                <p className="font-mono text-sm text-[#262220] line-clamp-3 leading-relaxed">
                                    {motive}
                                </p>
                                <div className="mt-2 text-[10px] font-bold text-[#b05a39] uppercase tracking-wider flex items-center gap-1">
                                    <FileText size={12} /> Clicca per leggere rapporto completo
                                </div>
                            </div>
                        </div>

                        {/* Weapon Section */}
                        <div className="mb-6 text-left">
                            <div className="bg-[#262220] text-[#e6dcc3] text-xs font-bold uppercase px-2 py-1 inline-block mb-1">Arma del Delitto</div>
                            <div className="bg-[#fffdf5] border border-[#cbbca0] p-3 shadow-inner relative group cursor-pointer hover:border-[#b05a39] transition-colors" onClick={() => setTextModalOpen({ title: 'Arma', content: weapon })}>
                                <p className="font-mono text-sm text-[#262220] line-clamp-2 leading-relaxed">
                                    {weapon}
                                </p>
                                <div className="mt-2 text-[10px] font-bold text-[#b05a39] uppercase tracking-wider flex items-center gap-1">
                                    <FileText size={12} /> Clicca per leggere rapporto completo
                                </div>
                            </div>
                        </div>

                        {/* Footer Message & Stamp */}
                        <div className="mt-2 pt-4 border-t-2 border-dashed border-[#5a483c] text-center relative overflow-hidden flex flex-col items-center">
                            <div className="transform -rotate-6 border-4 border-blood px-4 py-2 text-blood font-black text-3xl uppercase tracking-widest opacity-80 mix-blend-multiply mb-2 pointer-events-none" style={{ fontFamily: '"Rye", serif' }}>
                                COLPEVOLE
                            </div>
                            <p className="font-mono text-xs text-[#5a483c] italic mt-2">
                                "La vostra accusa è stata protocollata. Attendete il verdetto finale."
                            </p>
                        </div>

                        {/* Reset Button */}
                        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#5a483c] text-center">
                            <button
                                onClick={handleReset}
                                className="bg-charcoal hover:bg-[#3e2b22] text-[#dcb878] border-2 border-rust px-8 py-3 font-black uppercase tracking-widest font-serif text-sm shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all"
                            >
                                ↺ Modifica Accusa
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                                        <img src={char.image} alt={char.name} className="w-12 h-12 mr-4 object-cover border border-[#5a3a2a] filter sepia" />
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

        // iOS FIX: Dynamic apple-touch-icon injection (fallback)
        if (!document.querySelector('link[rel="apple-touch-icon"]')) {
            const link = document.createElement('link');
            link.rel = 'apple-touch-icon';
            link.href = '/icon.png';
            document.head.appendChild(link);
        }
    }, []);

    const handleUnlock = (clueId) => {
        setUnlockedClues(prev => {
            if (prev.includes(clueId)) return prev;
            const newUnlocked = [...prev, clueId];
            localStorage.setItem('ranch_clues', JSON.stringify(newUnlocked));
            return newUnlocked;
        });
    };

    const handleLogin = (team) => {
        setUserTeam(team);
        localStorage.setItem('ranch_team', JSON.stringify(team));
    };


    return (
        <>
            {/* === LEVEL 1: GLOBAL BACKGROUND (FIXED & FULL SCREEN) === */}
            {/* Outside everything. No max-w. No padding. */}
            <div className="fixed inset-0 z-[-1] w-full h-full overflow-hidden bg-[#1a1614]">
                {/* A. Wood Texture (Slight opacity) */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30 mix-blend-overlay"></div>

                {/* B. Spectral Color (Dark Teal) - Covers the wood */}
                <div className="absolute inset-0 bg-[#0f2e2e]/80 mix-blend-multiply"></div>

                {/* C. Atmospheric Effect (Fog/Rain) - Moved to Foreground */}
                {/* <FogEffect />  (Previously here) */}
            </div>

            {/* === LEVEL 2: CONTENT (CENTERED) === */}
            <div className="relative z-10 w-full min-h-screen flex flex-col font-sans text-[#e6dcc3]">
                {!userTeam ? (
                    <LoginScreen onLogin={handleLogin} />
                ) : (
                    <>
                        {/* Header: Full width visual, internally centered */}
                        <Header />

                        {/* Main Content: Apply width limit for text here */}
                        <main className="flex-grow w-full max-w-md mx-auto px-6 pt-32 pb-32">
                            {/* Tabs render ONLY text/buttons. No full-screen backgrounds. */}
                            {activeTab === 'story' && <StoryTab teamName={userTeam.name} />}
                            {activeTab === 'clues' && <CluesTab unlockedClues={unlockedClues} onUnlock={handleUnlock} />}
                            {activeTab === 'accuse' && <AccuseTab characters={CHARACTERS} teamName={userTeam.name} />}
                        </main>

                        {/* Footer: Full width visual */}
                        <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
                    </>
                )}
            </div>

            {/* === LEVEL 3: FOREGROUND ATMOSPHERE (OVERLAY) === */}
            <div className="fixed inset-0 z-50 pointer-events-none mix-blend-screen opacity-40">
                <FogEffect />
            </div>
        </>
    );
}
