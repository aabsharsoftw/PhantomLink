'use client'

import { ReactNode, useState } from 'react'
import { Topbar } from '@/components/CRMShell'
import { I } from '@/components/icons'

type Platform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok'
type PostStatus = 'Published' | 'Scheduled' | 'Draft' | 'Failed'

interface Post {
  id: number
  caption: string
  platforms: Platform[]
  status: PostStatus
  type: string
  date: string
  thumbnail: string
}

const MOCK_POSTS: Post[] = [
  { id: 1, caption: '🚀 Excited to share our latest product update! We\'ve been working hard behind the scenes to bring you an even better experience.', platforms: ['instagram', 'facebook'], status: 'Published', type: 'Post Composer', date: 'May 3, 2026', thumbnail: 'photo' },
  { id: 2, caption: 'Did you know? 73% of marketers say social media has been "somewhat effective" or "very effective" for their business. Here\'s how we help.', platforms: ['linkedin'], status: 'Published', type: 'Post Composer', date: 'May 2, 2026', thumbnail: 'chart' },
  { id: 3, caption: '✨ Behind the scenes of our team building day! Great vibes, great people.', platforms: ['instagram', 'tiktok'], status: 'Scheduled', type: 'Post Composer', date: 'May 6, 2026', thumbnail: 'video' },
  { id: 4, caption: 'Join us for our FREE webinar on scaling your agency with AI automation. Link in bio!', platforms: ['instagram', 'facebook', 'linkedin'], status: 'Scheduled', type: 'Post Composer', date: 'May 8, 2026', thumbnail: 'photo' },
  { id: 5, caption: 'Client spotlight: How Acme Marketing grew 3x in 6 months using our platform.', platforms: ['linkedin', 'facebook'], status: 'Draft', type: 'Post Composer', date: '—', thumbnail: 'article' },
  { id: 6, caption: 'Tips Tuesday: 5 ways to boost your email open rates 📧', platforms: ['instagram', 'tiktok'], status: 'Failed', type: 'Post Composer', date: 'Apr 29, 2026', thumbnail: 'photo' },
]

const AI_CAPTIONS = [
  "🚀 Elevate your brand with smart automation! Our AI-powered tools help businesses like yours grow faster, smarter, and more efficiently. Ready to transform your marketing? Drop a comment below! 👇 #MarketingAutomation #AIMarketing #GrowYourBusiness",
  "✨ The future of marketing is here — and it's powered by AI. Streamline your campaigns, nurture leads automatically, and watch your revenue soar. What's your biggest marketing challenge? Let's talk! 💬 #DigitalMarketing #MarTech #BusinessGrowth",
  "💡 Did you know businesses using marketing automation see a 451% increase in qualified leads? Join thousands of agencies already using our platform to crush their goals. Link in bio! 🔗 #Automation #LeadGeneration #AgencyLife",
  "🌟 Success story alert! Our clients are closing deals faster than ever with AI-driven CRM. Ready to be next? Schedule a free demo today and see the difference for yourself! #CRM #SalesSuccess #AITools",
]

const PLATFORM_ICONS: Record<Platform, ReactNode> = {
  instagram: <I.ig size={14} style={{ color: '#E1306C' }} />,
  facebook: <I.fb size={14} style={{ color: '#1877F2' }} />,
  linkedin: <span style={{ background: '#0A66C2', color: '#fff', borderRadius: 3, fontSize: 9, fontWeight: 700, padding: '1px 4px', lineHeight: 1.4 }}>in</span>,
  tiktok: <span style={{ background: '#000', color: '#fff', borderRadius: 3, fontSize: 9, fontWeight: 700, padding: '1px 4px', lineHeight: 1.4 }}>Tk</span>,
}

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
}

const STATUS_COLORS: Record<PostStatus, string> = {
  Published: 'green',
  Scheduled: 'blue',
  Draft: 'gray',
  Failed: 'red',
}

const THUMB_BG: Record<string, string> = {
  photo: 'linear-gradient(135deg,#6366F1,#A78BFA)',
  video: 'linear-gradient(135deg,#EC4899,#F59E0B)',
  chart: 'linear-gradient(135deg,#14B8A6,#3B82F6)',
  article: 'linear-gradient(135deg,#6C7187,#A8ADBD)',
}

const TABS = ['Planner', 'Content', 'Comments', 'Statistics', 'Social Listening', 'Settings']
const PLATFORM_TABS: { id: Platform; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
]

type ModalState = {
  open: boolean
  caption: string
  platforms: Platform[]
  scheduleDate: string
  scheduleTime: string
  generating: boolean
  aiIndex: number
}

const MODAL_DEFAULT: ModalState = {
  open: false, caption: '', platforms: ['instagram'],
  scheduleDate: '', scheduleTime: '10:00',
  generating: false, aiIndex: 0,
}

