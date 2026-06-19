import React from 'react';
import {
  TrendingUp, TrendingDown,
  Users, BookOpen, GraduationCap, Award, Star, BarChart3,
  Activity, DollarSign, ShoppingCart, UserCheck, Headphones,
  FolderTree, ClipboardList, Settings, User, LayoutDashboard
} from 'lucide-react';
import '../../styles/cards.css';

/* Map of icon name strings to components (avoids wildcard import) */
const ICON_MAP = {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Star,
  BarChart3,
  Activity,
  DollarSign,
  ShoppingCart,
  UserCheck,
  Headphones,
  FolderTree,
  ClipboardList,
  Settings,
  User,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
};

function StatCard({ label, value, trend, trendDirection, icon, gradient, index = 0 }) {
  const IconComponent = ICON_MAP[icon] || Activity;

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val >= 1000 ? val.toLocaleString('en-IN') : val;
    }
    return val;
  };

  /* CSS animation delay per card */
  const delay = `${index * 80}ms`;

  return (
    <div
      className="stat-card"
      style={{ '--card-delay': delay }}
    >
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: gradient }}>
          <IconComponent size={20} strokeWidth={2} />
        </div>
        {trend && (
          <div className={`stat-card-trend ${trendDirection}`}>
            {trendDirection === 'up'
              ? <TrendingUp size={13} />
              : <TrendingDown size={13} />
            }
            {trend}
          </div>
        )}
      </div>
      <div className="stat-card-value">{formatValue(value)}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

export default StatCard;
