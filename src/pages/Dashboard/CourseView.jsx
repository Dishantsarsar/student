import React from 'react';
import { useParams, Link } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { ArrowLeft, PlayCircle } from 'lucide-react';

function CourseView() {
  const { id } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <Link to="/dashboard/courses" style={{ color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', textDecoration: 'none', marginBottom: 'var(--space-4)' }}>
          <ArrowLeft size={16} /> Back to Courses
        </Link>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>Course Details {id}</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlayCircle size={64} color="var(--color-text-muted)" />
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)' }}>Module 1: Introduction</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>This module covers the basics of the framework and sets up our development environment.</p>
          </div>
        </GlassCard>
        
        <GlassCard>
          <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-4)' }}>Course Content</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Button variant="secondary" style={{ justifyContent: 'flex-start' }}>1. Introduction</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>2. Setup</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>3. Core Concepts</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default CourseView;