export default function SocialPage() {
  const [tab, setTab] = useState('Planner')
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all')
  const [modal, setModal] = useState<ModalState>(MODAL_DEFAULT)
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)

  const filtered = platformFilter === 'all'
    ? posts
    : posts.filter(p => p.platforms.includes(platformFilter))

  function openModal() {
    setModal({ ...MODAL_DEFAULT, open: true })
  }

  function closeModal() {
    setModal(m => ({ ...m, open: false }))
  }

  function generateCaption() {
    setModal(m => ({ ...m, generating: true }))
    setTimeout(() => {
      setModal(m => ({
        ...m,
        generating: false,
        caption: AI_CAPTIONS[m.aiIndex % AI_CAPTIONS.length],
        aiIndex: m.aiIndex + 1,
      }))
    }, 1200)
  }

  function togglePlatform(p: Platform) {
    setModal(m => ({
      ...m,
      platforms: m.platforms.includes(p)
        ? m.platforms.filter(x => x !== p)
        : [...m.platforms, p],
    }))
  }

  function publish() {
    if (!modal.caption.trim()) return
    const newPost: Post = {
      id: Date.now(),
      caption: modal.caption,
      platforms: modal.platforms,
      status: modal.scheduleDate ? 'Scheduled' : 'Published',
      type: 'Post Composer',
      date: modal.scheduleDate
        ? new Date(modal.scheduleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      thumbnail: 'photo',
    }
    setPosts(p => [newPost, ...p])
    closeModal()
  }

  const platformCounts = (['instagram', 'facebook', 'linkedin', 'tiktok'] as Platform[]).reduce(
    (acc, p) => ({ ...acc, [p]: posts.filter(x => x.platforms.includes(p)).length }),
    {} as Record<Platform, number>
  )

  return (
    <>
      <Topbar
        title="Social Planner"
        subtitle={`${posts.filter(p => p.status === 'Published').length} published · ${posts.filter(p => p.status === 'Scheduled').length} scheduled`}
        breadcrumb={['Marketing', 'Social Planner']}
        actions={
          <>
            <button className="btn ghost" style={{ fontSize: 12 }}>
              <I.cal size={13} /> Calendar View
            </button>
            <button className="btn primary" style={{ fontSize: 12 }} onClick={openModal}>
              <I.plus size={13} /> New Post
            </button>
          </>
        }
      />

      {/* Platform summary cards */}
      <div className="row gap-3" style={{ padding: '0 24px 0', marginBottom: 20 }}>
        {PLATFORM_TABS.map(pt => (
          <button
            key={pt.id}
            onClick={() => setPlatformFilter(f => f === pt.id ? 'all' : pt.id)}
            style={{
              flex: 1, background: platformFilter === pt.id ? 'var(--accent-soft)' : 'var(--surface)',
              border: `1px solid ${platformFilter === pt.id ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 10, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
              transition: 'all .15s',
            }}
          >
            <div className="row gap-2" style={{ marginBottom: 6 }}>
              {PLATFORM_ICONS[pt.id]}
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{pt.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{platformCounts[pt.id]}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>posts</div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-row" style={{ padding: '0 24px', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
        {TABS.map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab !== 'Planner' && tab !== 'Content' ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
          {tab} coming soon
        </div>
      ) : (
        <div style={{ padding: '20px 24px' }}>
          {/* Toolbar */}
          <div className="row gap-2" style={{ marginBottom: 16 }}>
            <div className="search-box" style={{ flex: 1, maxWidth: 320 }}>
              <I.search size={13} className="muted-2" />
              <input placeholder="Search posts…" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', flex: 1 }} />
            </div>
            <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 'auto' }}>
              <option>All statuses</option>
              <option>Published</option>
              <option>Scheduled</option>
              <option>Draft</option>
            </select>
            <select className="input" style={{ fontSize: 12, padding: '6px 10px', width: 'auto' }}>
              <option>All time</option>
              <option>This week</option>
              <option>This month</option>
            </select>
          </div>

          {/* Posts table */}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 52 }}>Media</th>
                  <th>Caption</th>
                  <th style={{ width: 130 }}>Platforms</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 110 }}>Type</th>
                  <th style={{ width: 120 }}>Date</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div style={{
                        width: 40, height: 40, borderRadius: 7, flexShrink: 0,
                        background: THUMB_BG[post.thumbnail] ?? 'var(--surface-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {post.thumbnail === 'video'
                          ? <I.play size={14} style={{ color: '#fff' }} />
                          : post.thumbnail === 'chart'
                            ? <I.chart size={14} style={{ color: '#fff' }} />
                            : <I.spark size={14} style={{ color: '#fff' }} />
                        }
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--text)', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.caption}
                      </div>
                    </td>
                    <td>
                      <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                        {post.platforms.map(p => (
                          <span key={p} title={PLATFORM_LABELS[p]}>{PLATFORM_ICONS[p]}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`pill ${STATUS_COLORS[post.status]}`} style={{ fontSize: 10 }}>
                        {post.status === 'Published' && <span className="dot" style={{ background: 'var(--green)' }} />}
                        {post.status}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-3)' }}>{post.type}</span></td>
                    <td><span style={{ fontSize: 11, color: 'var(--text-3)' }}>{post.date}</span></td>
                    <td>
                      <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                        <button className="icon-btn" title="Edit" style={{ width: 28, height: 28 }}><I.pencil size={12} /></button>
                        <button className="icon-btn" title="More" style={{ width: 28, height: 28 }}><I.more size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontSize: 13 }}>
                      No posts found for this platform
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="row gap-3" style={{ marginTop: 16, justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)' }}>
            <span>Showing {filtered.length} of {posts.length} posts</span>
            <div className="row gap-1">
              <button className="btn ghost" style={{ fontSize: 11, padding: '4px 10px' }}>Previous</button>
              <button className="btn ghost active" style={{ fontSize: 11, padding: '4px 10px' }}>1</button>
              <button className="btn ghost" style={{ fontSize: 11, padding: '4px 10px' }}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" style={{ width: 560, maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
            <div className="row gap-3" style={{ marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Create New Post</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Compose and schedule across platforms</div>
              </div>
              <div className="flex-1" />
              <button className="icon-btn" onClick={closeModal}><I.x size={14} /></button>
            </div>

            {/* Platform selector */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Platforms</div>
              <div className="row gap-2">
                {PLATFORM_TABS.map(pt => (
                  <button
                    key={pt.id}
                    onClick={() => togglePlatform(pt.id)}
                    style={{
                      flex: 1, padding: '8px 6px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s',
                      background: modal.platforms.includes(pt.id) ? 'var(--accent-soft)' : 'var(--surface-2)',
                      border: `1px solid ${modal.platforms.includes(pt.id) ? 'var(--accent)' : 'var(--border)'}`,
                      color: modal.platforms.includes(pt.id) ? 'var(--accent)' : 'var(--text-3)',
                    }}
                  >
                    <div className="col" style={{ alignItems: 'center', gap: 4 }}>
                      {PLATFORM_ICONS[pt.id]}
                      <span>{pt.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div style={{ marginBottom: 16 }}>
              <div className="row gap-2" style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em', flex: 1 }}>Caption</div>
                <button
                  className="btn ghost"
                  style={{ fontSize: 11, padding: '4px 10px', background: modal.generating ? 'var(--accent-soft)' : undefined }}
                  onClick={generateCaption}
                  disabled={modal.generating}
                >
                  <I.spark size={12} style={{ color: 'var(--accent)' }} />
                  {modal.generating ? 'Generating…' : 'Generate with AI'}
                </button>
              </div>
              <textarea
                value={modal.caption}
                onChange={e => setModal(m => ({ ...m, caption: e.target.value }))}
                placeholder="Write your post caption here, or use AI to generate one…"
                style={{
                  width: '100%', minHeight: 120, background: 'var(--surface-2)',
                  border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px',
                  color: 'var(--text)', fontSize: 13, lineHeight: 1.6, resize: 'vertical',
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4, textAlign: 'right' }}>
                {modal.caption.length} characters
              </div>
            </div>

            {/* Media upload */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Media</div>
              <div style={{
                border: '2px dashed var(--border)', borderRadius: 10, padding: '24px 16px',
                textAlign: 'center', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer',
                background: 'var(--surface-2)',
              }}>
                <I.upload size={20} style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 500 }}>Click to upload or drag & drop</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>PNG, JPG, GIF, MP4 up to 50MB</div>
              </div>
            </div>

            {/* Schedule */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Schedule (optional)</div>
              <div className="row gap-2">
                <input
                  type="date"
                  value={modal.scheduleDate}
                  onChange={e => setModal(m => ({ ...m, scheduleDate: e.target.value }))}
                  className="input"
                  style={{ flex: 1, fontSize: 12 }}
                />
                <input
                  type="time"
                  value={modal.scheduleTime}
                  onChange={e => setModal(m => ({ ...m, scheduleTime: e.target.value }))}
                  className="input"
                  style={{ width: 110, fontSize: 12 }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="row gap-2" style={{ justifyContent: 'flex-end' }}>
              <button className="btn ghost" onClick={closeModal}>Cancel</button>
              <button
                className="btn ghost"
                onClick={() => {
                  setPosts(p => [{ id: Date.now(), caption: modal.caption || 'Draft post', platforms: modal.platforms, status: 'Draft', type: 'Post Composer', date: '—', thumbnail: 'photo' }, ...p])
                  closeModal()
                }}
              >
                Save Draft
              </button>
              <button className="btn primary" onClick={publish} disabled={!modal.caption.trim()}>
                {modal.scheduleDate ? <><I.cal size={13} /> Schedule Post</> : <><I.send size={13} /> Publish Now</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
