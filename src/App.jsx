import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from "recharts";

// ─── GC BRAND TOKENS ───
const PURPLE = "#2A0039";
const OFF_WHITE = "#F9F2E9";
const YELLOW = "#FFC527";
const BLUE = "#3636DF";
const GREEN = "#04AC7E";
const SEA = "#1D8FB1";
const VIOLET = "#6D4FF9";
const RED = "#FF5A5A";
const MAGENTA = "#CE2260";
const CREAM = "#FFECB6";
const PISTACHIO = "#B8F29E";
const SKY = "#6CB2FF";
const LAVENDER = "#9793FF";
const PEACH = "#FFCE8A";

// ─── MOCK DATA ───
const EMPLOYEES = [
  { id: 1, name: "Priya Sharma", role: "Senior Engineer", team: "Platform", tenure: "3y 2m", avatar: "PS", manager: "Arjun Mehta",
    milestones: [
      { type: "professional", event: "Promoted to Senior Engineer", date: "2026-03-15", tier: 1, status: "completed", sentiment: 4.2 },
      { type: "professional", event: "3-Year Work Anniversary", date: "2026-04-01", tier: 1, status: "pending", sentiment: null },
    ],
    sentimentHistory: [
      { month: "Oct", score: 4.0 }, { month: "Nov", score: 3.8 }, { month: "Dec", score: 4.1 },
      { month: "Jan", score: 3.9 }, { month: "Feb", score: 4.3 }, { month: "Mar", score: 4.2 },
    ]
  },
  { id: 2, name: "Ravi Krishnan", role: "Product Manager", team: "Growth", tenure: "1y 8m", avatar: "RK", manager: "Deepa Nair",
    milestones: [
      { type: "professional", event: "New Manager Assignment", date: "2026-03-20", tier: 2, status: "completed", sentiment: 3.4 },
      { type: "personal", event: "Return from Paternity Leave", date: "2026-03-28", tier: 2, status: "in_progress", sentiment: null },
    ],
    sentimentHistory: [
      { month: "Oct", score: 4.2 }, { month: "Nov", score: 4.0 }, { month: "Dec", score: 3.6 },
      { month: "Jan", score: 3.3 }, { month: "Feb", score: 3.4 }, { month: "Mar", score: 3.4 },
    ]
  },
  { id: 3, name: "Ananya Desai", role: "Design Lead", team: "Product", tenure: "2y 5m", avatar: "AD", manager: "Vikram Singh",
    milestones: [
      { type: "personal", event: "Bereavement Leave Return", date: "2026-03-10", tier: 3, status: "completed", sentiment: 2.8 },
      { type: "professional", event: "Probation Completion", date: "2026-02-01", tier: 1, status: "completed", sentiment: 4.5 },
    ],
    sentimentHistory: [
      { month: "Oct", score: 4.4 }, { month: "Nov", score: 4.3 }, { month: "Dec", score: 4.1 },
      { month: "Jan", score: 4.5 }, { month: "Feb", score: 3.2 }, { month: "Mar", score: 2.8 },
    ]
  },
  { id: 4, name: "Karthik Iyer", role: "Data Analyst", team: "Analytics", tenure: "0y 11m", avatar: "KI", manager: "Meera Joshi",
    milestones: [
      { type: "professional", event: "Probation End (11 months)", date: "2026-03-25", tier: 1, status: "completed", sentiment: 4.0 },
      { type: "professional", event: "1-Year Work Anniversary", date: "2026-05-01", tier: 1, status: "upcoming", sentiment: null },
    ],
    sentimentHistory: [
      { month: "Oct", score: 3.8 }, { month: "Nov", score: 4.0 }, { month: "Dec", score: 4.2 },
      { month: "Jan", score: 4.1 }, { month: "Feb", score: 4.0 }, { month: "Mar", score: 4.0 },
    ]
  },
  { id: 5, name: "Meghna Patel", role: "HR Business Partner", team: "People", tenure: "4y 1m", avatar: "MP", manager: "Shruti Y",
    milestones: [
      { type: "personal", event: "Marriage", date: "2026-02-14", tier: 1, status: "completed", sentiment: 4.8 },
      { type: "professional", event: "Role Change to HRBP Lead", date: "2026-03-01", tier: 2, status: "completed", sentiment: 3.9 },
    ],
    sentimentHistory: [
      { month: "Oct", score: 4.1 }, { month: "Nov", score: 4.3 }, { month: "Dec", score: 4.5 },
      { month: "Jan", score: 4.7 }, { month: "Feb", score: 4.8 }, { month: "Mar", score: 3.9 },
    ]
  },
  { id: 6, name: "Arun Bhatia", role: "Backend Engineer", team: "Platform", tenure: "2y 0m", avatar: "AB", manager: "Arjun Mehta",
    milestones: [
      { type: "professional", event: "2-Year Work Anniversary", date: "2026-04-05", tier: 1, status: "pending", sentiment: null },
      { type: "personal", event: "Relocation (Bangalore to Hyderabad)", date: "2026-03-15", tier: 2, status: "completed", sentiment: 3.5 },
    ],
    sentimentHistory: [
      { month: "Oct", score: 3.9 }, { month: "Nov", score: 3.7 }, { month: "Dec", score: 3.5 },
      { month: "Jan", score: 3.6 }, { month: "Feb", score: 3.4 }, { month: "Mar", score: 3.5 },
    ]
  },
];

