'use client';

import { useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { 
  Cpu, Sparkles, Zap, Bot, Terminal, Code2, Database, ShieldAlert,
  Sliders, Play, CheckCircle2, ArrowRight, RefreshCw, Wand2, Search
} from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  category: 'Generation' | 'Standardization' | 'Security & Audit' | 'Refactoring';
  description: string;
  model: string;
  latency: string;
  status: 'Ready' | 'Busy';
  tokensUsed: string;
}

const AI_TOOLS: ToolItem[] = [
  {
    id: 'tool-1',
    name: 'Module Architect Synthesizer',
    category: 'Generation',
    description: 'Generates full TypeScript/Next.js and Node.js module scaffolds tailored to project specifications.',
    model: 'Claude 3.7 Sonnet + Thinking',
    latency: '1.2s',
    status: 'Ready',
    tokensUsed: '142.5k',
  },
  {
    id: 'tool-2',
    name: 'AST Code Standardizer',
    category: 'Standardization',
    description: 'Normalizes incoming contributions: resolves variable shadowing, enforces shared ESLint/Prettier, and wraps error boundaries.',
    model: 'Gemini 2.5 Flash',
    latency: '340ms',
    status: 'Ready',
    tokensUsed: '89.2k',
  },
  {
    id: 'tool-3',
    name: 'Contract & Interface Verifier',
    category: 'Security & Audit',
    description: 'Validates cross-module API contracts, OpenAPI specs, and ensures frontend client bindings match server schemas.',
    model: 'DeepSeek R1 Distill',
    latency: '820ms',
    status: 'Ready',
    tokensUsed: '210.4k',
  },
  {
    id: 'tool-4',
    name: 'Dependency Tree Optimizer',
    category: 'Refactoring',
    description: 'Analyzes root package.json vs module packages to prune duplicate peer-dependencies and lock compatibility.',
    model: 'Claude 3.5 Haiku',
    latency: '180ms',
    status: 'Ready',
    tokensUsed: '45.1k',
  },
  {
    id: 'tool-5',
    name: 'Auto-Doc Generator & Diagrammer',
    category: 'Generation',
    description: 'Generates interactive Mermaid diagrams, README manifests, and typed route docs from raw source code.',
    model: 'GPT-4o Mini',
    latency: '510ms',
    status: 'Ready',
    tokensUsed: '112.8k',
  },
  {
    id: 'tool-6',
    name: 'Vulnerability & Secrets Sentinel',
    category: 'Security & Audit',
    description: 'Scans all staged module files for leaked API keys, unsafe regex evaluations, and unsecured public endpoints.',
    model: 'Rule-Engine + Semantic LLM',
    latency: '95ms',
    status: 'Ready',
    tokensUsed: '34.9k',
  },
];

