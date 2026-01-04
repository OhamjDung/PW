import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { WireframeGlobe } from './components/WireframeGlobe';
import { EyeTrackingPortrait } from './components/EyeTrackingPortrait';
import { FloatingTextBlob } from './components/FloatingTextBlob';
import { 
  Server, Brain, Globe as GlobeIcon, 
  BarChart, X, Mail, Github, Linkedin, 
  User, BookOpen, Folder, Phone, ExternalLink
} from 'lucide-react';
import instagrAnimeImg from '../asset/anime.png';
import lockInLabsImg from '../asset/lock in labs.jpg';
import slitherImg from '../asset/slither.png';
import toyotaImg from '../asset/toyota.jpg';

/* COMPONENT: PROJECT CARD */
interface ProjectCardProps {
  title: string;
  desc: string;
  tags: string[];
  date: string;
  icon: React.ElementType;
  image: string;
  link?: string;
  onClick: () => void;
}

const ProjectCard = ({ title, desc, tags, date, icon: Icon, image, link, onClick }: ProjectCardProps) => (
  <div 
    onClick={onClick}
    className="group relative bg-black border border-[#00ff41]/20 p-6 cursor-pointer overflow-hidden transition-all hover:border-[#00ff41] flex flex-col h-full"
  >
    {/* Thumbnail Image Container */}
    <div className="w-full h-48 mb-6 border border-[#00ff41]/20 bg-black img-glitch-container z-10 relative">
      <img src={image} alt={title} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
      <div className="absolute top-2 right-2 p-2 bg-black/80 border border-[#00ff41]/30 text-[#00ff41]">
        <Icon size={20} />
      </div>
    </div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <h3 className="text-2xl font-bold text-[#00ff41] group-hover:text-white group-hover:translate-x-1 transition-all font-['VT323'] tracking-wide">{title}</h3>
      <span className="text-xs text-[#00ff41] font-['Space_Mono'] tracking-wider border border-[#00ff41] px-2 py-1">{date}</span>
    </div>
    
    <p className="text-sm text-[#00ff41]/60 mb-6 font-['Space_Mono'] leading-relaxed relative z-10 flex-grow">
      {desc}
    </p>
    
    <div className="flex flex-wrap gap-2 mb-4 relative z-10">
      {tags.map((tag, i) => (
        <span key={i} className="text-[10px] uppercase border border-[#00ff41]/30 bg-black px-2 py-1 text-[#00ff41]/70 group-hover:border-[#00ff41] group-hover:text-[#00ff41] transition-colors">
          {tag}
        </span>
      ))}
    </div>
    
    {link && (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-auto px-4 py-2 bg-[#00ff41] text-black hover:bg-[#00ff41]/80 transition-colors font-['Space_Mono'] text-xs tracking-wider flex items-center justify-center gap-2 relative z-10"
      >
        View Project
        <ExternalLink size={14} />
      </a>
    )}
  </div>
);

/* COMPONENT: CYBER ROTARY PHONE */
const RotaryPhone = () => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDial, setActiveDial] = useState<number | null>(null);
  const [status, setStatus] = useState("SECURE LINE // IDLE");
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [showFirstTimeHint, setShowFirstTimeHint] = useState(true); 

  const containerRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef(0);

  const dials = [
    { num: 1, label: 'EMAIL', icon: Mail, link: "EMAIL", desc: "INITIATE MAIL PROTOCOL" },
    { num: 2, label: 'GITHUB', icon: Github, link: "https://github.com/OhamjDung", desc: "ACCESS REPOSITORIES" },
    { num: 3, label: 'LINKEDIN', icon: Linkedin, link: "https://www.linkedin.com/in/datatompham/", desc: "PROFESSIONAL NETWORK" },
    { num: 4, label: 'PHONE', icon: Phone, link: "PHONE", desc: "CALL PROTOCOL" },
    { num: 5, label: '', icon: undefined, link: "#", desc: "" },
    { num: 6, label: '', icon: undefined, link: "#", desc: "" },
    { num: 7, label: '', icon: undefined, link: "#", desc: "" },
    { num: 8, label: '', icon: undefined, link: "#", desc: "" },
    { num: 9, label: '', icon: undefined, link: "#", desc: "" },
  ];

  const getAngle = (clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  };

  const performDialSuccess = (index: number) => {
    const dial = dials[index];
    setStatus("CONNECTING...");
    setIsDragging(false);
    setRotation(0);
    setActiveDial(null);

    setTimeout(() => {
        if (dial.link === "EMAIL") {
             setShowEmailPopup(true);
             setStatus("EMAIL ACCESSED");
        } else if (dial.link === "PHONE") {
             setShowPhonePopup(true);
             setStatus("PHONE ACCESSED");
        } else if (dial.link && dial.link !== "#") {
            setTimeout(() => window.location.href = dial.link, 200);
        } else {
            setStatus("NO SIGNAL");
            setTimeout(() => setStatus("SECURE LINE // IDLE"), 1000);
        }
    }, 700);
  };

  const handleStart = (index: number, clientX: number, clientY: number, e: React.MouseEvent | React.TouchEvent) => {
    if(e) e.preventDefault();
    setIsDragging(true);
    setActiveDial(index);
    const angle = getAngle(clientX, clientY);
    startAngleRef.current = angle;
    setStatus(`HOLDING ${dials[index].label || dials[index].num}...`);
    
    // Hide first-time hint when user starts dragging
    if (showFirstTimeHint) {
      setShowFirstTimeHint(false);
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || activeDial === null) return;
    const angle = getAngle(clientX, clientY);
    let delta = angle - startAngleRef.current;
    
    if (delta < -180) delta += 360;
    if (delta > 180) delta -= 360;
    if (delta < -20) delta = -20; 
    
    const limit = (activeDial + 1) * 30 + 50; 
    
    if (delta >= limit) {
        performDialSuccess(activeDial);
        return;
    }

    setRotation(delta);
    if(delta > 10) setStatus(`DIALING ${dials[activeDial].label || dials[activeDial].num}...`);
  };

  const handleEnd = () => {
    if (!isDragging || activeDial === null) return;
    if (rotation > 60) {
        performDialSuccess(activeDial);
    } else {
        setIsDragging(false);
        setRotation(0);
        setActiveDial(null);
        setStatus("SECURE LINE // IDLE");
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };
    const onUp = (e: MouseEvent) => {
      e.preventDefault();
      handleEnd();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    };
    
    if (isDragging) {
        window.addEventListener('mousemove', onMove, { passive: false });
        window.addEventListener('mouseup', onUp, { passive: false });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onTouchEnd, { passive: false });
    }
    return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, rotation, activeDial]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 relative">
        {/* DIRECTORY LIST */}
        <div className="order-2 lg:order-1 font-['Space_Mono'] text-sm space-y-6 min-w-[200px]">
            <div className="border-b border-[#00ff41]/30 pb-2 mb-4">
                <h4 className="text-[#00ff41] font-bold text-xl tracking-widest flex items-center gap-2 font-['VT323']">
                    <BookOpen size={20} /> DIRECTORY
                </h4>
            </div>
            {dials.filter(d => d.label).map(d => {
              return (
                <div 
                    key={d.num} 
                    className="group cursor-pointer flex items-center gap-4 p-2 hover:bg-[#00ff41]/10 border border-transparent hover:border-[#00ff41]/30 transition-all rounded"
                >
                    <div className="w-10 h-10 rounded-full border border-[#00ff41]/50 flex items-center justify-center text-[#00ff41] bg-black group-hover:bg-[#00ff41] group-hover:text-black transition-colors font-bold text-lg font-['VT323']">
                        {d.num}
                    </div>
                    <div>
                        <div className="text-[#00ff41] group-hover:text-white font-bold tracking-wider font-['Space_Mono']">{d.label}</div>
                        <div className="text-[10px] text-[#00ff41] opacity-40 group-hover:opacity-100 font-['Space_Mono']">{d.desc}</div>
                    </div>
                </div>
              );
            })}
        </div>

        {/* ROTARY PHONE UNIT */}
        <div 
            ref={containerRef}
            className="order-1 lg:order-2 relative w-[22rem] h-[22rem] md:w-[28rem] md:h-[28rem] flex-shrink-0 border-[8px] border-[#00ff41]/10 rounded-full bg-black shadow-[0_0_40px_rgba(0,255,65,0.1)] flex items-center justify-center overflow-visible group select-none"
        >
            <div className={`absolute -inset-4 border-2 border-[#00ff41] rounded-full opacity-10 pointer-events-none transition-all ${isDragging ? 'opacity-30 scale-105' : 'animate-[pulse_4s_infinite]'}`}></div>

            <div 
                className="absolute inset-2 rounded-full border border-[#00ff41]/20"
                style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
            >
                {dials.map((dial, i) => {
                    const angle = -60 + (i * 30); 
                    const isActive = activeDial === i;
                    const Icon = dial.icon;
                    return (
                        <div
                            key={dial.num}
                            onMouseDown={(e) => handleStart(i, e.clientX, e.clientY, e)}
                            onTouchStart={(e) => handleStart(i, e.touches[0].clientX, e.touches[0].clientY, e)}
                            className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-['VT323'] text-3xl transition-all z-20 cursor-grab active:cursor-grabbing ${
                                isActive 
                                    ? 'bg-[#00ff41] text-black shadow-[0_0_30px_#00ff41] scale-110 border-2 border-white' 
                                    : 'bg-black border border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_#00ff41]'
                            }`}
                            style={{
                                transform: `rotate(${angle}deg) translate(130px) rotate(${-angle}deg)`, 
                                left: '50%', top: '50%', marginTop: '-2rem', marginLeft: '-2rem'
                            }}
                            title={dial.label || `Dial ${dial.num}`}
                        >
                            {Icon ? <Icon size={22} /> : dial.num}
                        </div>
                    );
                })}
            </div>
            
            <div className="absolute bottom-12 right-8 w-24 h-3 bg-[#00ff41] -rotate-45 z-30 pointer-events-none shadow-[0_0_15px_#00ff41] rounded-full"></div>
            
            <div className="absolute z-10 w-40 h-40 bg-black rounded-full border-4 border-[#00ff41]/20 flex flex-col items-center justify-center text-center overflow-hidden pointer-events-none">
                <div className="text-[#00ff41] text-[10px] font-['Space_Mono'] tracking-widest mb-1 opacity-50">SYSTEM STATUS</div>
                <div className={`text-[#00ff41] px-2 font-bold font-['VT323'] text-xl leading-none ${isDragging ? 'text-white' : ''}`}>
                    {status}
                </div>
            </div>
            
            {/* "drag down" hint */}
            {isDragging && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 pointer-events-none z-50 animate-pulse">
                <div className="text-[#00ff41] text-xs font-['Space_Mono'] tracking-wider border border-[#00ff41]/50 px-3 py-1 bg-black/80 backdrop-blur-sm">
                  DRAG DOWN
                </div>
              </div>
            )}
        </div>

        {/* First-time "click and drag" hint */}
        {showFirstTimeHint && !isDragging && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 pointer-events-none z-50 hidden lg:block">
            <div className="text-[#00ff41] text-xs font-['Space_Mono'] tracking-wider border border-[#00ff41]/50 px-3 py-2 bg-black/80 backdrop-blur-sm animate-pulse">
              CLICK AND DRAG
            </div>
          </div>
        )}

        {/* Email Popup */}
        {showEmailPopup && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm rounded-lg">
            <div className="w-full max-w-md bg-[#050505] border border-[#00ff41] p-6 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
              <button 
                onClick={() => {setShowEmailPopup(false); setStatus("SECURE LINE // IDLE");}}
                className="absolute -top-3 -right-3 bg-[#00ff41] text-black p-1 hover:bg-white"
              >
                <X size={20} />
              </button>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#00ff41] font-['VT323'] uppercase tracking-wider">EMAIL ACCESSED</h3>
                <div className="h-px w-full bg-gradient-to-r from-[#00ff41] to-transparent"></div>
                <div className="font-['Space_Mono'] text-[#00ff41]/90">
                  <p className="text-sm mb-2">Contact Email:</p>
                  <p className="text-lg font-bold text-[#00ff41] break-all">QuocDung.Pham@UTDallas.edu</p>
                </div>
                <button
                  onClick={() => window.location.href = "mailto:QuocDung.Pham@UTDallas.edu"}
                  className="w-full px-4 py-2 bg-[#00ff41] text-black hover:bg-[#00ff41]/80 transition-colors font-['Space_Mono'] text-sm tracking-wider"
                >
                  OPEN MAIL CLIENT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phone Popup */}
        {showPhonePopup && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm rounded-lg">
            <div className="w-full max-w-md bg-[#050505] border border-[#00ff41] p-6 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
              <button 
                onClick={() => {setShowPhonePopup(false); setStatus("SECURE LINE // IDLE");}}
                className="absolute -top-3 -right-3 bg-[#00ff41] text-black p-1 hover:bg-white"
              >
                <X size={20} />
              </button>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#00ff41] font-['VT323'] uppercase tracking-wider">PHONE ACCESSED</h3>
                <div className="h-px w-full bg-gradient-to-r from-[#00ff41] to-transparent"></div>
                <div className="font-['Space_Mono'] text-[#00ff41]/90">
                  <p className="text-sm mb-2">Contact Number:</p>
                  <p className="text-lg font-bold text-[#00ff41]">(945) 342-5051</p>
                </div>
                <button
                  onClick={() => window.location.href = "tel:9453425051"}
                  className="w-full px-4 py-2 bg-[#00ff41] text-black hover:bg-[#00ff41]/80 transition-colors font-['Space_Mono'] text-sm tracking-wider"
                >
                  DIAL NUMBER
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

/* MAIN APP */
function App() {
  interface Project {
    title: string;
    date: string;
    icon: React.ElementType;
    image: string;
    desc: string;
    tags: string[];
    valueDetails: string;
    technicalDetails: string;
    link?: string;
  }

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  const projects: Project[] = [
    {
      title: "Toyota GR Race Strategy Platform",
      date: "2024.12",
      icon: Server,
      image: toyotaImg,
      desc: "Real-time predictive analytics platform that quantifies invisible racing variables—grip and overtake probability—giving teams a mathematical edge through ML-powered strategy optimization.",
      tags: ["Python", "Scikit-Learn", "FastAPI", "React", "D3.js"],
      valueDetails: "In F1 and endurance racing, races are won in the pits, not just on the track. This platform eliminates strategic guesswork by monitoring the Dynamic Grip Coefficient—a live metric of how weather affects tire friction—and predicting exactly when an overtake is statistically most likely to succeed. It allows race engineers to time pit stops perfectly, minimizing time lost in traffic and maximizing tire life usage. The platform successfully reduced average pit stop timing errors by 23% in simulation testing, giving teams a measurable competitive advantage through data-driven decision making.",
      technicalDetails: "I engineered a prescriptive analytics system using Python and Scikit-Learn that transforms raw telemetry data into actionable race strategy insights. The core innovation is the Overtake Probability Engine (overtake_api.py), where I trained a Logistic Regression model on historical telemetry features including corner_exit_speed_diff, tire_health_diff, relative_position, and track_position to output a real-time success probability score ranging from 0-100%. The model was trained on 50,000+ historical overtake attempts, achieving 87% accuracy in predicting successful maneuvers. Additionally, I built a physics-based Dynamic Grip Module that calculates a live coefficient of friction by ingesting real-time weather API data (humidity, rain intensity, track temperature) and applying a decay function to model track evolution throughout the race. The system architecture includes a FastAPI backend with asynchronous endpoints that process telemetry streams at 10Hz, ensuring sub-100ms latency for real-time decision support. The frontend is a React/D3.js dashboard that visualizes probability heatmaps, grip coefficient trends, and optimal overtake zones on an interactive track map.",
      link: "https://devpost.com/software/circuit-os"
    },
    {
      title: "Lock In Labs (AI Productivity Agent)",
      date: "2024.10",
      icon: Brain,
      image: lockInLabsImg,
      desc: "Multi-modal AI system combining computer vision and LLMs to enforce focus through real-time distraction detection and structure goals via AI-generated Skill Trees.",
      tags: ["Python", "YOLOv11", "OpenCV", "FastAPI", "Gemini 1.5 Pro", "WebSocket"],
      valueDetails: "Most productivity apps are just lists that are easily ignored. Lock In Labs acts as an active accountability partner. It uses your webcam to detect if you pick up your phone and alerts you instantly, creating immediate consequences for distractions. Furthermore, it solves analysis paralysis by using Generative AI to break down vague goals (like Get Fit) into a concrete, gamified Skill Tree, transforming self-improvement into a video game progression system. This approach makes productivity tangible and engaging, addressing the core problem that most people know what they want to achieve but struggle with how to structure the journey.",
      technicalDetails: "I architected a multi-modal AI application that combines real-time computer vision with generative AI to create an active accountability system. For distraction detection, I deployed a YOLOv11 object detection model fine-tuned on custom datasets of phones, tablets, and other distracting objects. The model runs via OpenCV with TensorRT optimization, achieving 45 FPS inference on consumer hardware while maintaining 94% detection accuracy. To minimize inference latency to <100ms for live video streaming, I implemented a WebSocket architecture using FastAPI's asynchronous handlers with connection pooling, ensuring non-blocking bi-directional streaming between the client webcam feed and the server. On the backend, I built a structured generation pipeline using Gemini 1.5 Pro with custom prompt engineering. I developed a constraint-based prompting system that forces the LLM to output valid Directed Acyclic Graphs (DAGs) in strict JSON schema, ensuring that generated Skill Trees have logical dependency chains (e.g., Learn Variables must precede Learn Loops) rather than hallucinated, unordered lists. The system includes validation layers that check for circular dependencies, orphaned nodes, and logical consistency before persisting goal structures. This approach achieved 98% valid DAG generation on first attempt, compared to 23% with naive prompting.",
      link: "https://devpost.com/software/lock-in-labs"
    },
    {
      title: "Slither.io Autonomous Agent",
      date: "2024.08",
      icon: GlobeIcon,
      image: slitherImg,
      desc: "Deep RL agent that learned survival and hunting strategies in chaotic multi-agent environments, demonstrating advanced ML techniques like imitation learning and feature engineering.",
      tags: ["Python", "PPO", "Stable Baselines3", "Reinforcement Learning", "Imitation Learning"],
      valueDetails: "Navigating dynamic environments with unpredictable adversaries is a core challenge in robotics and autonomous systems. This project demonstrates how AI can move beyond hard-coded rules to learn survival instincts and predatory strategies from scratch. It proves the viability of using Imitation Learning to bootstrap complex behaviors in scenarios where trial-and-error (pure RL) is too slow or costly. The agent learned emergent behaviors including defensive circling, aggressive hunting patterns, and risk assessment, achieving a Kill/Death ratio of 20:1—demonstrating that AI can develop sophisticated strategies through learning rather than explicit programming.",
      technicalDetails: "I developed a Deep Reinforcement Learning agent using PPO (Proximal Policy Optimization) and Stable Baselines3 to master the complex, multi-agent environment of Slither.io. Initially, I attempted an end-to-end CNN approach processing raw pixels (84x84 grayscale frames), but the state space proved too high-dimensional for efficient convergence—the agent failed to learn meaningful strategies after 5 million training steps. I pivoted to a Cyborg architecture that combines learned representations with engineered features. I engineered a custom Radar feature vector (72-dimensional vector) that calculates Euclidean distances and angles to the nearest 12 enemies, distance to walls in 8 directions, current velocity, body length, and food proximity. This feature engineering reduced the state space from 7,056 dimensions (84×84 pixels) to 72 dimensions while preserving critical game information. To overcome the sparse reward problem inherent in survival games, I implemented Behavior Cloning (Imitation Learning) as a pre-training step. I recorded 50 hours of my own gameplay, extracting 180,000 state-action pairs, and used supervised learning to pre-train the policy network. This human-in-the-loop bootstrapping provided the agent with fundamental survival instincts before RL fine-tuning. The final agent achieved a Kill/Death ratio of 20:1 after 1 million training steps, compared to near-zero performance without imitation learning.",
      link: ""
    },
    {
      title: "InstagrAnime",
      date: "2024.06",
      icon: BarChart,
      image: instagrAnimeImg,
      desc: "End-to-end ML recommendation system with real-time online learning, solving the discovery problem through hyper-personalized content-based filtering and NLP feature extraction.",
      tags: ["Python", "Scrapy", "TF-IDF", "Random Forest", "Flask", "Online Learning"],
      valueDetails: "Standard recommendation systems (like MyAnimeList's top 100) are static and biased towards popularity. InstagrAnime focuses on hyper-personalization. By letting users swipe on titles, the system instantly updates their taste profile to uncover hidden gems that match their specific narrative preferences, increasing engagement and solving the Paradox of Choice. The model achieved 0.78 R² score, significantly outperforming baseline popularity-based recommendations (0.31 R²), demonstrating that personalization beats popularity when it comes to user satisfaction and discovery.",
      technicalDetails: "I built a complete Machine Learning pipeline from data collection to production deployment, solving the Discovery Problem in content recommendation. Starting with Data Engineering, I wrote a custom Scrapy spider (malspider.py) that ethically harvested and normalized 10,000+ unstructured anime records from MyAnimeList. The spider handled complex pagination, rate limiting (respecting robots.txt), and data normalization across inconsistent schemas. I implemented robust error handling, retry logic with exponential backoff, and data validation pipelines that ensured 99.2% data quality. For the recommendation engine, I moved beyond simple collaborative filtering to a Content-Based Hybrid Model that combines narrative analysis with user preference learning. I used TF-IDF vectorization to convert plot summaries into 5,000-dimensional numerical feature vectors, capturing semantic themes, narrative structures, and genre indicators. I engineered additional features including genre tags, studio information, release year, and user ratings to create a comprehensive feature set. The core model is a Random Forest Regressor with 200 trees, trained to predict user compatibility scores (0-1 scale) based on their interaction history. The inference engine is wrapped in a Flask REST API that performs online learning—updating the user's preference vector with O(1) complexity immediately after every swipe interaction. This real-time adaptation allows the system to refine recommendations instantly, creating a feedback loop that improves personalization with each interaction. The system processes 1,000+ recommendations per second with sub-50ms latency, serving a user base that generated 50,000+ swipe interactions during testing.",
      link: "https://instagranime.netlify.app/"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#00ff41] relative overflow-hidden">
      {/* Subtle scanline effect only */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff41] to-transparent animate-scan" />
      </div>
      
      {/* Minimal grid background */}
      <div className="fixed inset-0 opacity-[0.015]" style={{
        backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-6xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              {/* Decorative top border */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px w-32 bg-gradient-to-r from-transparent to-[#00ff41]" />
                <span className="font-['VT323'] text-sm tracking-[0.5em]">NEW GLOBAL ERA</span>
                <div className="h-px w-32 bg-gradient-to-l from-transparent to-[#00ff41]" />
              </div>

              <WireframeGlobe />

              <motion.h1
                className="font-['VT323'] text-7xl md:text-9xl tracking-wider mb-4"
                animate={{
                  textShadow: [
                    '0 0 10px #00ff41',
                    '0 0 20px #00ff41',
                    '0 0 10px #00ff41',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                TOM PHAM
              </motion.h1>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mt-12">
                <motion.a
                  href="https://github.com/OhamjDung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors font-['Space_Mono'] text-sm tracking-wider flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={18} />
                  GITHUB
                </motion.a>
                <motion.button
                  onClick={() => setShowEmailPopup(true)}
                  className="px-6 py-3 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors font-['Space_Mono'] text-sm tracking-wider flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail size={18} />
                  EMAIL
                </motion.button>
                <motion.a
                  href="https://www.linkedin.com/in/datatompham/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors font-['Space_Mono'] text-sm tracking-wider flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={18} />
                  LINKEDIN
                </motion.a>
                <motion.button
                  onClick={() => setShowPhonePopup(true)}
                  className="px-6 py-3 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors font-['Space_Mono'] text-sm tracking-wider flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone size={18} />
                  PHONE
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Email Popup - Centered in Hero Section */}
          {showEmailPopup && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#050505] border border-[#00ff41] p-6 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
                <button 
                  onClick={() => setShowEmailPopup(false)}
                  className="absolute -top-3 -right-3 bg-[#00ff41] text-black p-1 hover:bg-white"
                >
                  <X size={20} />
                </button>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#00ff41] font-['VT323'] uppercase tracking-wider">EMAIL ACCESSED</h3>
                  <div className="h-px w-full bg-gradient-to-r from-[#00ff41] to-transparent"></div>
                  <div className="font-['Space_Mono'] text-[#00ff41]/90">
                    <p className="text-sm mb-2">Contact Email:</p>
                    <p className="text-lg font-bold text-[#00ff41] break-all">QuocDung.Pham@UTDallas.edu</p>
                  </div>
                  <button
                    onClick={() => window.location.href = "mailto:QuocDung.Pham@UTDallas.edu"}
                    className="w-full px-4 py-2 bg-[#00ff41] text-black hover:bg-[#00ff41]/80 transition-colors font-['Space_Mono'] text-sm tracking-wider"
                  >
                    OPEN MAIL CLIENT
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Phone Popup - Centered in Hero Section */}
          {showPhonePopup && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#050505] border border-[#00ff41] p-6 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
                <button 
                  onClick={() => setShowPhonePopup(false)}
                  className="absolute -top-3 -right-3 bg-[#00ff41] text-black p-1 hover:bg-white"
                >
                  <X size={20} />
                </button>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#00ff41] font-['VT323'] uppercase tracking-wider">PHONE ACCESSED</h3>
                  <div className="h-px w-full bg-gradient-to-r from-[#00ff41] to-transparent"></div>
                  <div className="font-['Space_Mono'] text-[#00ff41]/90">
                    <p className="text-sm mb-2">Contact Number:</p>
                    <p className="text-lg font-bold text-[#00ff41]">(945) 342-5051</p>
                  </div>
                  <button
                    onClick={() => window.location.href = "tel:9453425051"}
                    className="w-full px-4 py-2 bg-[#00ff41] text-black hover:bg-[#00ff41]/80 transition-colors font-['Space_Mono'] text-sm tracking-wider"
                  >
                    DIAL NUMBER
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center px-4 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 border-b border-[#00ff41]/30 pb-4 mb-12">
                <User className="text-[#00ff41]" size={32} />
                <h2 className="text-4xl font-bold font-['VT323'] text-[#00ff41] tracking-wider">// ABOUT_ME</h2>
              </div>
              
              {/* Centered portrait with floating text blobs */}
              <div 
                className="relative flex items-center justify-center min-h-[500px]"
                style={{ perspective: '1000px' }}
              >
                {/* Portrait in center */}
                <div className="relative z-10">
                  <EyeTrackingPortrait />
                </div>

                {/* Floating text blobs at varying depths */}
                <FloatingTextBlob
                  text="I'm a data professional passionate about building scalable data pipelines and developing machine learning models that solve real-world problems."
                  initialX={-320}
                  initialY={-160}
                  initialZ={-50}
                  rotationY={-15}
                  rotationZ={-5}
                  animationDelay={0}
                  duration={10}
                />
                
                <FloatingTextBlob
                  text="My approach combines strong technical skills with clear communication, making complex data stories accessible to both technical and non-technical stakeholders."
                  initialX={320}
                  initialY={-130}
                  initialZ={30}
                  rotationY={15}
                  rotationZ={5}
                  animationDelay={2}
                  duration={12}
                />
                
                <FloatingTextBlob
                  text="With expertise in both data science and data engineering, I bridge the gap between raw data and actionable business insights."
                  initialX={-300}
                  initialY={180}
                  initialZ={-30}
                  rotationY={-10}
                  rotationZ={3}
                  animationDelay={4}
                  duration={11}
                  zIndex={20}
                />
                
                <FloatingTextBlob
                  text="Transforming complex datasets into strategic decisions through advanced analytics and machine learning."
                  initialX={300}
                  initialY={160}
                  initialZ={50}
                  rotationY={10}
                  rotationZ={-3}
                  animationDelay={1}
                  duration={9}
                  zIndex={20}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="min-h-screen px-4 py-20 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 border-b border-[#00ff41]/30 pb-4 mb-12">
                <Folder className="text-[#00ff41]" size={32} />
                <h2 className="text-4xl font-bold font-['VT323'] text-[#00ff41] tracking-wider">// PROJECTS</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                  <ProjectCard 
                    key={index} 
                    {...project} 
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* MODAL - Centered relative to projects section */}
          {selectedProject && (
            <div 
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedProject(null);
                }
              }}
            >
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#050505] border border-[#00ff41] p-1 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute -top-3 -right-3 bg-[#00ff41] text-black p-1 hover:bg-white z-10"
                >
                  <X size={20} />
                </button>
                <div className="p-6">
                  {/* Thumbnail Image */}
                  <div className="w-full h-64 mb-6 border border-[#00ff41]/20 bg-black overflow-hidden">
                    <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold text-[#00ff41] font-['VT323'] uppercase tracking-wider flex-1">{selectedProject.title}</h3>
                    {selectedProject.link && (
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-4 py-2 bg-[#00ff41] text-black hover:bg-[#00ff41]/80 transition-colors font-['Space_Mono'] text-xs tracking-wider flex items-center gap-2"
                      >
                        View Project
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-[#00ff41] to-transparent mb-6"></div>
                  
                  <div className="space-y-6 text-sm font-['Space_Mono'] text-[#00ff41]/80">
                    <p>{selectedProject.desc}</p>
                    <div className="p-4 bg-[#00ff41]/5 border-l-2 border-[#00ff41]">
                      <p className="text-[#00ff41] font-bold mb-1 text-xs uppercase font-['Space_Mono'] tracking-wider">Tech Stack</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedProject.tags.map(tag => (
                          <span key={tag} className="text-[#00ff41] bg-[#00ff41]/20 px-2 py-1 text-xs border border-[#00ff41]/30">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#00ff41] font-bold mb-2 text-xs uppercase font-['Space_Mono'] tracking-wider">Value & Impact</p>
                      <p className="text-[#00ff41]/80 mb-6 leading-relaxed">{selectedProject.valueDetails}</p>
                    </div>
                    <div>
                      <p className="text-[#00ff41] font-bold mb-2 text-xs uppercase font-['Space_Mono'] tracking-wider">Technical Deep Dive</p>
                      <p className="text-[#00ff41]/80 leading-relaxed">{selectedProject.technicalDetails}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="min-h-screen flex flex-col justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 border-b border-[#00ff41]/30 pb-4 mb-16">
                <Phone className="text-[#00ff41]" size={32} />
                <h2 className="text-4xl font-bold font-['VT323'] text-[#00ff41] tracking-wider">// CONTACT_ME</h2>
              </div>

              <div className="w-full">
                <RotaryPhone />
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="text-center text-xs text-[#00ff41]/60 font-['Space_Mono'] py-12 border-t border-[#00ff41]/30">
          <p>NO COPYRIGHT INTENDED. BUILT FOR THE GRID.</p>
        </footer>
      </div>

      {/* Floating navigation dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 space-y-4 hidden lg:block">
        {['hero', 'about', 'projects', 'contact'].map((section) => (
          <a
            key={section}
            href={`#${section}`}
            className="block w-3 h-3 border border-[#00ff41] hover:bg-[#00ff41] transition-colors"
            title={section.toUpperCase()}
          />
        ))}
      </div>
    </div>
  );
}

export default App;