// Simulated conversation scripts per milestone type
const CONVERSATION_SCRIPTS = {
  "3-Year Work Anniversary": [
    { sender: "pulse", text: "Hey Priya! \uD83C\uDF89 Today marks 3 years at GC. That's a really meaningful milestone. How are you feeling about your journey here so far?" },
    { sender: "employee", text: "Pretty good! The promotion last month was a nice recognition. Though honestly, the last quarter was intense." },
    { sender: "pulse", text: "Congrats again on that promotion — well deserved! I hear you on the intensity of Q1. Is the pace something you're managing okay, or is there something that would make things more sustainable?" },
    { sender: "employee", text: "I think I could use clearer priorities. Lots of competing asks from different stakeholders right now." },
    { sender: "pulse", text: "That's super valid — especially in a new senior role where visibility increases. I can flag \"prioritization support\" as a theme for your manager's next 1:1 talking points, without sharing specifics. Want me to do that?" },
    { sender: "employee", text: "Yeah, that would actually be really helpful." },
    { sender: "pulse", text: "Done! I've noted this for Arjun's next nudge. And Priya — 3 years is no small thing. The team's lucky to have you here. Is there anything else on your mind?" },
    { sender: "employee", text: "No, I think that covers it. Thanks for checking in!" },
    { sender: "pulse", text: "Anytime! Have a great rest of your day. \uD83D\uDE0A", meta: { sentiment: 4.2, themes: ["Workload management", "Stakeholder prioritization"], action: "Manager nudge: prioritization support", routed_to: "Manager 1:1 talking points" } },
  ],
  "Return from Paternity Leave": [
    { sender: "pulse", text: "Hey Ravi, welcome back! Hope you had a wonderful time with the new addition to your family. How are you settling back in?" },
    { sender: "employee", text: "Thanks! The baby is amazing but I'm not going to lie, the sleep deprivation is real. Trying to get back into the groove." },
    { sender: "pulse", text: "Ha, I can only imagine! That transition back is genuinely one of the harder adjustments. Is there anything from the team or org side that would help make the ramp-up smoother?" },
    { sender: "employee", text: "Honestly, I'm a bit lost on what changed while I was away. New manager, new priorities — feels like I missed a lot." },
    { sender: "pulse", text: "That makes total sense — a lot shifted in your absence. A couple of things I can help with: I can flag to Deepa that a structured re-onboarding catch-up would be helpful, and I can also connect you with HR ops if you have questions about the flexible work policy for new parents. Want either of those?" },
    { sender: "employee", text: "Both actually. The flexible hours info would be great." },
    { sender: "pulse", text: "On it! I'll route the re-onboarding request to Deepa and send you the flexible work policy details from HR. Ravi — congratulations again, and don't hesitate to reach out if you need anything as you settle back in.", meta: { sentiment: 3.4, themes: ["Re-onboarding gap", "New parent adjustment", "Manager transition"], action: "Routed: re-onboarding to manager, flex policy to HR ops", routed_to: "Manager + HR Operations" } },
  ],
  "Bereavement Leave Return": [
    { sender: "pulse", text: "Hi Ananya, I wanted to check in gently. I know you've been through a really difficult time. There's no pressure to share anything — I just wanted you to know support is available whenever you need it." },
    { sender: "employee", text: "Thank you. It's been tough. Coming back to work has been a mixed bag — the routine helps, but some days are harder than others." },
    { sender: "pulse", text: "That's completely understandable, and there's no 'right' way to navigate this. I want to make sure you know that GC's Employee Assistance Program offers confidential counseling — would you like me to share those details with you?" },
    { sender: "employee", text: "Yes, that would be helpful. I've been thinking about talking to someone." },
    { sender: "pulse", text: "I'm really glad you're open to that. I'll send you the EAP details right away — it's completely confidential and available 24/7. Is there anything from your team or manager that would help make the day-to-day easier right now?" },
    { sender: "employee", text: "Vikram has been really understanding. I think I'm okay on that front." },
    { sender: "pulse", text: "That's great to hear. Ananya, please know you can reach out anytime — whether it's through me or directly to HR. Take care of yourself. \u2764\uFE0F", meta: { sentiment: 2.8, themes: ["Grief support", "EAP referral", "Positive manager relationship"], action: "Routed: EAP details sent to employee", routed_to: "EAP / Counseling" } },
  ],
  "Relocation (Bangalore to Hyderabad)": [
    { sender: "pulse", text: "Hey Arun! I saw you recently relocated to Hyderabad — that's a big move. How's the transition going?" },
    { sender: "employee", text: "It's been okay. Still getting used to the new city. The remote setup is fine but I do miss the Bangalore office energy." },
    { sender: "pulse", text: "Totally get that — the social side of a move can take time. Are you connected with the Hyderabad folks yet? I know there's a small GC crew there." },
    { sender: "employee", text: "Not really, haven't had the chance. Also, I need to figure out if there are any tax or compliance things I need to update." },
    { sender: "pulse", text: "Good thinking on the compliance front — I'll route that to HR ops so they can walk you through the state-specific stuff (PF, tax declarations, etc.). And I'll ask the Hyderabad team lead to loop you into their local meetups. Sound good?" },
    { sender: "employee", text: "That would be great, thanks!" },
    { sender: "pulse", text: "Done! HR ops will reach out about the compliance updates, and you should hear from the Hyderabad crew soon. Hope the new city treats you well, Arun!", meta: { sentiment: 3.5, themes: ["Relocation adjustment", "Social connection", "Compliance update needed"], action: "Routed: tax/compliance to HR ops, social connection to local team", routed_to: "HR Operations + Local Team" } },
  ],
};

