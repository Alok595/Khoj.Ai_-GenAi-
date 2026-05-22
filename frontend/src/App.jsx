import { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  FileText,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
  AlertCircle,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
const STEPS = [
  {
    key: "search_result",
    icon: Search,
    label: "Web Search",
    sublabel: "Scanning the web",
    accent: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
    num: "01",
  },
  {
    key: "scraped_content",
    icon: Globe,
    label: "Deep Scrape",
    sublabel: "Extracting content",
    accent: "#22d3ee",
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.25)",
    num: "02",
  },
  {
    key: "report",
    icon: FileText,
    label: "Research Report",
    sublabel: "Writing findings",
    accent: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
    num: "03",
  },
  {
    key: "feedback",
    icon: Brain,
    label: "Critic Review",
    sublabel: "Evaluating quality",
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    num: "04",
  },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 500,
        background: copied ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
        color: copied ? "#10b981" : "#9ca3af",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ResultCard({ step, content, index }) {
  const [expanded, setExpanded] = useState(true);
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${step.border}`,
        background: step.bg,
      }}
    >
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          cursor: "pointer",
          borderBottom: expanded ? `1px solid ${step.border}` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `rgba(${hexToRgb(step.accent)},0.15)`,
              border: `1px solid ${step.border}`,
              flexShrink: 0,
            }}
          >
            <Icon size={18} style={{ color: step.accent }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: step.accent,
                  opacity: 0.7,
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#f1f3f9",
                }}
              >
                {step.label}
              </h3>
            </div>
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              {content?.length || 0} characters extracted
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <CopyButton text={content} />
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.04)",
              color: "#6b7280",
            }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "20px 24px" }}>
              {/* // ✅ Fix — renders markdown properly */}
              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#f1f3f9",
                          margin: "16px 0 8px",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: "#e2e4ee",
                          margin: "14px 0 6px",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#d1d5db",
                          margin: "12px 0 4px",
                        }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p
                        style={{
                          fontSize: 13,
                          lineHeight: 1.8,
                          color: "#c9cdd8",
                          margin: "6px 0",
                        }}
                      >
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong style={{ color: "#e8eaf0", fontWeight: 600 }}>
                        {children}
                      </strong>
                    ),
                    li: ({ children }) => (
                      <li
                        style={{
                          fontSize: 13,
                          lineHeight: 1.8,
                          color: "#c9cdd8",
                          marginLeft: 20,
                          marginBottom: 2,
                        }}
                      >
                        {children}
                      </li>
                    ),
                    ul: ({ children }) => (
                      <ul style={{ margin: "8px 0", paddingLeft: 8 }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol style={{ margin: "8px 0", paddingLeft: 8 }}>
                        {children}
                      </ol>
                    ),
                    table: ({ children }) => (
                      <div style={{ overflowX: "auto", margin: "12px 0" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: 12,
                          }}
                        >
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th
                        style={{
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.06)",
                          color: "#e8eaf0",
                          fontWeight: 600,
                          textAlign: "left",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td
                        style={{
                          padding: "7px 12px",
                          color: "#c9cdd8",
                          border: "1px solid rgba(255,255,255,0.06)",
                          fontSize: 12,
                        }}
                      >
                        {children}
                      </td>
                    ),
                    code: ({ children }) => (
                      <code
                        style={{
                          background: "rgba(139,92,246,0.15)",
                          color: "#a78bfa",
                          padding: "1px 6px",
                          borderRadius: 4,
                          fontSize: 12,
                          fontFamily: "monospace",
                        }}
                      >
                        {children}
                      </code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        style={{
                          borderLeft: "3px solid rgba(139,92,246,0.5)",
                          paddingLeft: 12,
                          margin: "8px 0",
                          color: "#9ca3af",
                          fontStyle: "italic",
                        }}
                      >
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PipelineTracker({ activeStep, completed }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isActive = activeStep === i;
        const isDone = completed.includes(step.key);
        return (
          <div
            key={step.key}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <motion.div
              animate={{
                background: isActive
                  ? `rgba(${hexToRgb(step.accent)},0.15)`
                  : isDone
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(255,255,255,0.04)",
                borderColor: isActive
                  ? step.accent
                  : isDone
                    ? "#10b981"
                    : "rgba(255,255,255,0.08)",
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 500,
                border: "1px solid",
              }}
              transition={{ duration: 0.3 }}
            >
              {isActive ? (
                <Loader2
                  size={12}
                  className="animate-spin"
                  style={{
                    color: step.accent,
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : isDone ? (
                <Check size={12} style={{ color: "#10b981" }} />
              ) : (
                <Icon size={12} style={{ color: "#4b5563" }} />
              )}
              <span
                style={{
                  color: isActive
                    ? step.accent
                    : isDone
                      ? "#10b981"
                      : "#4b5563",
                }}
              >
                {step.label}
              </span>
            </motion.div>
            {i < STEPS.length - 1 && (
              <ArrowRight size={12} style={{ color: "#1f2937" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [completedKeys, setCompletedKeys] = useState([]);
  const inputRef = useRef(null);

  const simulateProgress = () => {
    setActiveStep(0);
    setCompletedKeys([]);
    const delays = [0, 12000, 26000, 40000];
    STEPS.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (i > 0) setCompletedKeys((p) => [...p, STEPS[i - 1].key]);
      }, delays[i]);
    });
  };

  const handleSubmit = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    simulateProgress();

    try {
      // const res = await axios.post("http://localhost:8000/research", { topic });
      const res = await axios.post("https://khoj-ai-genai.onrender.com/research", { topic });

      setResult(res.data);
      setActiveStep(-1);
      setCompletedKeys(STEPS.map((s) => s.key));
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Cannot connect to Python server. Run: uvicorn server:app --reload --port 8000",
      );
      setActiveStep(-1);
      setCompletedKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Quantum computing 2025",
    "Climate change solutions",
    "LLM agent architectures",
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Orb backgrounds */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            top: "-20%",
            left: "-10%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            bottom: "-15%",
            right: "-10%",
            background:
              "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 860,
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        {/* Header */}
        <motion.div
          style={{ textAlign: "center", marginBottom: 56 }}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 999,
                fontSize: 11,
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#a78bfa",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              <Zap size={11} />
              AI-POWERED RESEARCH PIPELINE
            </div>
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.1,
              fontFamily: "var(--font-display)",
              marginBottom: 16,
              background:
                "linear-gradient(135deg, #f1f3f9 0%, #a78bfa 45%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Research Agent
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "#6b7280",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Enter any topic. The agent searches, scrapes, writes a structured
            report, and critiques it.
          </p>
        </motion.div>

        {/* Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: 32 }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: 8,
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${topic ? "rgba(139,92,246,0.45)" : "rgba(255,255,255,0.08)"}`,
              boxShadow: topic ? "0 0 40px rgba(139,92,246,0.12)" : "none",
              transition: "all 0.3s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
                color: "#4b5563",
              }}
            >
              <Search size={20} />
            </div>
            <input
              ref={inputRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter any research topic..."
              disabled={loading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 16,
                padding: "12px 0",
                fontFamily: "var(--font-body)",
                color: "#e8eaf0",
                caretColor: "#8b5cf6",
              }}
            />
            {topic && !loading && (
              <button
                onClick={() => {
                  setTopic("");
                  inputRef.current?.focus();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  alignSelf: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  color: "#4b5563",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            )}
            <motion.button
              onClick={handleSubmit}
              disabled={loading || !topic.trim()}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.04em",
                background: loading
                  ? "rgba(139,92,246,0.5)"
                  : "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                color: "white",
                boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
                opacity: !topic.trim() ? 0.5 : 1,
                minWidth: 140,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      animation: "spin 1s linear infinite",
                      display: "inline-flex",
                    }}
                  >
                    <Loader2 size={16} />
                  </span>{" "}
                  Working…
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Research
                </>
              )}
            </motion.button>
          </div>

          {/* Suggestions */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => !loading && setTopic(s)}
                style={{
                  fontSize: 12,
                  padding: "5px 12px",
                  borderRadius: 999,
                  cursor: "pointer",
                  color: "#6b7280",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ marginBottom: 32 }}
            >
              <div
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.08em",
                    color: "#4b5563",
                    marginBottom: 20,
                  }}
                >
                  PIPELINE RUNNING — APPROXIMATELY 45 SECONDS
                </p>
                <PipelineTracker
                  activeStep={activeStep}
                  completed={completedKeys}
                />
                <div
                  style={{
                    marginTop: 24,
                    height: 2,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #7c3aed, #22d3ee)",
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 52, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: 32,
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: 20,
                borderRadius: 16,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <AlertCircle
                size={20}
                style={{ color: "#ef4444", flexShrink: 0, marginTop: 1 }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#fca5a5",
                    marginBottom: 4,
                  }}
                >
                  Connection Error
                </p>
                <p style={{ fontSize: 13, color: "#9ca3af" }}>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: "#34d399",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.08em",
                  }}
                >
                  <Check size={12} />
                  PIPELINE COMPLETE
                </div>
                <button
                  onClick={() => {
                    setResult(null);
                    setCompletedKeys([]);
                    setTopic("");
                  }}
                  style={{
                    fontSize: 12,
                    padding: "6px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    color: "#6b7280",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  New Research
                </button>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {STEPS.map((step, i) =>
                  result[step.key] ? (
                    <ResultCard
                      key={step.key}
                      step={step}
                      content={result[step.key]}
                      index={i}
                    />
                  ) : null,
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state pipeline preview */}
        {!loading && !result && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
              marginTop: 48,
            }}
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 14px",
                      background: step.bg,
                      border: `1px solid ${step.border}`,
                    }}
                  >
                    <Icon size={20} style={{ color: step.accent }} />
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#d1d5db",
                      fontFamily: "var(--font-display)",
                      marginBottom: 4,
                    }}
                  >
                    {step.label}
                  </p>
                  <p style={{ fontSize: 12, color: "#4b5563" }}>
                    {step.sublabel}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#1f2937",
            marginTop: 64,
            fontFamily: "var(--font-body)",
          }}
        >
          FastAPI · LangGraph · Mistral AI · React + Vite
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #374151; }
        * { transition: border-color 0.2s; }
      `}</style>
    </div>
  );
}
