import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Wallet, Car, Clock, TrendingUp } from 'lucide-react';

const DashStats = ({ data }) => {

    // If data hasn't arrived yet, show a skeleton or null
  if (!data) return <div className="p-10 text-textDim">Loading analytics...</div>;
    // 1. Format the raw dates for better X-Axis readability
  const chartData = data?.monthlyData?.map(item => ({
    displayDate: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    amount: item.amount,
  })) || [];
  

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Spent" value={`₹${data.totalSpent || 0}`} icon={<Wallet className="text-primary" />} />
        <StatCard title="Bookings" value={data.totalBookings || 0} icon={<Car className="text-success" />} />
        <StatCard title="Avg. Ticket" value={data.avgAmount ? `₹${data.avgAmount}` : '₹undefined'} icon={<TrendingUp className="text-warning" />} />
        <StatCard title="Avg. Duration" value={data.avgDuration ? `${data.avgDuration}h` : 'N/A'} icon={<Clock className="text-danger" />} />
      </div>

      {/* Main Chart Section */}
      <div className="pos-card-chart mt-6 ">
        <h3 className="text-lg font-semibold mb-4">Spending Trend</h3>
        <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006AFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#006AFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
            <XAxis 
              dataKey="displayDate" 
              stroke="#8B949E" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#8B949E" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '8px' }}
              itemStyle={{ color: '#F0F6FC' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#006AFF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="pos-card flex items-center gap-4">
    <div className="p-3 bg-background rounded-lg border border-border">
      {icon}
    </div>
    <div>
      <p className="text-textDim text-xs font-medium uppercase tracking-wider">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  </div>
);

export default DashStats;