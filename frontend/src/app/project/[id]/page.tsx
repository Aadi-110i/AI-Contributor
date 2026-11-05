'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, type Project, type Module, type MergeLog } from '@/lib/api';
import FileUploader from '@/components/FileUploader';
import InviteModal from '@/components/InviteModal';
import LogViewer from '@/components/LogViewer';
import DashboardNavbar from '@/components/DashboardNavbar';
import {
  ArrowLeft, Users, GitMerge, Package, UserCheck,
  CheckCircle, Palette, Cog, ShieldCheck, Database,
  Link as LinkIcon, Upload, Terminal, ChevronDown, ChevronUp, Lock, Trash2,
  FileArchive, RefreshCw, Undo2
} from 'lucide-react';
import { useNotifications } from '@/lib/notifications-context';

/* ─── Module metadata ─── */
const MODULE_META: Record<string, { icon: React.ReactNode; accent: string; bg: string }> = {
  frontend:       { icon: <Palette size={16} />,     accent: '#E05A5A', bg: 'rgba(224,90,90,0.07)' },
  backend:        { icon: <Cog size={16} />,          accent: '#4F8EF7', bg: 'rgba(79,142,247,0.07)' },
  authentication: { icon: <ShieldCheck size={16} />,  accent: '#D4A843', bg: 'rgba(212,168,67,0.07)' },
  database:       { icon: <Database size={16} />,     accent: '#9B6CF7', bg: 'rgba(155,108,247,0.07)' },
  integrations:   { icon: <LinkIcon size={16} />,     accent: '#3DB87A', bg: 'rgba(61,184,122,0.07)' },
};