// ─── COMPONENTS ───

const TierBadge = ({ tier }) => {
  const config = {
    1: { label: "Celebratory", bg: PISTACHIO, color: PURPLE },
    2: { label: "Transitional", bg: CREAM, color: PURPLE },
    3: { label: "Sensitive", bg: "#FFD4D4", color: PURPLE },
  };
  const c = config[tier] || config[1];
  return (
    <span style={{ background: c.bg, color: c.color, padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>
      Tier {tier} — {c.label}
    </span>
  );
};

const StatusDot = ({ status }) => {
  const colors = { completed: GREEN, in_progress: YELLOW, pending: SKY, upcoming: LAVENDER };
  const labels = { completed: "Completed", in_progress: "In Progress", pending: "Pending", upcoming: "Upcoming" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[status] || "#ccc", display: "inline-block" }} />
      {labels[status] || status}
    </span>
  );
};

const SentimentBar = ({ score }) => {
  if (!score) return <span style={{ color: "#999", fontSize: 12 }}>—</span>;
  const color = score >= 4 ? GREEN : score >= 3 ? YELLOW : RED;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 60, height: 6, borderRadius: 3, background: `${PURPLE}15` }}>
        <div style={{ width: `${(score / 5) * 100}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{score.toFixed(1)}</span>
    </div>
  );
};

// Chat Bubble
const ChatBubble = ({ message, isAgent }) => (
  <div style={{ display: "flex", justifyContent: isAgent ? "flex-start" : "flex-end", marginBottom: 12 }}>
    {isAgent && (
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${PURPLE})`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, marginTop: 2 }}>
        <span style={{ color: OFF_WHITE, fontSize: 11, fontWeight: 700 }}>P</span>
      </div>
    )}
    <div style={{
      maxWidth: "75%",
      padding: "10px 14px",
      borderRadius: isAgent ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
      background: isAgent ? "#fff" : PURPLE,
      color: isAgent ? PURPLE : OFF_WHITE,
      fontSize: 13.5,
      lineHeight: 1.55,
      boxShadow: isAgent ? "0 1px 3px rgba(42,0,57,0.08)" : "none",
    }}>
      {message}
    </div>
  </div>
);