export default function AIToolsPage() {
  const [tools, setTools] = useState<ToolItem[]>(AI_TOOLS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [executingTool, setExecutingTool] = useState<string | null>(null);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Generation', 'Standardization', 'Security & Audit', 'Refactoring'];

  const filteredTools = tools.filter(t => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRunTool = (tool: ToolItem) => {
    setExecutingTool(tool.name);
    setExecutionOutput(null);

    setTimeout(() => {
      setExecutingTool(null);
      setExecutionOutput(`[AI-RUNNER] Success: ${tool.name} executed successfully.
Model: ${tool.model}
Latency: ${tool.latency}
Analysis: All 5 modular contracts verified. Zero AST regression. Ready for auto-merge.`);
    }, 1500);
  };

  return (
    <div className="tools-layout">
      <DashboardNavbar />

      <main className="tools-main">
        {/* Header */}
        <header className="page-header">
          <div>
            <div className="section-tag">
              <span className="pulse-indicator"></span>
              INTELLIGENT COMPILER PIPELINE
            </div>
            <h1 className="page-title">AI Automation Tools</h1>
            <p className="page-desc">
              Harness specialized neural agents for automated code standardization, contract verification, and module synthesis.
            </p>
          </div>

          <div className="header-status-badge">
            <span className="status-live-dot"></span>
            <span>Agent Inference Mesh Active</span>
          </div>
        </header>

        {/* Live Playground Quick Runner Banner */}
        <div className="interactive-runner-card">
          <div className="runner-left">
            <div className="runner-tag">
              <Sparkles size={14} className="gold-icon" />
              <span>RAPID AGENT INVOCATION</span>
            </div>
            <h3 className="runner-title">Execute AST Standardization across codebase</h3>
            <p className="runner-desc">
              Target unassigned or staged modules to automatically generate unified TypeScript interfaces and API adapters.
            </p>
            <div className="runner-input-row">
              <input 
                type="text" 
                placeholder="e.g. standardise frontend/src/components/Navigation.tsx with contract checks"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="runner-input"
              />
              <button 
                className="runner-btn" 
                disabled={executingTool !== null}
                onClick={() => handleRunTool(tools[1])}
              >
                {executingTool ? <RefreshCw size={15} className="spin-icon" /> : <Play size={15} />}
                <span>{executingTool ? 'Processing...' : 'Run Pipeline'}</span>
              </button>
            </div>

            {executionOutput && (
              <div className="runner-output-box">
                <div className="output-header">
                  <Terminal size={13} />
                  <span>Execution Stream Log</span>
                </div>
                <pre>{executionOutput}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="cat-pills">
            {categories.map((c) => (
              <button 
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`cat-pill ${selectedCategory === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="tools-search"
            />
          </div>
        </div>

        {/* Grid of Tools */}
        <div className="tools-grid">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="tool-card">
              <div className="tool-header">
                <span className="tool-cat-badge">{tool.category}</span>
                <span className="tool-status-badge">
                  <span className="status-dot"></span>
                  {tool.status}
                </span>
              </div>

              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-description">{tool.description}</p>

              <div className="tool-specs">
                <div className="spec-item">
                  <span className="spec-label">Foundation Engine</span>
                  <span className="spec-val">{tool.model}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Avg Response</span>
                  <span className="spec-val">{tool.latency}</span>
                </div>
              </div>

              <div className="tool-footer">
                <span className="usage-stat">Tokens: <strong>{tool.tokensUsed}</strong></span>
                <button 
                  className="execute-btn" 
                  onClick={() => handleRunTool(tool)}
                  disabled={executingTool === tool.name}
                >
                  {executingTool === tool.name ? (
                    <>
                      <RefreshCw size={13} className="spin-icon" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={13} />
                      <span>Run Tool</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx global>{`
        .tools-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .tools-main {
          flex: 1;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 48px 80px;
          box-sizing: border-box;
        }

        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 32px;
          border-bottom: 1px solid #EBE8E2;
          gap: 24px;
          flex-wrap: wrap;
        }

        .section-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #8C827A;
          letter-spacing: 0.15em;
          margin-bottom: 10px;
        }

        .pulse-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C9A45F;
          box-shadow: 0 0 10px rgba(201, 164, 95, 0.6);
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #111;
          margin: 0 0 8px 0;
          line-height: 1.1;
        }

        .page-desc {
          font-size: 0.9375rem;
          color: #666;
          margin: 0;
          max-width: 600px;
          line-height: 1.5;
        }

        .header-status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #FFFFFF;
          border: 1px solid #E7E3DC;
          border-radius: 30px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #333;
        }

        .status-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        /* Interactive Runner Card */
        .interactive-runner-card {
          margin: 32px 0 28px;
          background: linear-gradient(135deg, #111111, #1D1B18);
          border: 1px solid #332F28;
          border-radius: 20px;
          padding: 32px;
          color: #fff;
          box-shadow: 0 16px 40px rgba(0,0,0,0.15);
        }

        .runner-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #C9A45F;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }

        .gold-icon { color: #C9A45F; }

        .runner-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }

        .runner-desc {
          font-size: 0.875rem;
          color: #A39D93;
          margin: 0 0 20px 0;
          max-width: 700px;
          line-height: 1.5;
        }

        .runner-input-row {
          display: flex;
          gap: 10px;
          max-width: 760px;
        }

        .runner-input {
          flex: 1;
          padding: 12px 18px;
          border-radius: 12px;
          border: 1px solid #3A352C;
          background: #0B0A09;
          color: #fff;
          font-size: 0.875rem;
          outline: none;
        }

        .runner-input:focus {
          border-color: #C9A45F;
        }

        .runner-btn {
          background: #C9A45F;
          color: #111;
          border: none;
          padding: 0 24px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .runner-btn:hover { background: #DCB872; }

        .runner-output-box {
          margin-top: 20px;
          background: #070707;
          border: 1px solid #2B2822;
          border-radius: 10px;
          padding: 14px 18px;
          font-family: monospace;
          font-size: 0.8125rem;
        }

        .output-header {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #C9A45F;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.75rem;
        }

        .runner-output-box pre {
          margin: 0;
          color: #4ade80;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        /* Filters Bar */
        .filters-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cat-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cat-pill {
          background: #EFECE6;
          border: none;
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-pill.active {
          background: #111;
          color: #fff;
        }

        .search-wrap {
          position: relative;
          width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }

        .tools-search {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border-radius: 8px;
          border: 1px solid #E2DED6;
          background: #fff;
          font-size: 0.8125rem;
          outline: none;
          box-sizing: border-box;
        }

        /* Grid */
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 22px;
        }

        .tool-card {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s;
        }

        .tool-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.05);
          border-color: #DCD6CA;
        }

        .tool-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .tool-cat-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #A37F38;
          background: rgba(201, 164, 95, 0.12);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .tool-status-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: #16a34a;
          font-weight: 600;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
        }

        .tool-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111;
          margin: 0 0 8px 0;
        }

        .tool-description {
          font-size: 0.84375rem;
          color: #666;
          line-height: 1.5;
          margin: 0 0 20px 0;
          flex: 1;
        }

        .tool-specs {
          background: #FAF8F5;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          border: 1px solid #F0ECE4;
        }

        .spec-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .spec-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #999;
          text-transform: uppercase;
        }

        .spec-val {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #222;
        }

        .tool-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #F2EFE9;
          padding-top: 14px;
        }

        .usage-stat {
          font-size: 0.75rem;
          color: #888;
        }

        .execute-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #111;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .execute-btn:hover { background: #2a2a2a; }

        .spin-icon {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .tools-main { padding: 24px 20px; }
          .page-title { font-size: 2rem; }
          .runner-input-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