const STATUS_CFG: Record<string, { label: string; color: string; dot: string }> = {
  unassigned:  { label: 'Unassigned',  color: '#888',    dot: '#888' },
  in_progress: { label: 'In Progress', color: '#D4A843', dot: '#D4A843' },
  uploaded:    { label: 'Uploaded',    color: '#4F8EF7', dot: '#4F8EF7' },
  standardized:{ label: 'Ready',       color: '#3DB87A', dot: '#3DB87A' },
  merged:      { label: 'Merged',      color: '#C9A45F', dot: '#C9A45F' },
  error:       { label: 'Error',       color: '#E05A5A', dot: '#E05A5A' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [logs, setLogs] = useState<MergeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteUploadTarget, setDeleteUploadTarget] = useState<{ id: string; type: string } | null>(null);
  const [deletingUpload, setDeletingUpload] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setUserId(u.id || '');
    fetchData();
  }, [projectId]);

  const fetchData = useCallback(async () => {
    setErrorMsg(null);
    try {
      const data = await api.projects.get(projectId);
      setProject(data);
      setModules(data.modules || []);
      try {
        const l = await api.merge.logs(projectId);
        setLogs(l || []);
      } catch {
        setLogs([]);
      }
    } catch (err: any) {
      console.error('Failed to load project:', err);
      setErrorMsg(err.message || 'Failed to load project');
      setProject(null);
      setModules([]);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const handleAssign = async (mid: string) => {
    try {
      await api.modules.assign(mid);
      addNotification('You assigned yourself to this module');
      fetchData();
    } catch (err: any) {
      addNotification(`Failed to assign: ${err.message || 'Error'}`);
    }
  };

  const handleUpload = async (mid: string, file: File) => {
    try {
      await api.modules.upload(mid, file);
      addNotification(`Successfully uploaded ${file.name}`);
      fetchData();
    } catch (err: any) {
      addNotification(`Upload failed: ${err.message || 'Error'}`);
    }
    setUploadId(null);
  };

  const handleDeleteUploadConfirm = async () => {
    if (!deleteUploadTarget) return;
    setDeletingUpload(true);
    try {
      await api.modules.deleteUpload(deleteUploadTarget.id);
      addNotification(`Deleted uploaded code for ${deleteUploadTarget.type}`);
      setDeleteUploadTarget(null);
      fetchData();
    } catch (err: any) {
      addNotification(`Failed to delete code: ${err.message || 'Error'}`);
    } finally {
      setDeletingUpload(false);
    }
  };

  const handleUnassign = async (mid: string, typeName: string) => {
    try {
      await api.modules.unassign(mid);
      addNotification(`Unassigned from ${typeName} module`);
      fetchData();
    } catch (err: any) {
      addNotification(`Failed to unassign: ${err.message || 'Error'}`);
    }
  };

  // Only allow merge when all modules are uploaded
  const uploadedModules = modules.filter((m) => ['uploaded', 'standardized', 'merged'].includes(m.status));
  const uploadedCount = uploadedModules.length;
  const totalModules = modules.length;
  const allUploaded = totalModules > 0 && uploadedCount === totalModules;
  const merged = modules.filter((m) => m.status === 'merged');

  const handleMerge = async () => {
    if (!allUploaded) {
      addNotification(`All ${totalModules} modules must be uploaded before merging (${uploadedCount}/${totalModules} uploaded)`);
      return;
    }

    setMerging(true);
    try {
      const r = await api.merge.trigger(projectId);
      if (r.log) {
        setLogs((p) => [r.log, ...p]);
      }
      fetchData();
      addNotification(`Merge complete for ${project?.name}: All modules merged successfully`);
    } catch (err: any) {
      addNotification(`Merge failed: ${err.message || 'Error'}`);
    } finally {
      setMerging(false);
    }
  };

  const handleGenInvite = async () => {
    try {
      const r = await api.invites.create(projectId);
      setInviteLink(r.link);
    } catch {
      setInviteLink(`${window.location.origin}/invite/inv_${Date.now()}`);
    }
  };

  const handleDeleteProject = async () => {
    setDeleting(true);
    try {
      await api.projects.delete(projectId);
      router.push('/dashboard/projects');
    } catch (err: any) {
      addNotification(`Failed to delete: ${err.message || 'Error'}`);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F3', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <DashboardNavbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '2px solid rgba(201,164,95,0.2)', borderTopColor: '#C9A45F', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#888', fontSize: '0.8125rem' }}>Loading project…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );

  if (!project) return (
    <div style={{ minHeight: '100vh', background: '#F7F6F3', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <DashboardNavbar />
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <p style={{ color: '#111', fontWeight: 700, fontSize: '1.125rem' }}>
          {errorMsg || 'Project not found'}
        </p>
        <p style={{ color: '#888', fontSize: '0.8125rem', marginTop: '6px' }}>
          Please check the project ID or return to your dashboard.
        </p>
        <button
          onClick={() => router.push('/dashboard/projects')}
          style={{ marginTop: '18px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600 }}
        >
          Back to Projects
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F3', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <DashboardNavbar />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .proj-module-card { transition: box-shadow 0.18s ease, transform 0.18s ease; }
        .proj-module-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.09); transform: translateY(-2px); }
        .proj-btn-ghost:hover { background: rgba(0,0,0,0.05) !important; }
        .proj-btn-merge:hover:not(:disabled) { background: #333 !important; }
        .proj-log-row:hover { background: rgba(0,0,0,0.025) !important; }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 32px 80px', boxSizing: 'border-box' as const, animation: 'fadeUp 0.4s ease both' }}>

        {/* ── Back ── */}
        <button
          onClick={() => router.push('/dashboard/projects')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.8rem', padding: '0 0 20px 0', fontFamily: 'inherit', letterSpacing: '0.01em' }}
        >
          <ArrowLeft size={13} /> Back to Projects
        </button>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3DB87A', boxShadow: '0 0 8px rgba(61,184,122,0.5)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Active Project</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem,2.5vw,1.875rem)', fontWeight: 800, color: '#111', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
              {project.name}
            </h1>
            {project.description && (
              <p style={{ color: '#777', fontSize: '0.8125rem', marginTop: '6px', marginBottom: 0 }}>{project.description}</p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button
              onClick={() => setShowInvite(true)}
              className="proj-btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#444', border: '1px solid #E2DED8', borderRadius: '10px', padding: '9px 16px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
            >
              <Users size={13} /> Invite
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="proj-btn-ghost"
              title="Delete project"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '10px', padding: '9px 14px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            >
              <Trash2 size={13} />
            </button>

            <button
              onClick={handleMerge}
              disabled={merging || !allUploaded}
              className="proj-btn-merge"
              title={
                allUploaded
                  ? 'All modules uploaded — click to merge project'
                  : `Upload all ${totalModules} modules to enable merge (${uploadedCount}/${totalModules} uploaded)`
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                background: allUploaded ? '#111' : '#EAE7E1',
                color: allUploaded ? '#fff' : '#888',
                border: allUploaded ? 'none' : '1px solid #DCD8D0',
                borderRadius: '10px',
                padding: '9px 18px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: allUploaded ? 'pointer' : 'not-allowed',
                opacity: allUploaded ? 1 : 0.65,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              {merging ? (
                <>
                  <span style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  Merging…
                </>
              ) : (
                <>
                  {allUploaded ? <GitMerge size={13} /> : <Lock size={12} style={{ color: '#999' }} />}
                  <span>Merge All</span>
                  {!allUploaded && (
                    <span style={{
                      fontSize: '0.7rem',
                      background: 'rgba(0,0,0,0.06)',
                      padding: '1px 6px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      marginLeft: '2px',
                      color: '#666',
                    }}>
                      {uploadedCount}/{totalModules}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: '14px', padding: '20px 28px', marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {[
            { icon: <Package size={14} />,    value: modules.length,                                        label: 'Modules' },
            { icon: <UserCheck size={14} />,   value: modules.filter(m => m.assigned_to).length,            label: 'Assigned' },
            { icon: <CheckCircle size={14} />, value: uploadedCount,                                        label: 'Uploaded' },
            { icon: <GitMerge size={14} />,    value: merged.length,                                         label: 'Merged' },
          ].map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: i > 0 ? '24px' : 0, borderLeft: i > 0 ? '1px solid #F0EDE8' : 'none' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A45F', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.6875rem', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Modules ── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Modules</h2>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{uploadedCount}/{totalModules} uploaded</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {modules.map((mod) => {
              const meta = MODULE_META[mod.type] || MODULE_META.integrations;
              const st = STATUS_CFG[mod.status] || STATUS_CFG.unassigned;
              const isMe = userId && mod.assigned_to === userId;

              if (uploadId === mod.id) return (
                <div key={mod.id} style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.accent }}>
                      {meta.icon}
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111', textTransform: 'capitalize' }}>Upload · {mod.type}</span>
                  </div>
                  <FileUploader onUpload={(f) => handleUpload(mod.id, f)} />
                  <button onClick={() => setUploadId(null)} style={{ width: '100%', marginTop: '10px', background: 'transparent', color: '#666', border: '1px solid #E8E4DD', borderRadius: '8px', padding: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                </div>
              );

              return (
                <div
                  key={mod.id}
                  className="proj-module-card"
                  style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: meta.bg, border: `1px solid ${meta.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.accent, flexShrink: 0 }}>
                        {meta.icon}
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111', textTransform: 'capitalize' }}>{mod.type}</span>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.6875rem', fontWeight: 600, color: st.color, background: `${st.dot}12`, border: `1px solid ${st.dot}22`, borderRadius: '20px', padding: '3px 9px', whiteSpace: 'nowrap' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: st.dot, display: 'inline-block', flexShrink: 0 }} />
                      {st.label}
                    </span>
                  </div>

                  {/* Assignee */}
                  <div style={{ background: '#F9F8F6', border: '1px solid #EDEAE4', borderRadius: '8px', padding: '10px 12px' }}>
                    {mod.profiles ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `${meta.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: meta.accent, flexShrink: 0, textTransform: 'uppercase' }}>
                          {mod.profiles.username?.charAt(0) || '?'}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#333', fontWeight: 500 }}>{mod.profiles.username}</span>
                        {isMe && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#888', fontWeight: 600 }}>You</span>}
                      </div>
                    ) : (
                      <p style={{ textAlign: 'center', fontSize: '0.775rem', color: '#bbb', margin: 0 }}>No one assigned yet</p>
                    )}
                  </div>

                  {/* Uploaded File Package */}
                  {['uploaded', 'standardized', 'merged'].includes(mod.status) && (
                    <div style={{
                      background: '#F6F9F6',
                      border: '1px solid #D8EAD8',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <FileArchive size={16} style={{ color: '#2E7D32', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: '#1B5E20',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }} title={mod.code_path ? mod.code_path.split('/').pop() : `${mod.type}.zip`}>
                            {mod.code_path ? mod.code_path.split('/').pop() : `${mod.type}.zip`}
                          </p>
                          <span style={{ fontSize: '0.675rem', color: '#558B2F', fontWeight: 500 }}>
                            {mod.status === 'merged' ? '✓ Merged into build' : '✓ Package uploaded'}
                          </span>
                        </div>
                      </div>

                      {/* Delete upload button if not merged yet and user is assignee or project owner */}
                      {mod.status !== 'merged' && (isMe || project?.owner_id === userId) && (
                        <button
                          onClick={() => setDeleteUploadTarget({ id: mod.id, type: mod.type })}
                          title="Delete uploaded code package"
                          style={{
                            background: 'rgba(224,90,90,0.08)',
                            border: '1px solid rgba(224,90,90,0.2)',
                            color: '#D32F2F',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {mod.status === 'unassigned' && (
                    <button
                      onClick={() => handleAssign(mod.id)}
                      style={{ width: '100%', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em', transition: 'background 0.15s' }}
                    >
                      Claim Module
                    </button>
                  )}
                  {isMe && ['in_progress', 'error'].includes(mod.status) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        onClick={() => setUploadId(mod.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <Upload size={12} /> Upload Code (.zip)
                      </button>
                      <button
                        onClick={() => handleUnassign(mod.id, mod.type)}
                        style={{ width: '100%', background: 'transparent', color: '#888', border: 'none', padding: '4px', fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Undo2 size={11} /> Release module
                      </button>
                    </div>
                  )}
                  {isMe && ['uploaded', 'standardized'].includes(mod.status) && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setUploadId(mod.id)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: '#fff', color: '#444', border: '1px solid #DCD8D0', borderRadius: '8px', padding: '7px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <RefreshCw size={11} /> Replace ZIP
                      </button>
                      <button
                        onClick={() => setDeleteUploadTarget({ id: mod.id, type: mod.type })}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: '#fff', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', padding: '7px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  )}
                  {mod.status === 'merged' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.775rem', color: '#C9A45F', fontWeight: 600 }}>
                      <GitMerge size={13} /> Integrated into build
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Merge History ── */}
        {logs.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Merge History</h2>
              <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{logs.length} run{logs.length !== 1 ? 's' : ''}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.map((log) => {
                const isExpanded = expandedLog === log.id;
                const isSuccess = log.status === 'success';
                return (
                  <div
                    key={log.id}
                    className="proj-log-row"
                    style={{ background: '#fff', border: '1px solid #E8E4DD', borderRadius: '12px', overflow: 'hidden' }}
                  >
                    <button
                      onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Terminal size={13} style={{ color: '#888' }} />
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.6875rem', fontWeight: 700, color: isSuccess ? '#3DB87A' : '#E05A5A', background: isSuccess ? 'rgba(61,184,122,0.1)' : 'rgba(224,90,90,0.1)', borderRadius: '20px', padding: '3px 9px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                          {log.status}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 500 }}>
                          {new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp size={14} style={{ color: '#888' }} /> : <ChevronDown size={14} style={{ color: '#888' }} />}
                    </button>

                    {isExpanded && (
                      <div style={{ borderTop: '1px solid #F0EDE8', padding: '0 18px 16px' }}>
                        <LogViewer logs={log.log_output} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showInvite && (
          <InviteModal
            inviteLink={inviteLink}
            onGenerate={handleGenInvite}
            onClose={() => { setShowInvite(false); setInviteLink(null); }}
          />
        )}

        {/* Delete Upload Confirmation Modal */}
        {deleteUploadTarget && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }} onClick={() => !deletingUpload && setDeleteUploadTarget(null)}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff', border: '1px solid #E7E5E1', borderRadius: '20px',
                padding: '30px', maxWidth: '380px', width: '100%',
                boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px',
              }}
            >
              <div style={{
                width: '50px', height: '50px', borderRadius: '14px',
                background: 'rgba(220,38,38,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#dc2626', flexShrink: 0,
              }}>
                <Trash2 size={22} />
              </div>
              <div>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111', margin: '0 0 6px', textTransform: 'capitalize' }}>
                  Delete {deleteUploadTarget.type} Code?
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#666', margin: 0, lineHeight: 1.5 }}>
                  This will remove the uploaded ZIP package and reset the module to in-progress so you can re-upload or release it.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '6px' }}>
                <button
                  onClick={() => setDeleteUploadTarget(null)}
                  disabled={deletingUpload}
                  style={{ flex: 1, background: '#F5F3EF', color: '#444', border: '1px solid #E2DED8', borderRadius: '8px', padding: '10px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUploadConfirm}
                  disabled={deletingUpload}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: deletingUpload ? '#fca5a5' : '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '0.875rem', fontWeight: 600, cursor: deletingUpload ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                >
                  <Trash2 size={13} />
                  {deletingUpload ? 'Deleting…' : 'Delete Code'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }} onClick={() => !deleting && setShowDeleteConfirm(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff', border: '1px solid #E7E5E1', borderRadius: '20px',
                padding: '32px', maxWidth: '400px', width: '100%',
                boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px',
              }}
            >
              <div style={{
                width: '54px', height: '54px', borderRadius: '14px',
                background: 'rgba(220,38,38,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#dc2626', flexShrink: 0,
              }}>
                <Trash2 size={24} />
              </div>
              <div>
                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111', margin: '0 0 6px' }}>
                  Delete &ldquo;{project?.name}&rdquo;?
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#666', margin: 0, lineHeight: 1.5 }}>
                  This will permanently remove all modules, invites, and merge logs.{' '}
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>This cannot be undone.</span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '6px' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  style={{ flex: 1, background: '#F5F3EF', color: '#444', border: '1px solid #E2DED8', borderRadius: '8px', padding: '10px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  disabled={deleting}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: deleting ? '#fca5a5' : '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '0.875rem', fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                >
                  <Trash2 size={13} />
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
