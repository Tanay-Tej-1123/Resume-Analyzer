import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Search } from 'lucide-react';

export default function Admin() {
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [expandedJob, setExpandedJob] = useState(null);
    const [jobCandidates, setJobCandidates] = useState([]);
    const [loadingCandidates, setLoadingCandidates] = useState(false);

    const fetchJobs = () => {
        axios.get('http://localhost:8080/api/jobs')
            .then(res => setJobs(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/jobs', {
                title, description, requiredSkills
            });
            setTitle('');
            setDescription('');
            setRequiredSkills('');
            fetchJobs();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleCandidates = async (jobId) => {
        if (expandedJob === jobId) {
            setExpandedJob(null);
            setJobCandidates([]);
            return;
        }
        setExpandedJob(jobId);
        setLoadingCandidates(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/analysis/job/${jobId}`);
            setJobCandidates(res.data);
        } catch (err) {
            console.error("Error fetching candidates", err);
            setJobCandidates([]);
        }
        setLoadingCandidates(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>

                {/* Create Job Form */}
                <div className="glass-panel" style={{ padding: '30px', height: 'fit-content' }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <PlusCircle color="var(--primary)" /> Add New Job
                    </h2>
                    <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Job Title</label>
                            <input type="text" className="input-field" placeholder="e.g. Frontend Engineer" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Job Description</label>
                            <textarea className="input-field" placeholder="Responsibilities and requirements..." value={description} onChange={e => setDescription(e.target.value)} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Core Skills (for AI Matching)</label>
                            <textarea className="input-field" style={{ minHeight: '80px' }} placeholder="e.g. react, javascript, tailwind, machine learning" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Publish Job</button>
                    </form>
                </div>

                {/* Job List */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Active Roles</h2>
                        <div style={{ position: 'relative' }}>
                            <Search color="var(--text-muted)" size={16} style={{ position: 'absolute', left: '12px', top: '12px' }} />
                            <input type="text" className="input-field" placeholder="Search roles..." style={{ paddingLeft: '36px', width: '250px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {jobs.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No jobs posted yet.</div>
                        ) : (
                            jobs.map(job => (
                                <div key={job.id} className="job-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.2' }}>{job.title}</h3>
                                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 8px', borderRadius: '8px', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Active
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
                                    <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {job.requiredSkills.split(',').map((s, i) => s.trim().length > 0 && i < 3 && (
                                            <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>{s.trim()}</span>
                                        ))}
                                        {job.requiredSkills.split(',').filter(s => s.trim().length > 0).length > 3 && (
                                            <span style={{ background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>+{job.requiredSkills.split(',').filter(s => s.trim().length > 0).length - 3}</span>
                                        )}
                                    </div>
                                    
                                    <button 
                                        className="btn-primary" 
                                        style={{ width: '100%', padding: '10px', fontSize: '14px', background: expandedJob === job.id ? 'var(--panel-border)' : 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
                                        onClick={() => toggleCandidates(job.id)}
                                    >
                                        {expandedJob === job.id ? 'Hide Candidates' : 'View Candidates ▾'}
                                    </button>
                                {expandedJob === job.id && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--panel-border)' }}>
                                        <h4 style={{ marginBottom: '12px', fontSize: '16px', color: 'var(--text-main)' }}>Ranked Candidates</h4>
                                        {loadingCandidates ? (
                                            <div style={{ color: 'var(--text-muted)' }}>Loading candidates...</div>
                                        ) : jobCandidates.length === 0 ? (
                                            <div style={{ color: 'var(--text-muted)' }}>No candidates have applied yet.</div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {jobCandidates.map((candidate, idx) => (
                                                    <div key={candidate.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                {idx + 1}. {candidate.candidateName}
                                                                {idx === 0 && <span style={{ background: 'gold', color: '#000', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>TOP MATCH</span>}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Resume: {candidate.originalFileName}</div>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: candidate.matchPercentage >= 75 ? 'var(--success)' : candidate.matchPercentage >= 50 ? '#f59e0b' : 'var(--danger)' }}>
                                                                {candidate.matchPercentage.toFixed(0)}% Match
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Parsed from PDF</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
