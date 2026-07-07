import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import StatCard from '../../components/ui/StatCard';
import { BookOpen, Trophy, Clock, Target } from 'lucide-react';

function DashboardView() {
  return (
    <div className="dashboard-view" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>Welcome back, Student!</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>Here's an overview of your learning progress.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
        <StatCard icon={<BookOpen />} label="Active Courses" value={4} trend="up" trendValue="2 this week" gradient="cyan" />
        <StatCard icon={<Trophy />} label="Certificates" value={12} trend="up" trendValue="1 new" gradient="magenta" />
        <StatCard icon={<Clock />} label="Hours Learned" value={128} trend="up" trendValue="15h this week" gradient="green" />
        <StatCard icon={<Target />} label="Current Streak" value={14} suffix=" days" trend="up" trendValue="Personal best!" gradient="orange" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        <GlassCard>
          <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)' }}>Recent Activity</h2>
          <div style={{ color: 'var(--color-text-muted)' }}>No recent activity to show.</div>
        </GlassCard>
        <GlassCard>
          <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-4)' }}>Upcoming Deadlines</h2>
          <div style={{ color: 'var(--color-text-muted)' }}>You're all caught up!</div>
        </GlassCard>
      </div>
    </div>
  );
}

export default DashboardView;
