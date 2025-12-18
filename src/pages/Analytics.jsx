import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  Award,
  BarChart3,
  PieChart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalLeads: 0,
    wonLeads: 0,
    lostLeads: 0,
    conversionRate: 0,
    totalValue: 0,
    wonValue: 0,
    statusDistribution: [],
    sourceDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/leads/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#007E6E', '#73AF6F', '#E7DEAF', '#D7C097', '#28a745', '#ffc107', '#dc3545'];

  const statusChartData = analytics.statusDistribution.map(item => ({
    name: item._id.replace('_', ' ').toUpperCase(),
    value: item.count
  }));

  const sourceChartData = analytics.sourceDistribution.map(item => ({
    name: item._id.replace('_', ' ').toUpperCase(),
    value: item.count
  }));

  // Mock monthly data for trend charts
  const monthlyData = [
    { month: 'Jan', leads: 45, revenue: 125000, conversion: 22 },
    { month: 'Feb', leads: 52, revenue: 145000, conversion: 28 },
    { month: 'Mar', leads: 48, revenue: 135000, conversion: 25 },
    { month: 'Apr', leads: 61, revenue: 175000, conversion: 32 },
    { month: 'May', leads: 55, revenue: 165000, conversion: 29 },
    { month: 'Jun', leads: 67, revenue: 195000, conversion: 35 }
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Analytics Dashboard</h1>
            <p className="page-subtitle">Comprehensive insights into your sales performance</p>
          </div>
          <div className="time-range-selector">
            <select 
              className="form-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-title">Total Pipeline Value</div>
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(analytics.totalValue)}</div>
            <div className="stat-change positive">
              +15.3% from last month
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-header">
              <div className="stat-title">Revenue Won</div>
              <div className="stat-icon">
                <Award size={24} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(analytics.wonValue)}</div>
            <div className="stat-change positive">
              +22.1% from last month
            </div>
          </div>

          <div className="stat-card accent">
            <div className="stat-header">
              <div className="stat-title">Conversion Rate</div>
              <div className="stat-icon">
                <Target size={24} />
              </div>
            </div>
            <div className="stat-value">{analytics.conversionRate}%</div>
            <div className="stat-change positive">
              +2.3% from last month
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-header">
              <div className="stat-title">Active Leads</div>
              <div className="stat-icon">
                <Users size={24} />
              </div>
            </div>
            <div className="stat-value">{analytics.totalLeads}</div>
            <div className="stat-change positive">
              +8.7% from last month
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Revenue Trend */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Trend</h3>
              <TrendingUp size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#007E6E" 
                    fill="#007E6E" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lead Generation Trend */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Lead Generation</h3>
              <BarChart3 size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#73AF6F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Lead Status Distribution</h3>
              <PieChart size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Lead Sources</h3>
              <Target size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceChartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#E7DEAF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversion Rate Trend */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>Conversion Rate Trend</h3>
              <TrendingUp size={20} />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                  <Line 
                    type="monotone" 
                    dataKey="conversion" 
                    stroke="#007E6E" 
                    strokeWidth={3}
                    dot={{ fill: '#007E6E', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="insights-section">
          <h2>Performance Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon success">
                <TrendingUp size={24} />
              </div>
              <div className="insight-content">
                <h4>Strong Growth</h4>
                <p>Your conversion rate has improved by 2.3% this month, indicating better lead quality and sales process efficiency.</p>
              </div>
            </div>
            
            <div className="insight-card">
              <div className="insight-icon warning">
                <Target size={24} />
              </div>
              <div className="insight-content">
                <h4>Focus on Website Leads</h4>
                <p>Website leads show the highest conversion rate. Consider increasing your digital marketing investment.</p>
              </div>
            </div>
            
            <div className="insight-card">
              <div className="insight-icon info">
                <Calendar size={24} />
              </div>
              <div className="insight-content">
                <h4>Seasonal Trend</h4>
                <p>Lead generation typically peaks in Q4. Plan your resources accordingly for the upcoming quarter.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <h2>Quick Statistics</h2>
          <div className="quick-stats-grid">
            <div className="quick-stat">
              <div className="quick-stat-value">{analytics.wonLeads}</div>
              <div className="quick-stat-label">Deals Won</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">{analytics.lostLeads}</div>
              <div className="quick-stat-label">Deals Lost</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">₹{(analytics.wonValue / analytics.wonLeads || 0).toFixed(0)}</div>
              <div className="quick-stat-label">Avg Deal Size</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">24h</div>
              <div className="quick-stat-label">Avg Response Time</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">85%</div>
              <div className="quick-stat-label">Customer Satisfaction</div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-value">12</div>
              <div className="quick-stat-label">Days Avg Sales Cycle</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .time-range-selector {
          display: flex;
          align-items: center;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .chart-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 24px;
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .chart-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--gray-900);
        }

        .chart-container {
          width: 100%;
          height: 300px;
        }

        .insights-section {
          margin-bottom: 40px;
        }

        .insights-section h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--gray-900);
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .insight-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 24px;
          display: flex;
          gap: 16px;
        }

        .insight-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .insight-icon.success {
          background: rgba(40, 167, 69, 0.1);
          color: var(--success);
        }

        .insight-icon.warning {
          background: rgba(255, 193, 7, 0.1);
          color: var(--warning);
        }

        .insight-icon.info {
          background: rgba(23, 162, 184, 0.1);
          color: var(--info);
        }

        .insight-content h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--gray-900);
        }

        .insight-content p {
          color: var(--gray-600);
          line-height: 1.5;
        }

        .quick-stats {
          margin-bottom: 40px;
        }

        .quick-stats h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 24px;
          color: var(--gray-900);
        }

        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 24px;
        }

        .quick-stat {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 20px;
          text-align: center;
        }

        .quick-stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 8px;
        }

        .quick-stat-label {
          font-size: 14px;
          color: var(--gray-600);
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;