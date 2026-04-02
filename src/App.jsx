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

// ─── MOCK DATA (Mix of Indian + Western names) ───
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
  { id: 2, name: "James Mitchell", role: "Product Manager", team: "Growth", tenure: "1y 8m", avatar: "JM", manager: "Deepa Nair",
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
  { id: 4, name: "Sarah Chen", role: "Data Analyst", team: "Analytics", tenure: "0y 11m", avatar: "SC", manager: "Meera Joshi",
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
  { id: 6, name: "Emily Rodriguez", role: "Backend Engineer", team: "Platform", tenure: "2y 0m", avatar: "ER", manager: "Arjun Mehta",
    milestones: [
      { type: "professional", event: "2-Year Work Anniversary", date: "2026-04-05", tier: 1, status: "pending", sentiment: null },
      { type: "personal", event: "Relocation (Bangalore to Hyderabad)", date: "2026-03-15", tier: 2, status: "completed", sentiment: 3.5 },
    ],
    sentimentHistory: [
      { month: "Oct", score: 3.9 }, { month: "Nov", score: 3.7 }, { month: "Dec", score: 3.5 },
      { month: "Jan", score: 3.6 }, { month: "Feb", score: 3.4 }, { month: "Mar", score: 3.5 },
    ]
  },
  { id: 7, name: "Rohan Kapoor", role: "Solutions Architect", team: "Platform", tenure: "1y 6m", avatar: "RK", manager: "Arjun Mehta",
    milestones: [
      { type: "professional", event: "First Project Lead Assignment", date: "2026-03-05", tier: 1, status: "completed", sentiment: 3.2 },
      { type: "personal", event: "Newborn (First Child)", date: "2026-02-20", tier: 1, status: "completed", sentiment: 4.6 },
    ],
    sentimentHistory: [
      { month: "Oct", score: 4.0 }, { month: "Nov", score: 3.9 }, { month: "Dec", score: 3.7 },
      { month: "Jan", score: 3.5 }, { month: "Feb", score: 4.6 }, { month: "Mar", score: 3.2 },
    ]
  },
  { id: 8, name: "Lisa Thompson", role: "Marketing Lead", team: "Growth", tenure: "3y 0m", avatar: "LT", manager: "Deepa Nair",
    milestones: [
      { type: "professional", event: "3-Year Work Anniversary", date: "2026-03-18", tier: 1, status: "completed", sentiment: 4.1 },
      { type: "professional", event: "Team Expansion (3 new hires)", date: "2026-04-10", tier: 2, status: "upcoming", sentiment: null },
    ],
    sentimentHistory: [
      { month: "Oct", score: 4.3 }, { month: "Nov", score: 4.2 }, { month: "Dec", score: 4.0 },
      { month: "Jan", score: 4.1 }, { month: "Feb", score: 4.2 }, { month: "Mar", score: 4.1 },
    ]
  },
];

// ─── THEMES DATA (aggregated from conversations) ───
const THEME_DATA = [
  { theme: "Workload Management", count: 6, avgSentiment: 3.5, trend: "up", color: BLUE },
  { theme: "Manager Relationship", count: 5, avgSentiment: 4.1, trend: "stable", color: GREEN },
  { theme: "Career Growth", count: 4, avgSentiment: 3.8, trend: "up", color: VIOLET },
  { theme: "Re-onboarding Gap", count: 3, avgSentiment: 3.2, trend: "down", color: YELLOW },
  { theme: "Work-Life Balance", count: 3, avgSentiment: 3.4, trend: "down", color: MAGENTA },
  { theme: "Social Connection", count: 3, avgSentiment: 3.6, trend: "stable", color: SEA },
  { theme: "Compliance & Admin", count: 2, avgSentiment: 3.7, trend: "stable", color: SKY },
  { theme: "EAP / Mental Health", count: 2, avgSentiment: 2.9, trend: "down", color: RED },
];

// ─── CONVERSATION SCRIPTS ───
const CONVERSATION_SCRIPTS = {
  "3-Year Work Anniversary": [
    { sender: "ai", text: "Hey Priya! \uD83C\uDF89 Today marks 3 years at GC. That's a really meaningful milestone. How are you feeling about your journey here so far?" },
    { sender: "employee", text: "Pretty good! The promotion last month was a nice recognition. Though honestly, the last quarter was intense." },
    { sender: "ai", text: "Congrats again on that promotion - well deserved! I hear you on the intensity of Q1. Is the pace something you're managing okay, or is there something that would make things more sustainable?" },
    { sender: "employee", text: "I think I could use clearer priorities. Lots of competing asks from different stakeholders right now." },
    { sender: "ai", text: "That's super valid - especially in a new senior role where visibility increases. I can flag \"prioritization support\" as a theme for your manager's next 1:1 talking points, without sharing specifics. Want me to do that?" },
    { sender: "employee", text: "Yeah, that would actually be really helpful." },
    { sender: "ai", text: "Done! I've noted this for Arjun's next nudge. And Priya - 3 years is no small thing. The team's lucky to have you here. Is there anything else on your mind?" },
    { sender: "employee", text: "No, I think that covers it. Thanks for checking in!" },
    { sender: "ai", text: "Anytime! Have a great rest of your day. \uD83D\uDE0A", meta: { sentiment: 4.2, themes: ["Workload management", "Stakeholder prioritization", "Career growth"], action: "Manager nudge: prioritization support", routed_to: "Manager 1:1 talking points" } },
  ],
  "Return from Paternity Leave": [
    { sender: "ai", text: "Hey James, welcome back! Hope you had a wonderful time with the new addition to your family. How are you settling back in?" },
    { sender: "employee", text: "Thanks! The baby is amazing but I'm not going to lie, the sleep deprivation is real. Trying to get back into the groove." },
    { sender: "ai", text: "Ha, I can only imagine! That transition back is one of the harder adjustments. Is there anything from the team or org side that would help make the ramp-up smoother?" },
    { sender: "employee", text: "Honestly, I'm a bit lost on what changed while I was away. New manager, new priorities - feels like I missed a lot." },
    { sender: "ai", text: "That makes total sense - a lot shifted in your absence. A couple of things I can help with: I can flag to Deepa that a structured re-onboarding catch-up would be helpful, and I can also connect you with HR ops if you have questions about the flexible work policy for new parents. Want either of those?" },
    { sender: "employee", text: "Both actually. The flexible hours info would be great." },
    { sender: "ai", text: "On it! I'll route the re-onboarding request to Deepa and send you the flexible work policy details from HR. James - congratulations again, and don't hesitate to reach out if you need anything as you settle back in.", meta: { sentiment: 3.4, themes: ["Re-onboarding gap", "New parent adjustment", "Manager transition", "Work-life balance"], action: "Routed: re-onboarding to manager, flex policy to HR ops", routed_to: "Manager + HR Operations" } },
  ],
  "Bereavement Leave Return": [
    { sender: "ai", text: "Hi Ananya, I wanted to check in gently. I know you've been through a really difficult time. There's no pressure to share anything - I just wanted you to know support is available whenever you need it." },
    { sender: "employee", text: "Thank you. It's been tough. Coming back to work has been a mixed bag - the routine helps, but some days are harder than others." },
    { sender: "ai", text: "That's completely understandable, and there's no 'right' way to navigate this. I want to make sure you know that GC's Employee Assistance Program offers confidential counseling - would you like me to share those details with you?" },
    { sender: "employee", text: "Yes, that would be helpful. I've been thinking about talking to someone." },
    { sender: "ai", text: "I'm really glad you're open to that. I'll send you the EAP details right away - it's completely confidential and available 24/7. Is there anything from your team or manager that would help make the day-to-day easier right now?" },
    { sender: "employee", text: "Vikram has been really understanding. I think I'm okay on that front." },
    { sender: "ai", text: "That's great to hear. Ananya, please know you can reach out anytime - whether it's through me or directly to HR. Take care of yourself. \u2764\uFE0F", meta: { sentiment: 2.8, themes: ["Grief support", "EAP referral", "Manager relationship"], action: "Routed: EAP details sent to employee", routed_to: "EAP / Counseling" } },
  ],
  "Relocation (Bangalore to Hyderabad)": [
    { sender: "ai", text: "Hey Emily! I saw you recently relocated to Hyderabad - that's a big move. How's the transition going?" },
    { sender: "employee", text: "It's been okay. Still getting used to the new city. The remote setup is fine but I do miss the Bangalore office energy." },
    { sender: "ai", text: "Totally get that - the social side of a move can take time. Are you connected with the Hyderabad folks yet? I know there's a small GC crew there." },
    { sender: "employee", text: "Not really, haven't had the chance. Also, I need to figure out if there are any tax or compliance things I need to update." },
    { sender: "ai", text: "Good thinking on the compliance front - I'll route that to HR ops so they can walk you through the state-specific stuff (PF, tax declarations, etc.). And I'll ask the Hyderabad team lead to loop you into their local meetups. Sound good?" },
    { sender: "employee", text: "That would be great, thanks!" },
    { sender: "ai", text: "Done! HR ops will reach out about the compliance updates, and you should hear from the Hyderabad crew soon. Hope the new city treats you well, Emily!", meta: { sentiment: 3.5, themes: ["Relocation adjustment", "Social connection", "Compliance update needed"], action: "Routed: tax/compliance to HR ops, social connection to local team", routed_to: "HR Operations + Local Team" } },
  ],
  "First Project Lead Assignment": [
    { sender: "ai", text: "Hey Rohan! Congrats on being tapped to lead the Atlas project - that's a big vote of confidence from the team. How are you feeling about it?" },
    { sender: "employee", text: "Fine." },
    { sender: "ai", text: "Glad to hear it's going well! Leading a project for the first time can be exciting and a bit daunting at the same time. Is there anything specific about the role that you're finding challenging or energizing?",
      aiAnalysis: "One-word response 'Fine' detected. This is a low-engagement signal. The AI doesn't take it at face value - instead, it acknowledges positively, then asks a more specific question to draw out what's really going on. The open-ended follow-up gives Rohan space without pressure." },
    { sender: "employee", text: "Yeah." },
    { sender: "ai", text: "I notice you're keeping things brief - totally fine, no pressure to share more than you want. But just so you know, if things feel overwhelming or you'd like support with the transition to a lead role, I can connect you with a mentor who's been through this. Would that be useful, or is everything genuinely smooth?",
      aiAnalysis: "Second one-word response. The AI flags the pattern explicitly but non-judgmentally. Rather than pushing harder, it names the behavior ('keeping things brief') and offers a concrete resource. The 'or is everything genuinely smooth?' gives an easy out while signaling the AI is paying attention." },
    { sender: "employee", text: "Actually... I'm a bit stressed. The timeline is tight and I don't want to mess it up. It's my first time leading and I feel like everyone's watching." },
    { sender: "ai", text: "Thank you for sharing that, Rohan - that takes courage. Imposter syndrome on a first lead role is incredibly common, even for people much more senior. The fact that you were chosen says a lot about how the team sees your potential. Would it help if I flagged to Arjun that some mentorship or a lighter parallel workload during the project ramp-up could help you succeed?",
      aiAnalysis: "Breakthrough moment. The AI's patience with one-word answers paid off - Rohan opened up about real stress. The AI validates the emotion, normalizes it ('incredibly common'), reinforces confidence, and offers practical action. Sentiment analysis: initial 'Fine' was masking a 3.2 - the real signal was the declining trend line over recent months." },
    { sender: "employee", text: "Yeah, that would really help. Thanks for not giving up on me there." },
    { sender: "ai", text: "Never! That's exactly what I'm here for. I'll let Arjun know - no specifics, just that some structured support would help you thrive in this new role. You've got this, Rohan. \uD83D\uDCAA", meta: { sentiment: 3.2, themes: ["Imposter syndrome", "First-time leadership", "Workload management", "Mentorship need"], action: "Manager nudge: mentorship + workload support for project lead transition", routed_to: "Manager 1:1 talking points" } },
  ],
  // ─── DEMO CONVERSATION for "Try It" mode ───
  "Demo Check-in": [
    { sender: "ai", text: "Hey there! \uD83D\uDC4B Welcome to BelongIn. I'm the AI companion that checks in with employees during key life and career milestones. Want to see how I work? Just respond naturally - I'll show you what a real check-in feels like." },
    { sender: "employee", text: "Sure, let's try it!" },
    { sender: "ai", text: "Great! Let's pretend you just hit your 1-year anniversary at GC. \uD83C\uDF89 A whole year - that's worth celebrating! How's it been? What's the highlight of your first year?" },
    { sender: "employee", text: "It's been a rollercoaster honestly. Good team, but the pace is intense." },
    { sender: "ai", text: "A rollercoaster with a good team sounds like a net positive - but I hear you on the pace. Is the intensity something that feels sustainable, or are there moments where it tips into burnout territory?" },
    { sender: "employee", text: "Hmm, I'd say it's manageable most weeks. But when deadlines stack up it gets rough." },
    { sender: "ai", text: "That's a really honest assessment - and super useful to know. I can flag 'deadline clustering' as an anonymous theme for your team's manager, so they can think about workload distribution. I won't share any specifics about you. Want me to do that?" },
    { sender: "employee", text: "Yeah, that sounds good." },
    { sender: "ai", text: "Done! And happy first anniversary - the fact that you're reflecting thoughtfully on your experience means you care about making it work here. That's a great sign. \uD83D\uDE0A Anything else on your mind?",
      meta: { sentiment: 3.8, themes: ["Workload management", "Deadline clustering", "Team dynamics"], action: "Anonymous theme flagged: deadline clustering for team lead review", routed_to: "Team Lead (anonymized)" } },
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
      {c.label}
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
  if (!score) return <span style={{ color: "#999", fontSize: 12 }}>-</span>;
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

const ChatBubble = ({ message, isAgent, aiAnalysis }) => (
  <div>
    <div style={{ display: "flex", justifyContent: isAgent ? "flex-start" : "flex-end", marginBottom: aiAnalysis ? 4 : 12 }}>
      {isAgent && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${PURPLE})`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, marginTop: 2 }}>
          <span style={{ color: OFF_WHITE, fontSize: 10, fontWeight: 700 }}>B</span>
        </div>
      )}
      <div style={{
        maxWidth: "75%", padding: "10px 14px",
        borderRadius: isAgent ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
        background: isAgent ? "#fff" : PURPLE,
        color: isAgent ? PURPLE : OFF_WHITE,
        fontSize: 13.5, lineHeight: 1.55,
        boxShadow: isAgent ? "0 1px 3px rgba(42,0,57,0.08)" : "none",
      }}>
        {message}
      </div>
    </div>
    {aiAnalysis && (
      <div style={{ marginLeft: 40, marginBottom: 12, padding: "8px 12px", background: `${VIOLET}08`, borderRadius: 8, border: `1px dashed ${VIOLET}30`, fontSize: 11, color: `${PURPLE}90`, lineHeight: 1.5 }}>
        <span style={{ fontWeight: 700, color: VIOLET }}>AI Analysis: </span>{aiAnalysis}
      </div>
    )}
  </div>
);

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
export default function BelongIn() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatIndex, setChatIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [activeKPI, setActiveKPI] = useState(null);
  const [teamFilter, setTeamFilter] = useState(null);
  const [showConversation, setShowConversation] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const startConversation = (employee, milestone) => {
    const script = CONVERSATION_SCRIPTS[milestone.event];
    if (!script) return;
    setActiveConversation({ employee, milestone, script });
    setChatMessages([]);
    setChatIndex(0);
    setShowConversation(true);
  };

  const startDemoConversation = () => {
    const script = CONVERSATION_SCRIPTS["Demo Check-in"];
    setActiveConversation({ employee: { name: "You", avatar: "YO", role: "Colleague", team: "GC", tenure: "Testing", manager: "N/A" }, milestone: { event: "Demo Check-in", tier: 1, type: "demo" }, script });
    setChatMessages([]);
    setChatIndex(0);
    setActiveTab("tryit");
  };

  useEffect(() => {
    if (!activeConversation || chatIndex >= activeConversation.script.length) return;
    const msg = activeConversation.script[chatIndex];
    setIsTyping(true);
    const delay = msg.sender === "ai" ? 1200 : 800;
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

  const teamSentiment = {};
  EMPLOYEES.forEach(e => {
    if (!teamSentiment[e.team]) teamSentiment[e.team] = [];
    const last = e.sentimentHistory[e.sentimentHistory.length - 1];
    if (last) teamSentiment[e.team].push(last.score);
  });
  const teamData = Object.entries(teamSentiment).map(([team, scores]) => ({
    team, score: +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
  })).sort((a, b) => b.score - a.score);

  const profCount = EMPLOYEES.reduce((s, e) => s + e.milestones.filter(m => m.type === "professional").length, 0);
  const persCount = EMPLOYEES.reduce((s, e) => s + e.milestones.filter(m => m.type === "personal").length, 0);
  const pieData = [
    { name: "Professional", value: profCount, color: BLUE },
    { name: "Personal", value: persCount, color: MAGENTA },
  ];

  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const orgTrend = months.map(month => {
    const scores = EMPLOYEES.map(e => {
      const entry = e.sentimentHistory.find(h => h.month === month);
      return entry ? entry.score : 0;
    });
    return { month, score: +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) };
  });

  const filteredEmployees = teamFilter ? EMPLOYEES.filter(e => e.team === teamFilter) : EMPLOYEES;

  // Chat window component (reused in employees tab and tryit tab)
  const ChatWindow = ({ height = 520 }) => (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(42,0,57,0.06)", display: "flex", flexDirection: "column", height }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${PURPLE}10`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: OFF_WHITE }}>{activeConversation.employee.avatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>Check-in with {activeConversation.employee.name}</div>
          <div style={{ fontSize: 11, color: `${PURPLE}70` }}>{activeConversation.milestone.event} {activeConversation.milestone.tier && <> · <TierBadge tier={activeConversation.milestone.tier} /></>}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: `${PURPLE}50` }}>via Slack DM</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {chatMessages.map((msg, i) => (
          <div key={i}>
            <ChatBubble message={msg.text} isAgent={msg.sender === "ai"} aiAnalysis={msg.aiAnalysis} />
            {msg.meta && <OutcomeCard meta={msg.meta} />}
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", color: `${PURPLE}60`, fontSize: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${PURPLE})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: OFF_WHITE, fontSize: 9, fontWeight: 700 }}>B</span>
            </div>
            <span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${PURPLE}10`, display: "flex", gap: 8 }}>
        <input disabled placeholder="Simulated conversation - messages play automatically" style={{ flex: 1, border: `1px solid ${PURPLE}15`, borderRadius: 8, padding: "8px 12px", fontSize: 13, background: `${OFF_WHITE}50`, color: `${PURPLE}60` }} />
        <button disabled style={{ background: `${PURPLE}30`, color: OFF_WHITE, border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Send</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, fontFamily: "'Schibsted Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* ─── TOP BAR ─── */}
      <div style={{ background: PURPLE, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => { setActiveTab("dashboard"); setTeamFilter(null); setActiveKPI(null); }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${VIOLET}, ${YELLOW})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: PURPLE, fontWeight: 800, fontSize: 14 }}>B</span>
          </div>
          <span style={{ color: OFF_WHITE, fontWeight: 700, fontSize: 17, letterSpacing: -0.3 }}>BelongIn</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {[
            { key: "dashboard", label: "HR Dashboard" },
            { key: "employees", label: "Employees" },
            { key: "tryit", label: "Try the AI" },
            { key: "improvements", label: "How to Improve" },
          ].map(tab => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); if (tab.key === "tryit" && !activeConversation) startDemoConversation(); }}
              style={{
                background: activeTab === tab.key ? `${OFF_WHITE}20` : tab.key === "tryit" ? `${YELLOW}25` : "transparent",
                color: activeTab === tab.key ? OFF_WHITE : tab.key === "tryit" ? YELLOW : `${OFF_WHITE}80`,
                border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                fontSize: 13, fontWeight: activeTab === tab.key ? 600 : tab.key === "tryit" ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              {tab.key === "tryit" && "\uD83E\uDD16 "}{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 3, background: `linear-gradient(90deg, ${YELLOW}, ${VIOLET}, ${BLUE})` }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {/* ═══════ DASHBOARD TAB ═══════ */}
        {activeTab === "dashboard" && (
          <div>
            <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Engagement Dashboard</h2>
            <p style={{ color: `${PURPLE}90`, fontSize: 13, margin: "0 0 20px" }}>Real-time overview of employee milestone check-ins and sentiment</p>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: activeKPI ? 0 : 24 }}>
              {[
                { key: "milestones", label: "Total Milestones", value: totalMilestones, sub: "Tracked this quarter", color: BLUE },
                { key: "checkins", label: "Check-ins Completed", value: `${completedMilestones}/${totalMilestones}`, sub: `${Math.round((completedMilestones / totalMilestones) * 100)}% completion rate`, color: GREEN },
                { key: "sentiment", label: "Avg Sentiment", value: avgSentiment.toFixed(1), sub: "Across all check-ins", color: avgSentiment >= 3.8 ? GREEN : YELLOW },
                { key: "attention", label: "Needs Attention", value: needsAttention.length, sub: "Employees below 3.5 sentiment", color: needsAttention.length > 0 ? RED : GREEN },
              ].map((kpi, i) => (
                <div key={i} onClick={() => setActiveKPI(activeKPI === kpi.key ? null : kpi.key)}
                  style={{
                    background: activeKPI === kpi.key ? `${kpi.color}08` : "#fff",
                    borderRadius: 12, padding: 18, cursor: "pointer",
                    boxShadow: activeKPI === kpi.key ? `0 2px 12px ${kpi.color}25` : "0 1px 4px rgba(42,0,57,0.06)",
                    borderLeft: `3px solid ${kpi.color}`,
                    border: activeKPI === kpi.key ? `2px solid ${kpi.color}` : `2px solid transparent`,
                    borderLeftWidth: 3, borderLeftColor: kpi.color,
                    transition: "all 0.25s ease",
                    transform: activeKPI === kpi.key ? "translateY(-2px)" : "none",
                  }}
                >
                  <div style={{ fontSize: 11, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 6 }}>{kpi.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: PURPLE, lineHeight: 1.1 }}>{kpi.value}</div>
                  <div style={{ fontSize: 11, color: `${PURPLE}70`, marginTop: 4 }}>{kpi.sub}</div>
                  <div style={{ fontSize: 10, color: activeKPI === kpi.key ? kpi.color : `${PURPLE}40`, marginTop: 8, fontWeight: 600, letterSpacing: 0.5 }}>
                    {activeKPI === kpi.key ? "\u25B2 COLLAPSE" : "\u25BC DETAILS"}
                  </div>
                </div>
              ))}
            </div>

            {/* KPI Drill-Down */}
            {activeKPI && (
              <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", padding: 20, marginBottom: 24, boxShadow: "0 2px 8px rgba(42,0,57,0.06)", borderTop: `2px solid ${activeKPI === "milestones" ? BLUE : activeKPI === "checkins" ? GREEN : activeKPI === "sentiment" ? (avgSentiment >= 3.8 ? GREEN : YELLOW) : RED}` }}>
                {activeKPI === "milestones" && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 14 }}>All Milestones</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                      {[
                        { label: "Professional", count: EMPLOYEES.reduce((s, e) => s + e.milestones.filter(m => m.type === "professional").length, 0), color: BLUE },
                        { label: "Personal", count: EMPLOYEES.reduce((s, e) => s + e.milestones.filter(m => m.type === "personal").length, 0), color: MAGENTA },
                        { label: "Upcoming", count: EMPLOYEES.reduce((s, e) => s + e.milestones.filter(m => m.status === "upcoming" || m.status === "pending").length, 0), color: LAVENDER },
                      ].map((cat, i) => (
                        <div key={i} onClick={() => setActiveTab("employees")}
                          style={{ background: `${cat.color}10`, borderRadius: 10, padding: 14, textAlign: "center", cursor: "pointer", border: `1.5px solid transparent`, transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${cat.color}20`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          <div style={{ fontSize: 22, fontWeight: 700, color: cat.color }}>{cat.count}</div>
                          <div style={{ fontSize: 11, color: PURPLE, fontWeight: 500, marginTop: 2 }}>{cat.label}</div>
                          <div style={{ fontSize: 9, color: `${PURPLE}40`, marginTop: 4, fontWeight: 600 }}>VIEW ALL {"\u203A"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeKPI === "checkins" && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 14 }}>Check-in Completion by Employee</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {EMPLOYEES.map(e => {
                        const total = e.milestones.length;
                        const done = e.milestones.filter(m => m.status === "completed").length;
                        const pct = Math.round((done / total) * 100);
                        return (
                          <div key={e.id} onClick={() => { setSelectedEmployee(e); setActiveTab("employees"); }}
                              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: `${OFF_WHITE}80`, cursor: "pointer" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}30, ${BLUE}30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: PURPLE, flexShrink: 0 }}>{e.avatar}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>{e.name}</div>
                              <div style={{ fontSize: 11, color: `${PURPLE}60` }}>{e.role} \u00B7 {e.team}</div>
                            </div>
                            <div style={{ width: 120, marginRight: 8 }}>
                              <div style={{ height: 6, borderRadius: 3, background: `${PURPLE}12` }}>
                                <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: pct === 100 ? GREEN : pct >= 50 ? YELLOW : RED }} />
                              </div>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: pct === 100 ? GREEN : PURPLE, minWidth: 50, textAlign: "right" }}>{done}/{total}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {activeKPI === "sentiment" && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 14 }}>Sentiment Distribution by Employee</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {EMPLOYEES.slice().sort((a, b) => (a.sentimentHistory.at(-1)?.score || 0) - (b.sentimentHistory.at(-1)?.score || 0)).map(e => {
                        const current = e.sentimentHistory.at(-1)?.score || 0;
                        const prev = e.sentimentHistory.at(-2)?.score || 0;
                        const delta = current - prev;
                        return (
                          <div key={e.id} onClick={() => { setSelectedEmployee(e); setActiveTab("employees"); }}
                              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: current < 3.5 ? `${RED}06` : `${OFF_WHITE}80`, cursor: "pointer", border: current < 3.5 ? `1px solid ${RED}20` : "1px solid transparent" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}30, ${BLUE}30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: PURPLE, flexShrink: 0 }}>{e.avatar}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>{e.name}</div>
                              <div style={{ fontSize: 11, color: `${PURPLE}60` }}>{e.role} \u00B7 {e.team}</div>
                            </div>
                            <SentimentBar score={current} />
                            <div style={{ fontSize: 11, fontWeight: 600, color: delta > 0 ? GREEN : delta < 0 ? RED : `${PURPLE}50`, minWidth: 40, textAlign: "right" }}>
                              {delta > 0 ? `\u2191 ${delta.toFixed(1)}` : delta < 0 ? `\u2193 ${Math.abs(delta).toFixed(1)}` : "\u00B7"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {activeKPI === "attention" && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 14 }}>
                      {needsAttention.length > 0 ? "Employees Requiring Attention" : "All Clear! No Employees Below 3.5 Sentiment"}
                    </div>
                    {needsAttention.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {needsAttention.map(e => {
                          const current = e.sentimentHistory.at(-1)?.score || 0;
                          return (
                            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, background: `${RED}06`, border: `1px solid ${RED}20` }}>
                              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}30, ${BLUE}30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: PURPLE, flexShrink: 0 }}>{e.avatar}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: PURPLE }}>{e.name}</div>
                                <div style={{ fontSize: 12, color: `${PURPLE}70` }}>{e.role} \u00B7 {e.team} \u00B7 Manager: {e.manager}</div>
                              </div>
                              <SentimentBar score={current} />
                              <button onClick={() => { setSelectedEmployee(e); setActiveTab("employees"); }}
                                style={{ background: `${PURPLE}10`, color: PURPLE, border: "none", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                                View Profile
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "30px 20px" }}>
                        <div style={{ fontSize: 36, marginBottom: 8, color: GREEN }}>\u2713</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: PURPLE }}>Team sentiment is healthy</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
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

              {/* By Team -CLICKABLE */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 4 }}>By Team</div>
                <div style={{ fontSize: 10, color: `${PURPLE}50`, marginBottom: 8 }}>Click a bar to filter employees</div>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={teamData} layout="vertical" onClick={(data) => {
                    if (data?.activePayload?.[0]) {
                      const team = data.activePayload[0].payload.team;
                      setTeamFilter(team);
                      setActiveTab("employees");
                    }
                  }}>
                    <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: PURPLE }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="team" tick={{ fontSize: 11, fill: PURPLE }} axisLine={false} tickLine={false} width={65} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "none" }} />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16} style={{ cursor: "pointer" }}>
                      {teamData.map((entry, i) => (
                        <Cell key={i} fill={entry.score >= 4 ? GREEN : entry.score >= 3.5 ? YELLOW : RED} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 12 }}>Milestone Types</div>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
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

            {/* ─── THEMES SECTION ─── */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)", marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 14 }}>Top Themes from Check-ins</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {THEME_DATA.map((t, i) => {
                  const scoreColor = t.avgSentiment >= 4.0 ? GREEN : t.avgSentiment >= 3.0 ? YELLOW : RED;
                  const scoreLabel = t.avgSentiment >= 4.0 ? "Healthy" : t.avgSentiment >= 3.0 ? "Watch" : "At Risk";
                  return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: `${scoreColor}06`, border: `1px solid ${scoreColor}18` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${scoreColor}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: scoreColor, flexShrink: 0 }}>{t.count}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>{t.theme}</span>
                        <span style={{ background: `${scoreColor}18`, color: scoreColor, padding: "1px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>{scoreLabel}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: scoreColor }}>{t.avgSentiment.toFixed(1)}</div>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${PURPLE}10` }}>
                          <div style={{ width: `${(t.avgSentiment / 5) * 100}%`, height: "100%", borderRadius: 3, background: scoreColor, transition: "width 0.5s" }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: t.trend === "up" ? GREEN : t.trend === "down" ? RED : `${PURPLE}50` }}>
                          {t.trend === "up" ? "\u2191" : t.trend === "down" ? "\u2193" : "\u2192"}
                        </span>
                      </div>
                    </div>
                  </div>
                  );
                })}
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
                  <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${RED}15`, cursor: "pointer" }}
                    onClick={() => { setSelectedEmployee(e); setActiveTab("employees"); }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${PURPLE}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: PURPLE }}>{e.avatar}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: `${PURPLE}70` }}>{e.milestones.find(m => m.status === "completed" || m.status === "in_progress")?.event}</div>
                      </div>
                    </div>
                    <SentimentBar score={e.sentimentHistory.at(-1)?.score} />
                  </div>
                ))}
              </div>
            )}

            {/* Recent Check-ins */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 12 }}>Recent Check-ins</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${PURPLE}15` }}>
                    {["Employee", "Milestone", "Type", "Tier", "Status", "Sentiment"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.flatMap(e => e.milestones.map(m => ({ employee: e, milestone: m }))).sort((a, b) => new Date(b.milestone.date) - new Date(a.milestone.date)).slice(0, 8).map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${PURPLE}08`, cursor: "pointer" }}
                        onClick={() => { setSelectedEmployee(row.employee); setActiveTab("employees"); }}>
                      <td style={{ padding: "10px", color: PURPLE, fontWeight: 500 }}>{row.employee.name}</td>
                      <td style={{ padding: "10px", color: PURPLE }}>{row.milestone.event}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ background: row.milestone.type === "professional" ? `${BLUE}15` : `${MAGENTA}15`, color: row.milestone.type === "professional" ? BLUE : MAGENTA, padding: "2px 8px", borderRadius: 8, fontSize: 11, fontWeight: 500 }}>{row.milestone.type}</span>
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
        )}

        {/* ═══════ EMPLOYEES TAB ═══════ */}
        {activeTab === "employees" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 700, margin: 0 }}>Employee Profiles</h2>
              {teamFilter && (
                <button onClick={() => setTeamFilter(null)} style={{ background: `${VIOLET}15`, color: VIOLET, border: "none", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  Showing: {teamFilter} team \u00D7 Clear
                </button>
              )}
            </div>
            <p style={{ color: `${PURPLE}90`, fontSize: 13, margin: "0 0 20px" }}>Click an employee to view their milestone history and start a check-in</p>

            {showConversation && activeConversation ? (
              <div>
                <button onClick={() => { setShowConversation(false); setActiveConversation(null); }}
                  style={{ background: `${PURPLE}10`, color: PURPLE, border: "none", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
                  \u2190 Back to Employees
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
                  <ChatWindow />
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Employee Context</div>
                      {[["Name", activeConversation.employee.name], ["Role", activeConversation.employee.role], ["Team", activeConversation.employee.team], ["Tenure", activeConversation.employee.tenure], ["Manager", activeConversation.employee.manager]].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 }}>
                          <span style={{ color: `${PURPLE}70` }}>{k}</span>
                          <span style={{ color: PURPLE, fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: `${CREAM}60`, borderRadius: 12, padding: 16, border: `1px solid ${YELLOW}30` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, marginBottom: 6 }}>Guardrails Active</div>
                      {["No clinical diagnoses", "No promises on behalf of org", "Always offer human escalation", "Respect opt-out requests", "Unlimited exchanges per session"].map((g, i) => (
                        <div key={i} style={{ fontSize: 11, color: `${PURPLE}90`, padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: GREEN, fontSize: 13 }}>\u2713</span> {g}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: selectedEmployee ? "300px 1fr" : "1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredEmployees.map(e => (
                    <div key={e.id} onClick={() => setSelectedEmployee(e)}
                      style={{
                        background: selectedEmployee?.id === e.id ? "#fff" : OFF_WHITE,
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
                          <div style={{ fontSize: 11, color: `${PURPLE}70` }}>{e.role} \u00B7 {e.team}</div>
                        </div>
                        <SentimentBar score={e.sentimentHistory.at(-1)?.score} />
                      </div>
                    </div>
                  ))}
                </div>

                {selectedEmployee && (
                  <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${VIOLET}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: OFF_WHITE }}>{selectedEmployee.avatar}</div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: PURPLE }}>{selectedEmployee.name}</div>
                        <div style={{ fontSize: 13, color: `${PURPLE}80` }}>{selectedEmployee.role} \u00B7 {selectedEmployee.team} \u00B7 Tenure: {selectedEmployee.tenure}</div>
                        <div style={{ fontSize: 12, color: `${PURPLE}60` }}>Manager: {selectedEmployee.manager}</div>
                      </div>
                    </div>

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

                    <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 10 }}>Milestones</div>
                    {selectedEmployee.milestones.map((m, i) => {
                      const hasConvo = !!CONVERSATION_SCRIPTS[m.event];
                      return (
                      <div key={i} onClick={() => hasConvo && startConversation(selectedEmployee, m)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", marginBottom: 8,
                          background: hasConvo ? "#fff" : `${OFF_WHITE}80`, borderRadius: 12,
                          border: hasConvo ? `1.5px solid ${VIOLET}20` : `1px solid ${PURPLE}08`,
                          cursor: hasConvo ? "pointer" : "default",
                          transition: "all 0.2s ease",
                          boxShadow: hasConvo ? `0 1px 4px rgba(42,0,57,0.06)` : "none",
                        }}
                        onMouseEnter={(e) => { if (hasConvo) { e.currentTarget.style.borderColor = VIOLET; e.currentTarget.style.boxShadow = `0 3px 12px ${VIOLET}18`; e.currentTarget.style.transform = "translateY(-1px)"; }}}
                        onMouseLeave={(e) => { if (hasConvo) { e.currentTarget.style.borderColor = `${VIOLET}20`; e.currentTarget.style.boxShadow = `0 1px 4px rgba(42,0,57,0.06)`; e.currentTarget.style.transform = "none"; }}}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: m.status === "completed" ? `${GREEN}12` : m.status === "pending" ? `${YELLOW}15` : `${BLUE}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 14 }}>{m.status === "completed" ? "\u2713" : m.status === "pending" ? "\u25CB" : "\u2192"}</span>
                          </div>
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
                        </div>
                        {hasConvo && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              background: m.status === "pending" ? PURPLE : `${VIOLET}10`,
                              color: m.status === "pending" ? OFF_WHITE : VIOLET,
                              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                            }}>
                              {m.status === "pending" ? "Start Check-in" : "View Conversation"}
                            </span>
                            <span style={{ color: VIOLET, fontSize: 16, fontWeight: 600 }}>{"\u203A"}</span>
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════ TRY THE AI TAB ═══════ */}
        {activeTab === "tryit" && (
          <div>
            <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Try the AI</h2>
            <p style={{ color: `${PURPLE}90`, fontSize: 13, margin: "0 0 20px" }}>Experience a BelongIn check-in conversation first-hand. Share this with your colleagues!</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
              {activeConversation ? (
                <ChatWindow height={480} />
              ) : (
                <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${VIOLET}20, ${YELLOW}20)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>\uD83E\uDD16</div>
                  <p style={{ color: PURPLE, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Ready to experience a check-in?</p>
                  <p style={{ color: `${PURPLE}70`, fontSize: 13, marginBottom: 20 }}>Click below to start a demo conversation and see how the AI companion works.</p>
                  <button onClick={startDemoConversation}
                    style={{ background: PURPLE, color: OFF_WHITE, border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    Start Demo Check-in
                  </button>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>What You're Seeing</div>
                  <div style={{ fontSize: 12, color: `${PURPLE}90`, lineHeight: 1.6 }}>
                    This is a simulated version of what employees experience during a milestone check-in. In production, the AI adapts in real-time to each employee's responses, context, and emotional signals.
                  </div>
                </div>

                <div style={{ background: `${VIOLET}08`, borderRadius: 12, padding: 16, border: `1px solid ${VIOLET}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: VIOLET, marginBottom: 8 }}>How the AI Handles One-Word Responses</div>
                  <div style={{ fontSize: 12, color: `${PURPLE}90`, lineHeight: 1.6 }}>
                    When employees respond with just "Fine" or "Yeah", the AI doesn't take it at face value. It uses follow-up strategies: asking more specific questions, naming the pattern non-judgmentally, and offering concrete resources. See this in action in Rohan's "First Project Lead" check-in.
                  </div>
                  <button onClick={() => {
                    const rohan = EMPLOYEES.find(e => e.name === "Rohan Kapoor");
                    const milestone = rohan.milestones.find(m => m.event === "First Project Lead Assignment");
                    startConversation(rohan, milestone);
                    setActiveTab("employees");
                  }}
                    style={{ background: VIOLET, color: OFF_WHITE, border: "none", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 600, marginTop: 8 }}>
                    View Rohan's Check-in \u2192
                  </button>
                </div>

                <div style={{ background: `${CREAM}60`, borderRadius: 12, padding: 16, border: `1px solid ${YELLOW}30` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, marginBottom: 6 }}>Guardrails Active</div>
                  {["No clinical diagnoses", "No promises on behalf of org", "Always offer human escalation", "Respect opt-out requests", "Unlimited exchanges per session", "Employee controls what gets shared"].map((g, i) => (
                    <div key={i} style={{ fontSize: 11, color: `${PURPLE}90`, padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: GREEN, fontSize: 13 }}>\u2713</span> {g}
                    </div>
                  ))}
                </div>

                <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(42,0,57,0.06)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}80`, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Other Scenarios to Try</div>
                  {[
                    { name: "Priya Sharma", event: "3-Year Work Anniversary", label: "Celebratory" },
                    { name: "Ananya Desai", event: "Bereavement Leave Return", label: "Sensitive" },
                    { name: "Rohan Kapoor", event: "First Project Lead Assignment", label: "One-word responses" },
                  ].map((s, i) => {
                    const emp = EMPLOYEES.find(e => e.name === s.name);
                    const ms = emp?.milestones.find(m => m.event === s.event);
                    return emp && ms ? (
                      <button key={i} onClick={() => { startConversation(emp, ms); setActiveTab("employees"); }}
                        style={{ display: "block", width: "100%", textAlign: "left", background: `${OFF_WHITE}`, border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, color: PURPLE, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{s.name}</span> <span style={{ color: `${PURPLE}40` }}>{"\u00B7"}</span> <span style={{ color: `${PURPLE}70` }}>{s.label}</span>
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ IMPROVEMENTS TAB ═══════ */}
        {activeTab === "improvements" && (
          <div>
            <h2 style={{ color: PURPLE, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>How This Prototype Can Be Improved</h2>
            <p style={{ color: `${PURPLE}90`, fontSize: 13, margin: "0 0 24px" }}>Key areas to evolve from prototype to production-ready system</p>

            {[
              { title: "1. Real Claude API Integration", priority: "Critical", priorityColor: RED, current: "Conversations are pre-scripted and play back automatically.", improvement: "Connect to Claude API with system prompts including employee context, sensitivity tier, and persona instructions. Use tool-use for real-time lookups." },
              { title: "2. HRIS Event Webhook Integration", priority: "Critical", priorityColor: RED, current: "Employee data and milestones are hardcoded.", improvement: "Connect to HRIS (Darwinbox, BambooHR) via webhooks. Set up event listeners for role changes, anniversaries, leave events, and probation dates." },
              { title: "3. Real Multi-Channel Delivery", priority: "High", priorityColor: YELLOW, current: "Shows simulated Slack conversation in browser.", improvement: "Build a Slack bot for DMs, email integration via SendGrid, and embed a web chat widget. Let employees choose their preferred channel." },
              { title: "4. Conversation Memory & Context", priority: "High", priorityColor: YELLOW, current: "Each conversation is independent.", improvement: "Store conversation summaries in a vector database. Retrieve past check-in context for continuity across conversations." },
              { title: "5. Smarter Sensitivity Detection", priority: "High", priorityColor: YELLOW, current: "Sensitivity tiers are manually assigned.", improvement: "Score sentiment in real-time during conversations. Dynamically shift tone if a celebratory check-in reveals distress." },
              { title: "6. Consent & Privacy Controls", priority: "Critical", priorityColor: RED, current: "No consent management.", improvement: "Add per-conversation consent: employee approves what gets shared and with whom. DPDPA-compliant data deletion workflows." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 12, boxShadow: "0 1px 4px rgba(42,0,57,0.06)", borderLeft: `3px solid ${item.priorityColor}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: PURPLE, margin: 0 }}>{item.title}</h3>
                  <span style={{ background: `${item.priorityColor}20`, color: item.priorityColor === YELLOW ? PURPLE : item.priorityColor, padding: "2px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{item.priority}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}60`, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Current State</div>
                    <div style={{ fontSize: 13, color: `${PURPLE}90`, lineHeight: 1.5, background: `${RED}08`, padding: 10, borderRadius: 8 }}>{item.current}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: `${PURPLE}60`, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Production Improvement</div>
                    <div style={{ fontSize: 13, color: `${PURPLE}90`, lineHeight: 1.5, background: `${GREEN}08`, padding: 10, borderRadius: 8 }}>{item.improvement}</div>
                  </div>
                </div>
              </div>
            ))}
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
