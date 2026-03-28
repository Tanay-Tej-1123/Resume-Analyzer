import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Home() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch Jobs
        axios.get('http://localhost:8080/api/jobs')
            .then(res => {
                setJobs(res.data);
                if (res.data.length > 0) setSelectedJob(res.data[0].id);
            })
            .catch(err => console.error(err));
    }, []);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file || !selectedJob || !candidateName) {
            setError("Please fill all fields.");
            return;
        }
        setError(null);
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobId', selectedJob);
        formData.append('candidateName', candidateName);

        try {
            const res = await axios.post('http://localhost:8080/api/analyze', formData);
            // Wait for 1 second just for a smooth UX animation
            setTimeout(() => {
                setResult(res.data);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError(err.response?.data || err.message);
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            
            {/* Hero Landing Section */}
            <div style={{ textAlign: 'center', padding: '60px 20px', position: 'relative' }}>
                <div className="floating-bubble" style={{ position: 'absolute', top: '20%', left: '15%', background: 'var(--primary)', width: '300px', height: '300px', borderRadius: '50%', filter: 'blur(100px)', opacity: '0.4' }}></div>
                <div className="floating-bubble" style={{ position: 'absolute', top: '40%', right: '15%', background: 'var(--secondary)', width: '250px', height: '250px', borderRadius: '50%', filter: 'blur(100px)', opacity: '0.4', animationDelay: '2s' }}></div>
                
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '6px 16px', borderRadius: '20px', color: '#a5b4fc', fontSize: '14px', fontWeight: '500', marginBottom: '24px' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }}></span>
                        AI-Powered Resume ATS
                    </div>
                    <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
                        Land Your Dream Job with <br/>
                        <span className="gradient-text">Intelligent Matching.</span>
                    </h1>
                    <p style={{ fontSize: '20px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                        Instantly analyze your resume against any job description. Discover missing skills, get AI-driven feedback, and optimize your application in seconds.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <button onClick={() => document.getElementById('analyzer-tool').scrollIntoView({ behavior: 'smooth' })} className="btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>
                            Start Analyzing Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Analyzer Section */}
            <div id="analyzer-tool" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'start', scrollMarginTop: '100px' }}>

            {/* Upload Section */}
            <div className="glass-panel hover-glow" style={{ padding: '30px', transition: 'box-shadow 0.3s' }}>
                <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>Submit Application</h2>

                {error && <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', marginBottom: '20px', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Candidate Name</label>
                        <input type="text" className="input-field" placeholder="John Doe" value={candidateName} onChange={e => setCandidateName(e.target.value)} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Target Position</label>
                        <select className="input-field" value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
                            <option value="" disabled>Select a job...</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Upload Resume</label>
                        <div
                            style={{
                                border: '2px dashed var(--panel-border)',
                                borderRadius: '16px',
                                padding: '40px 20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.02)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--panel-border)'}
                        >
                            <input type="file" id="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} accept=".pdf,.docx" />
                            <label htmlFor="file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '50%' }}>
                                    <UploadCloud color="var(--primary)" size={32} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '500', color: 'white', marginBottom: '4px' }}>Click to upload resume</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>PDF or DOCX (max 5MB)</div>
                                </div>
                                {file && <div style={{ marginTop: '10px', color: 'var(--success)' }}>Selected: {file.name}</div>}
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }} disabled={loading}>
                        {loading ? <><Loader2 className="animate-spin" size={20} /> Analyzing...</> : 'Analyze Match'}
                    </button>
                </form>
            </div>

            {/* Result Section */}
            <div style={{ height: '100%' }}>
                {!result && !loading && (
                    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', minHeight: '400px' }}>
                        <CheckCircle size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                        <p>Results will appear here</p>
                    </div>
                )}

                {loading && (
                    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                        <div className="scanning-container">
                            <div className="doc-line"></div>
                            <div className="doc-line short"></div>
                            <div className="doc-line"></div>
                            <div className="doc-line"></div>
                            <div className="doc-line short"></div>
                            <div className="scanning-line"></div>
                        </div>
                        <p style={{ fontSize: '20px', fontWeight: '600', background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: '16px' }}>
                            Running AI NLP Engine...
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px', animation: 'pulse 1.5s infinite' }}>
                            Extracting skills & evaluating constraints
                        </p>
                    </div>
                )}

                {result && (
                    <div className="glass-panel animate-fade-in" style={{ padding: '30px' }}>
                        <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: '600' }}>Analysis Report</h2>

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                            <svg viewBox="0 0 36 36" className={`circular-chart ${result.matchPercentage >= 75 ? 'green' : result.matchPercentage >= 50 ? 'orange' : 'red'}`}>
                                <path className="circle-bg"
                                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path className="circle"
                                    strokeDasharray={`${result.matchPercentage}, 100`}
                                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <text x="18" y="20.35" className="percentage">{Math.round(result.matchPercentage)}%</text>
                            </svg>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                <h3 style={{ fontSize: '15px', color: 'var(--success)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16}/> Matched Skills</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {JSON.parse(result.matchedSkills).length > 0 ?
                                        JSON.parse(result.matchedSkills).map(s => <span key={s} className="pill match">{s}</span>) :
                                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No exact matches found.</span>
                                    }
                                </div>
                            </div>

                            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                <h3 style={{ fontSize: '15px', color: 'var(--danger)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={16}/> Missing Core Skills</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {JSON.parse(result.missingSkills).length > 0 ?
                                        JSON.parse(result.missingSkills).map(s => <span key={s} className="pill miss">{s}</span>) :
                                        <span style={{ color: 'var(--success)', fontSize: '13px', fontWeight: '500' }}>Perfect profile!</span>
                                    }
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '12px' }}>AI Suggestions</h3>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', borderLeft: '3px solid var(--primary)', lineHeight: '1.6' }}>
                                {result.suggestions}
                            </div>
                        </div>

                    </div>
                )}
            </div>

        </div>
        </div>
    );
}