// Conversation outcome card
const OutcomeCard = ({ meta }) => (
  <div style={{ background: `${CREAM}80`, borderRadius: 12, padding: 16, margin: "16px 0", border: `1px solid ${YELLOW}40` }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Conversation Outcome</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <div>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>Sentiment Score</div>
        <SentimentBar score={meta.sentiment} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>Routed To</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: PURPLE }}>{meta.routed_to}</div>
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Themes Detected</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {meta.themes.map((t, i) => (
            <span key={i} style={{ background: `${VIOLET}18`, color: VIOLET, padding: "2px 8px", borderRadius: 8, fontSize: 11, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>Action Taken</div>
        <div style={{ fontSize: 12, color: PURPLE }}>{meta.action}</div>
      </div>
    </div>
  </div>
);

// ─── MAIN APP ───
export default function PulsePrototype() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatIndex, setChatIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [improvementsOpen, setImprovementsOpen] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Simulate conversation playback
  const startConversation = (employee, milestone) => {
    const script = CONVERSATION_SCRIPTS[milestone.event];
    if (!script) return;
    setActiveConversation({ employee, milestone, script });
    setChatMessages([]);
    setChatIndex(0);
    setActiveTab("conversation");
  };

  useEffect(() => {
    if (!activeConversation || chatIndex >= activeConversation.script.length) return;
    const msg = activeConversation.script[chatIndex];
    setIsTyping(true);
    const delay = msg.sender === "pulse" ? 1200 : 800;
    const timer = setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, msg]);
      setChatIndex(prev => prev + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [chatIndex, activeConversation]);

  // Aggregated stats
  const totalMilestones = EMPLOYEES.reduce((s, e) => s + e.milestones.length, 0);
  const completedMilestones = EMPLOYEES.reduce((s, e) => s + e.milestones.filter(m => m.status === "completed").length, 0);
  const avgSentiment = EMPLOYEES.reduce((s, e) => {
    const scores = e.milestones.filter(m => m.sentiment).map(m => m.sentiment);
    return s + (scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
  }, 0) / EMPLOYEES.length;
  const needsAttention = EMPLOYEES.filter(e => {
    const last = e.sentimentHistory[e.sentimentHistory.length - 1];
    return last && last.score < 3.5;
  });

  // Team sentiment for bar chart
  const teamSentiment = {};
  EMPLOYEES.forEach(e => {
    if (!teamSentiment[e.team]) teamSentiment[e.team] = [];
    const last = e.sentimentHistory[e.sentimentHistory.length - 1];
    if (last) teamSentiment[e.team].push(last.score);
  });
  const teamData = Object.entries(teamSentiment).map(([team, scores]) => ({
    team,
    score: +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
  })).sort((a, b) => b.score - a.score);

  // Milestone type distribution
  const profCount = EMPLOYEES.reduce((s, e) => s + e.milestones.filter(m => m.type === "professional").length, 0);
  const persCount = EMPLOYEES.reduce((s, e) => s + e.milestones.filter(m => m.type === "personal").length, 0);
  const pieData = [
    { name: "Professional", value: profCount, color: BLUE },
    { name: "Personal", value: persCount, color: MAGENTA },
  ];

  // Org sentiment trend (avg across all employees)
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const orgTrend = months.map(month => {
    const scores = EMPLOYEES.map(e => {
      const entry = e.sentimentHistory.find(h => h.month === month);
      return entry ? entry.score : 0;
    });
    return { month, score: +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) };
  });

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, fontFamily: "'Schibsted Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* ─── TOP BAR ─── */}
      <div style={{ background: PURPLE, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${VIOLET}, ${YELLOW})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: PURPLE, fontWeight: 800, fontSize: 14 }}>P</span>
          </div>
          <span style={{ color: OFF_WHITE, fontWeight: 700, fontSize: 17, letterSpacing: -0.3 }}>Pulse</span>
          <span style={{ color: `${OFF_WHITE}70`, fontSize: 12, marginLeft: 4 }}>Employee Milestone AI</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {[
            { key: "dashboard", label: "HR Dashboard" },
            { key: "employees", label: "Employees" },
            { key: "conversation", label: "Live Check-in" },
            { key: "improvements", label: "How to Improve" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? `${OFF_WHITE}20` : "transparent",
                color: activeTab === tab.key ? OFF_WHITE : `${OFF_WHITE}80`,
                border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── YELLOW ACCENT BAR ─── */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${YELLOW}, ${VIOLET}, ${BLUE})` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {/* ═══════ DASHBOARD TAB ═══════ */}
        {activeTab === "dashboard" && (
          <div>
            <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Engagement Dashboard</h2>
            <p style={{ color: `${PURPLE}90`, fontSize: 13, margin: "0 0 20px" }}>Real-time overview of employee milestone check-ins and sentiment</p>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Total Milestones", value: totalMilestones, sub: "Tracked this quarter", color: BLUE },
                { label: "Check-ins Completed", value: `${completedMilestones}/${totalMilestones}`, sub: `${Math.round((completedMilestones / totalMilestones) * 100)}% completion rate`, color: GREEN },
                { label: "Avg Sentiment", value: avgSentiment.toFixed(1), sub: "Across all check-ins", color: avgSentiment >= 3.8 ? GREEN : YELLOW },
                { label: "Needs Attention", value: needsAttention.length, sub: "Employees below 3.5 sentiment", color: needsAttention.length > 0 ? RED : GREEN },
              ].map((kpi, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)", borderLeft: `3px solid ${kpi.color}` }}>
                  <div style={{ fontSize: 11, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 6 }}>{kpi.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: PURPLE, lineHeight: 1.1 }}>{kpi.value}</div>
                  <div style={{ fontSize: 11, color: `${PURPLE}70`, marginTop: 4 }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
              {/* Org Sentiment Trend */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 12 }}>Org Sentiment Trend</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={orgTrend}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: PURPLE }} axisLine={false} tickLine={false} />
                    <YAxis domain={[3, 5]} tick={{ fontSize: 11, fill: PURPLE }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
                    <Line type="monotone" dataKey="score" stroke={VIOLET} strokeWidth={2.5} dot={{ fill: VIOLET, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Team Sentiment */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 12 }}>By Team</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={teamData} layout="vertical">
                    <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: PURPLE }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="team" tick={{ fontSize: 11, fill: PURPLE }} axisLine={false} tickLine={false} width={65} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none" }} />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
                      {teamData.map((entry, i) => (
                        <Cell key={i} fill={entry.score >= 4 ? GREEN : entry.score >= 3.5 ? YELLOW : RED} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Milestone Type Pie */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 12 }}>Milestone Types</div>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4 }}>
                  {pieData.map((d, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: PURPLE }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                      {d.name} ({d.value})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Attention Alerts */}
            {needsAttention.length > 0 && (
              <div style={{ background: `${RED}10`, border: `1px solid ${RED}30`, borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: RED, display: "inline-block" }} />
                  Attention Required
                </div>
                {needsAttention.map(e => (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${RED}15` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${PURPLE}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: PURPLE }}>{e.avatar}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: `${PURPLE}70` }}>{e.milestones.find(m => m.status === "completed" || m.status === "in_progress")?.event}</div>
                      </div>
                    </div>
                    <SentimentBar score={e.sentimentHistory[e.sentimentHistory.length - 1]?.score} />
                  </div>
                ))}
              </div>
            )}

            {/* Recent Check-ins */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 12 }}>Recent Check-ins</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${PURPLE}15` }}>
                      {["Employee", "Milestone", "Type", "Tier", "Status", "Sentiment"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EMPLOYEES.flatMap(e => e.milestones.map((m, mi) => ({ employee: e, milestone: m, mi }))).sort((a, b) => new Date(b.milestone.date) - new Date(a.milestone.date)).slice(0, 8).map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${PURPLE}08`, cursor: "pointer" }}
                          onClick={() => { setSelectedEmployee(row.employee); setActiveTab("employees"); }}>
                        <td style={{ padding: "10px", color: PURPLE, fontWeight: 500 }}>{row.employee.name}</td>
                        <td style={{ padding: "10px", color: PURPLE }}>{row.milestone.event}</td>
                        <td style={{ padding: "10px" }}>
                          <span style={{ background: row.milestone.type === "professional" ? `${BLUE}15` : `${MAGENTA}15`, color: row.milestone.type === "professional" ? BLUE : MAGENTA, padding: "2px 8px", borderRadius: 8, fontSize: 11, fontWeight: 500 }}>
                            {row.milestone.type}
                          </span>
                        </td>
                        <td style={{ padding: "10px" }}><TierBadge tier={row.milestone.tier} /></td>
                        <td style={{ padding: "10px" }}><StatusDot status={row.milestone.status} /></td>
                        <td style={{ padding: "10px" }}><SentimentBar score={row.milestone.sentiment} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ EMPLOYEES TAB ═══════ */}
        {activeTab === "employees" && (
          <div>
            <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Employee Profiles</h2>
            <p style={{ color: `${PURPLE}90`, fontSize: 13, margin: "0 0 20px" }}>Click an employee to view their milestone history and start a check-in</p>

            <div style={{ display: "grid", gridTemplateColumns: selectedEmployee ? "300px 1fr" : "1fr", gap: 16 }}>
              {/* Employee List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {EMPLOYEES.map(e => (
                  <div
                    key={e.id}
                    onClick={() => setSelectedEmployee(e)}
                    style={{
                      background: selectedEmployee?.id === e.id ? "#fff" : `${OFF_WHITE}`,
                      border: selectedEmployee?.id === e.id ? `2px solid ${VIOLET}` : "2px solid transparent",
                      borderRadius: 12, padding: 14, cursor: "pointer",
                      boxShadow: selectedEmployee?.id === e.id ? `0 2px 8px ${VIOLET}20` : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}30, ${BLUE}30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: PURPLE }}>{e.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: `${PURPLE}70` }}>{e.role} · {e.team}</div>
                      </div>
                      <SentimentBar score={e.sentimentHistory[e.sentimentHistory.length - 1]?.score} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Employee Detail */}
              {selectedEmployee && (
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: OFF_WHITE }}>{selectedEmployee.avatar}</div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: PURPLE }}>{selectedEmployee.name}</div>
                      <div style={{ fontSize: 13, color: `${PURPLE}80` }}>{selectedEmployee.role} · {selectedEmployee.team} · Tenure: {selectedEmployee.tenure}</div>
                      <div style={{ fontSize: 12, color: `${PURPLE}60` }}>Manager: {selectedEmployee.manager}</div>
                    </div>
                  </div>

                  {/* Sentiment Trend */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 8 }}>Sentiment Trend</div>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={selectedEmployee.sentimentHistory}>
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: PURPLE }} axisLine={false} tickLine={false} />
                        <YAxis domain={[2, 5]} tick={{ fontSize: 11, fill: PURPLE }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
                        <Line type="monotone" dataKey="score" stroke={VIOLET} strokeWidth={2} dot={{ fill: VIOLET, r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Milestones */}
                  <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 10 }}>Milestones</div>
                  {selectedEmployee.milestones.map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", marginBottom: 8, background: `${OFF_WHITE}80`, borderRadius: 10, border: `1px solid ${PURPLE}08` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>{m.event}</span>
                          <TierBadge tier={m.tier} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: `${PURPLE}70` }}>
                          <span>{m.date}</span>
                          <StatusDot status={m.status} />
                          {m.sentiment && <SentimentBar score={m.sentiment} />}
                        </div>
                      </div>
                      {CONVERSATION_SCRIPTS[m.event] && (
                        <button
                          onClick={(e) => { e.stopPropagation(); startConversation(selectedEmployee, m); }}
                          style={{
                            background: m.status === "pending" ? PURPLE : `${PURPLE}10`,
                            color: m.status === "pending" ? OFF_WHITE : PURPLE,
                            border: "none", padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                            fontSize: 12, fontWeight: 600, transition: "all 0.2s",
                          }}
                        >
                          {m.status === "pending" ? "Start Check-in" : "View Conversation"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════ CONVERSATION TAB ═══════ */}
        {activeTab === "conversation" && (
          <div>
            <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Live Check-in</h2>
            {!activeConversation ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${VIOLET}20, ${BLUE}20)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>💬</div>
                <p style={{ color: `${PURPLE}80`, fontSize: 14, marginBottom: 16 }}>No active conversation. Go to the Employees tab and click "Start Check-in" or "View Conversation" on a milestone.</p>
                <button
                  onClick={() => setActiveTab("employees")}
                  style={{ background: PURPLE, color: OFF_WHITE, border: "none", padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  Go to Employees
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginTop: 16 }}>
                {/* Chat Window */}
                <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(42,0,57,0.06)", display: "flex", flexDirection: "column", height: 520 }}>
                  {/* Chat Header */}
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${PURPLE}10`, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: OFF_WHITE }}>{activeConversation.employee.avatar}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>Check-in with {activeConversation.employee.name}</div>
                      <div style={{ fontSize: 11, color: `${PURPLE}70` }}>{activeConversation.milestone.event} · <TierBadge tier={activeConversation.milestone.tier} /></div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 11, color: `${PURPLE}50` }}>via Slack DM</div>
                  </div>

                  {/* Chat Body */}
                  <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                    {chatMessages.map((msg, i) => (
                      <div key={i}>
                        <ChatBubble message={msg.text} isAgent={msg.sender === "pulse"} />
                        {msg.meta && <OutcomeCard meta={msg.meta} />}
                      </div>
                    ))}
                    {isTyping && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", color: `${PURPLE}60`, fontSize: 12 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${PURPLE})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: OFF_WHITE, fontSize: 9, fontWeight: 700 }}>P</span>
                        </div>
                        <span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>typing...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input (disabled - prototype) */}
                  <div style={{ padding: "12px 16px", borderTop: `1px solid ${PURPLE}10`, display: "flex", gap: 8 }}>
                    <input
                      disabled
                      placeholder="Simulated conversation — messages play automatically"
                      style={{ flex: 1, border: `1px solid ${PURPLE}15`, borderRadius: 8, padding: "8px 12px", fontSize: 13, background: `${OFF_WHITE}50`, color: `${PURPLE}60` }}
                    />
                    <button disabled style={{ background: `${PURPLE}30`, color: OFF_WHITE, border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Send</button>
                  </div>
                </div>

                {/* Sidebar Context */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Employee Context</div>
                    {[
                      ["Name", activeConversation.employee.name],
                      ["Role", activeConversation.employee.role],
                      ["Team", activeConversation.employee.team],
                      ["Tenure", activeConversation.employee.tenure],
                      ["Manager", activeConversation.employee.manager],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
                        <span style={{ color: `${PURPLE}70` }}>{k}</span>
                        <span style={{ color: PURPLE, fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Conversation Config</div>
                    {[
                      ["Milestone", activeConversation.milestone.event],
                      ["Type", activeConversation.milestone.type],
                      ["Channel", "Slack DM"],
                      ["AI Model", "Claude Sonnet 4.6"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
                        <span style={{ color: `${PURPLE}70` }}>{k}</span>
                        <span style={{ color: PURPLE, fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 8 }}><TierBadge tier={activeConversation.milestone.tier} /></div>
                  </div>

                  <div style={{ background: `${CREAM}60`, borderRadius: 12, padding: 16, border: `1px solid ${YELLOW}30` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, marginBottom: 6 }}>Guardrails Active</div>
                    {["No clinical diagnoses", "No promises on behalf of org", "Always offer human escalation", "Respect opt-out requests", "Max 7 exchanges per session"].map((g, i) => (
                      <div key={i} style={{ fontSize: 11, color: `${PURPLE}90`, padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: GREEN, fontSize: 13 }}>✓</span> {g}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ IMPROVEMENTS TAB ═══════ */}
        {activeTab === "improvements" && (
          <div>
            <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>How This Prototype Can Be Improved</h2>
            <p style={{ color: `${PURPLE}90`, fontSize: 13, margin: "0 0 24px" }}>Key areas to evolve from prototype to production-ready system</p>

            {[
              {
                title: "1. Real Claude API Integration",
                priority: "Critical",
                priorityColor: RED,
                current: "Conversations are pre-scripted and play back automatically. There's no actual AI behind the dialogue.",
                improvement: "Connect to Claude API with carefully crafted system prompts that include employee context, sensitivity tier, and persona instructions. Use Claude's tool-use feature so the agent can look up benefits, check leave balance, or schedule meetings mid-conversation. This turns it from a demo into a real adaptive agent.",
                effort: "Medium — Claude API + system prompt engineering + tool definitions",
              },
              {
                title: "2. HRIS Event Webhook Integration",
                priority: "Critical",
                priorityColor: RED,
                current: "Employee data and milestones are hardcoded. No real event detection.",
                improvement: "Connect to your HRIS (Darwinbox, BambooHR, etc.) via webhooks or daily API sync. Set up event listeners for: role changes, manager changes, anniversary dates, leave type changes, and probation dates. Use n8n or Make as the orchestration layer — no custom backend needed. Add a self-reporting form in the web portal for personal milestones employees want to share voluntarily.",
                effort: "Medium — API integration + workflow automation setup",
              },
              {
                title: "3. Real Multi-Channel Delivery",
                priority: "High",
                priorityColor: YELLOW,
                current: "Shows a simulated Slack conversation in a browser window. No actual Slack, email, or web chat integration.",
                improvement: "Build a Slack bot that sends DMs using Slack's Web API. For email, use a template-based system (SendGrid or Gmail API) with reply parsing so employees can respond naturally. For web, embed a chat widget (Voiceflow or Botpress frontend) connected to Claude on the backend. Let employees set their preferred channel in their profile.",
                effort: "High — three separate channel integrations with unified conversation state",
              },
              {
                title: "4. Conversation Memory & Context",
                priority: "High",
                priorityColor: YELLOW,
                current: "Each conversation is independent. The agent doesn't remember previous check-ins.",
                improvement: "Store conversation summaries and key themes in a vector database or structured store (Airtable). Before each new check-in, retrieve the employee's last 2-3 conversation summaries and include them in the Claude system prompt. This enables continuity: 'Last time we spoke, you mentioned workload concerns — how's that been going?' This is what transforms a chatbot into a trusted companion.",
                effort: "Medium — conversation summarization + retrieval + prompt injection",
              },
              {
                title: "5. Smarter Sensitivity Detection",
                priority: "High",
                priorityColor: YELLOW,
                current: "Sensitivity tiers are manually assigned per milestone type. No real-time sentiment adaptation.",
                improvement: "Use Claude's structured output to score sentiment in real-time during the conversation (not just at the end). If an employee's responses indicate distress in what was expected to be a Tier 1 (celebratory) conversation, dynamically shift the tone to Tier 2 or Tier 3. Add a mid-conversation 'temperature check' where the agent recalibrates its approach based on accumulated signals.",
                effort: "Medium — real-time sentiment scoring + dynamic prompt switching",
              },
              {
                title: "6. Manager Nudge System",
                priority: "Medium",
                priorityColor: SEA,
                current: "Dashboard shows data but doesn't actively push insights to managers.",
                improvement: "Build a monthly Slack DM or email to each manager with: team-level sentiment summary (never individual), anonymized top themes (e.g., '3 team members flagged unclear priorities'), suggested 1:1 talking points generated by Claude, and links to relevant microlearning resources. Include a feedback loop where managers can mark nudges as 'acted on' to close the loop.",
                effort: "Medium — aggregation logic + scheduled delivery + feedback tracking",
              },
              {
                title: "7. Employee Self-Service Portal",
                priority: "Medium",
                priorityColor: SEA,
                current: "No employee-facing view. Only the HR dashboard is shown.",
                improvement: "Build a lightweight web portal where employees can: view their own sentiment trend over time, read past conversation summaries (their personal journal), track status of support requests they've made, set their preferred check-in channel and frequency, opt out or snooze check-ins, and self-report personal milestones. This gives employees ownership and builds trust.",
                effort: "Medium — authenticated web app with personal data views",
              },
              {
                title: "8. Consent & Privacy Controls",
                priority: "Critical",
                priorityColor: RED,
                current: "No consent management. All data is visible to the HR dashboard without employee approval.",
                improvement: "Add a per-conversation consent step at the end: 'Here's a summary of our chat. I'd like to share [specific theme] with [specific audience] — is that okay?' Store consent records alongside conversation data. Build a DPDPA-compliant data deletion workflow where employees can request erasure of all their Pulse data. Implement data retention policies with automatic anonymization after 12 months.",
                effort: "High — consent UI + data governance + compliance audit trail",
              },
              {
                title: "9. Actionable Routing Engine",
                priority: "Medium",
                priorityColor: SEA,
                current: "The conversation outcome card shows routing targets but doesn't actually create tickets or send referrals.",
                improvement: "Use Claude's tool-use to trigger real actions: create a Jira/Asana ticket for HR ops, send EAP contact details via email, add a talking point to the manager's 1:1 agenda in Notion, or schedule a follow-up check-in. Each routing action should be confirmed with the employee before execution.",
                effort: "Medium — tool-use definitions + third-party API integrations",
              },
              {
                title: "10. Analytics & Continuous Improvement",
                priority: "Low",
                priorityColor: LAVENDER,
                current: "Dashboard shows basic charts but no predictive analytics or conversation quality metrics.",
                improvement: "Add: conversation quality scoring (did the employee engage meaningfully or give one-word answers?), check-in completion and opt-out trends as leading indicators, correlation analysis between milestone type and sentiment outcomes, A/B testing framework for different conversation openings, and quarterly 'Pulse health report' auto-generated by Claude summarizing org-wide themes, trends, and recommendations.",
                effort: "High — analytics pipeline + ML-lite features + reporting automation",
              },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: "0 1px 4px rgba(42,0,57,0.06)", borderLeft: `3px solid ${item.priorityColor}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: PURPLE, margin: 0 }}>{item.title}</h3>
                  <span style={{ background: `${item.priorityColor}20`, color: item.priorityColor === YELLOW ? PURPLE : item.priorityColor, padding: "2px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{item.priority}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}60`, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Current State (Prototype)</div>
                    <div style={{ fontSize: 13, color: `${PURPLE}90`, lineHeight: 1.5, background: `${RED}08`, padding: 10, borderRadius: 8 }}>{item.current}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}60`, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Production Improvement</div>
                    <div style={{ fontSize: 13, color: `${PURPLE}90`, lineHeight: 1.5, background: `${GREEN}08`, padding: 10, borderRadius: 8 }}>{item.improvement}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: `${PURPLE}70`, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 600 }}>Effort:</span> {item.effort}
                </div>
              </div>
            ))}

            <div style={{ background: `${CREAM}80`, borderRadius: 12, padding: 20, marginTop: 16, border: `1px solid ${YELLOW}40` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: PURPLE, margin: "0 0 10px" }}>Recommended Build Order</h3>
              <div style={{ fontSize: 13, color: PURPLE, lineHeight: 1.7 }}>
                <strong>Phase 1 (Weeks 1–4):</strong> Items 1 + 2 + 8 — Get real AI conversations working with HRIS data and proper consent. Pilot on Slack only with one team.
                <br /><br />
                <strong>Phase 2 (Weeks 5–8):</strong> Items 3 + 4 + 5 — Add email channel, conversation memory, and dynamic sensitivity. This is where it starts feeling like a real companion.
                <br /><br />
                <strong>Phase 3 (Weeks 9–12):</strong> Items 6 + 7 + 9 — Manager nudges, employee portal, and actionable routing. The system now creates real organizational value.
                <br /><br />
                <strong>Phase 4 (Weeks 13–16):</strong> Item 10 — Analytics, A/B testing, and continuous improvement. Scale to full org.
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${PURPLE}20; border-radius: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}
