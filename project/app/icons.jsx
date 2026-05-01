// Lucide-style stroke icons. 1.75 stroke, 18px default.
const Icon = ({ d, size = 18, stroke = 1.75, fill = 'none', children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children || (Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />)}
  </svg>
);

const I = {
  dash:    (p) => <Icon {...p} d={['M3 12 12 3l9 9','M5 10v10h14V10']} />,
  contact: (p) => <Icon {...p}>
    <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
  </Icon>,
  pipeline:(p) => <Icon {...p} d={['M4 5h5v14H4z','M10.5 9h5v10h-5z','M17 7h3v12h-3z']} />,
  campaign:(p) => <Icon {...p} d={['M3 11l18-7v16L3 13z','M11 19v3','M3 11v2']} />,
  bot:     (p) => <Icon {...p}>
    <rect x="4" y="7" width="16" height="12" rx="2"/><path d="M12 3v4M9 13h.01M15 13h.01M9 17h6"/>
  </Icon>,
  inbox:   (p) => <Icon {...p} d={['M3 12h5l2 3h4l2-3h5','M3 12V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6','M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6']} />,
  shield:  (p) => <Icon {...p} d={['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z']} />,
  search:  (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>,
  bell:    (p) => <Icon {...p} d={['M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9','M10 20a2 2 0 0 0 4 0']} />,
  plus:    (p) => <Icon {...p} d={['M12 5v14','M5 12h14']} />,
  more:    (p) => <Icon {...p}><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></Icon>,
  filter:  (p) => <Icon {...p} d="M3 5h18l-7 9v6l-4-2v-4z" />,
  arrowUp: (p) => <Icon {...p} d={['M12 19V5','M5 12l7-7 7 7']} />,
  arrowDn: (p) => <Icon {...p} d={['M12 5v14','M19 12l-7 7-7-7']} />,
  check:   (p) => <Icon {...p} d="M4 12l5 5 11-11" />,
  x:       (p) => <Icon {...p} d={['M6 6l12 12','M18 6L6 18']} />,
  send:    (p) => <Icon {...p} d={['M22 2L11 13','M22 2l-7 20-4-9-9-4z']} />,
  paper:   (p) => <Icon {...p} d="M21 11.5a9 9 0 0 1-.9 4l1 5-5-1a9 9 0 1 1 4.9-8z" />,
  phone:   (p) => <Icon {...p} d="M22 16.9V20a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2L8 9.5a16 16 0 0 0 6.5 6.5l1.3-1.3a2 2 0 0 1 2-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9z" />,
  mail:    (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></Icon>,
  wa:      (p) => <Icon {...p}>
    <path d="M3 21l1.6-5A8 8 0 1 1 8 19l-5 2"/>
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 1c-1 0-2-1-2-2l1-1-1-2L10 8c-.5 0-1 .5-1 1.5z"/>
  </Icon>,
  star:    (p) => <Icon {...p} d="M12 3l2.6 6 6.4.6-4.8 4.4 1.4 6.5L12 17.7 6.4 20.5 7.8 14 3 9.6 9.4 9z" />,
  tag:     (p) => <Icon {...p} d={['M3 12V3h9l9 9-9 9z','M7 7h.01']} />,
  building:(p) => <Icon {...p} d={['M3 21h18','M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16','M15 21V11h4v10','M8 7h2M8 11h2M8 15h2']} />,
  chevR:   (p) => <Icon {...p} d="M9 6l6 6-6 6" />,
  chevD:   (p) => <Icon {...p} d="M6 9l6 6 6-6" />,
  trend:   (p) => <Icon {...p} d={['M3 17l6-6 4 4 8-8','M14 7h7v7']} />,
  zap:     (p) => <Icon {...p} d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor" stroke="none" />,
  clock:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  cog:     (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>,
  spark:   (p) => <Icon {...p} d={['M5 3v4','M3 5h4','M19 17v4','M17 19h4','M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z']} />,
  download:(p) => <Icon {...p} d={['M12 3v12','M7 11l5 5 5-5','M5 21h14']} />,
  upload:  (p) => <Icon {...p} d={['M12 21V9','M7 13l5-5 5 5','M5 3h14']} />,
  copy:    (p) => <Icon {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>,
  list:    (p) => <Icon {...p} d={['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01']} />,
  grid:    (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Icon>,
  refresh: (p) => <Icon {...p} d={['M4 4v6h6','M20 20v-6h-6','M4 10a8 8 0 0 1 14-3l2 3','M20 14a8 8 0 0 1-14 3l-2-3']} />,
  attach:  (p) => <Icon {...p} d="M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8" />,
  smile:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9 14a4 4 0 0 0 6 0M9 9h.01M15 9h.01"/></Icon>,
  link:    (p) => <Icon {...p} d={['M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1','M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1']} />,
  archive: (p) => <Icon {...p}><rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4"/></Icon>,
  user:    (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></Icon>,
  globe:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></Icon>,
  pin:     (p) => <Icon {...p} d={['M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12','M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']} />,
  flow:    (p) => <Icon {...p}>
    <rect x="3" y="3" width="6" height="4" rx="1"/><rect x="15" y="9" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/>
    <path d="M9 5h2a2 2 0 0 1 2 2v4M9 19h2a2 2 0 0 0 2-2v-4M13 11h2"/>
  </Icon>,
  branch:  (p) => <Icon {...p}><circle cx="6" cy="3" r="2"/><circle cx="6" cy="21" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 5v14M6 12h6a4 4 0 0 0 4-4"/></Icon>,
  split:   (p) => <Icon {...p} d={['M6 3v4a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v4','M3 6l3-3 3 3','M15 18l3 3 3-3']} />,
  flag:    (p) => <Icon {...p} d={['M4 22V4','M4 4h13l-2 4 2 4H4']} />,
  undo:    (p) => <Icon {...p} d={['M9 14l-4-4 4-4','M5 10h9a5 5 0 0 1 0 10h-3']} />,
  redo:    (p) => <Icon {...p} d={['M15 14l4-4-4-4','M19 10h-9a5 5 0 0 0 0 10h3']} />,
  history: (p) => <Icon {...p} d={['M3 12a9 9 0 1 0 3-6.7L3 8','M3 3v5h5','M12 7v5l3 2']} />,
  drag:    (p) => <Icon {...p}><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></Icon>,
  zoomIn:  (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-3.5-3.5"/></Icon>,
  zoomOut: (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-3.5-3.5"/></Icon>,
  // GHL additions
  cal:      (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></Icon>,
  funnel:   (p) => <Icon {...p} d="M3 4h18l-7 9v6l-4 2v-8z" />,
  globe2:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></Icon>,
  reviews:  (p) => <Icon {...p} d={['M12 2l2.6 6 6.4.6-4.8 4.4 1.4 6.5L12 16.5 6.4 19.5 7.8 13 3 8.6 9.4 8z']} />,
  chart:    (p) => <Icon {...p} d={['M3 21V3','M3 21h18','M7 17v-6','M12 17v-10','M17 17v-3']} />,
  payments: (p) => <Icon {...p}><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 11h20M6 16h4"/></Icon>,
  members:  (p) => <Icon {...p}><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M21 20c0-2.4-1.6-4-4-4"/></Icon>,
  store:    (p) => <Icon {...p} d={['M3 9l1-5h16l1 5','M4 9v11h16V9','M9 13h6']} />,
  voice:    (p) => <Icon {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></Icon>,
  fb:       (p) => <Icon {...p} d="M14 22V12h3l1-4h-4V6c0-1 .3-2 2-2h2V0h-3c-3 0-5 2-5 5v3H7v4h3v10z" fill="currentColor" stroke="none"/>,
  ig:       (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/></Icon>,
  gbp:      (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  webchat:  (p) => <Icon {...p} d={['M21 12a8 8 0 0 1-12.5 6.6L3 20l1.4-5.5A8 8 0 1 1 21 12','M8 12h.01M12 12h.01M16 12h.01']} />,
  rocket:   (p) => <Icon {...p} d={['M5 19c2-1 3-3 3-5 1-4 4-7 8-9 0 4-3 7-7 8-2 0-4 1-5 3l1 3z','M14 5l5 5','M9 15l-2 5 5-2']} />,
  layers:   (p) => <Icon {...p} d={['M12 2 2 7l10 5 10-5z','M2 12l10 5 10-5','M2 17l10 5 10-5']} />,
  ai:       (p) => <Icon {...p}><rect x="4" y="6" width="16" height="13" rx="2"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M12 3v3M9 19l-1 2M15 19l1 2"/></Icon>,
  brain:    (p) => <Icon {...p} d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-3 4 3 3 0 0 0 1 5 3 3 0 0 0 2 4 3 3 0 0 0 6 0V3a3 3 0 0 0-3 0M15 3a3 3 0 0 1 3 3 3 3 0 0 1 3 4 3 3 0 0 1-1 5 3 3 0 0 1-2 4 3 3 0 0 1-6 0"/>,
  flask:    (p) => <Icon {...p} d={['M9 3v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-10V3','M8 3h8','M6 14h12']} />,
  thumbsUp: (p) => <Icon {...p} d={['M7 11v9H4v-9z','M7 11l4-8a2 2 0 0 1 4 0v5h6l-1.5 9a2 2 0 0 1-2 1.5H7']} />,
  thumbsDn: (p) => <Icon {...p} d={['M7 13V4H4v9z','M7 13l4 8a2 2 0 0 0 4 0v-5h6l-1.5-9a2 2 0 0 0-2-1.5H7']} />,
  reply:    (p) => <Icon {...p} d="M9 17l-6-5 6-5M3 12h12a5 5 0 0 1 5 5v3" />,
  webhook:  (p) => <Icon {...p}><circle cx="6" cy="18" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 18h8M11.3 7.5 7 16M12.7 7.5 17 16"/></Icon>,
  code:     (p) => <Icon {...p} d={['M8 8l-5 4 5 4','M16 8l5 4-5 4','M14 4l-4 16']} />,
  ext:      (p) => <Icon {...p} d={['M14 4h6v6','M10 14L20 4','M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5']} />,
  play:     (p) => <Icon {...p} d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/>,
  pause:    (p) => <Icon {...p} d={['M6 4h4v16H6z','M14 4h4v16h-4z']} fill="currentColor" stroke="none"/>,
  swap:     (p) => <Icon {...p} d={['M4 7h14l-3-3','M20 17H6l3 3']} />,
  swatch:   (p) => <Icon {...p}><rect x="3" y="3" width="7" height="18" rx="1"/><path d="M10 12l5-5 5 5-9 9a3 3 0 0 1-4-4l8-8M6 17h.01"/></Icon>,
  pencil:   (p) => <Icon {...p} d={['M4 20l4-1 11-11-3-3L5 16z','M14 6l3 3']} />,
  share:    (p) => <Icon {...p}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4M8 13l8 4"/></Icon>,
  eye:      (p) => <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Icon>,
  trash:    (p) => <Icon {...p} d={['M3 6h18','M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2','M6 6l1 14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-14']} />,
  doc:      (p) => <Icon {...p} d={['M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z','M14 3v5h5','M9 13h6M9 17h6']} />,
  invoice:  (p) => <Icon {...p} d={['M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z','M9 8h6M9 12h6M9 16h4']} />,
  badge:    (p) => <Icon {...p} d={['M12 2l3 3 4-1 1 4 3 3-3 3-1 4-4-1-3 3-3-3-4 1-1-4-3-3 3-3 1-4 4 1z','M9 12l2 2 4-4']} />,
  swatchSm: (p) => <Icon {...p}><rect x="4" y="4" width="16" height="16" rx="2"/></Icon>,
};

window.I = I;
