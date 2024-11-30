'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, Activity, CheckCircle, Clock, XCircle, AlertCircle, LucideIcon } from 'lucide-react';
import { FC } from 'react';

type StatusType = "Realizado" | "Pendiente" | "Pospuesto" | "Sin Realizar";

interface StatusCardProps {
  status: StatusType;
  count: number;
  icon: LucideIcon;
}

const COLORS: Record<StatusType, string> = {
  "Realizado": "#10b981",
  "Pendiente": "#f59e0b",
  "Pospuesto": "#ef4444",
  "Sin Realizar": "#6b7280"
};

const GRADIENTS: Record<StatusType, [string, string]> = {
  "Realizado": ["#10b981", "#059669"],
  "Pendiente": ["#f59e0b", "#d97706"],
  "Pospuesto": ["#ef4444", "#dc2626"],
  "Sin Realizar": ["#fff", "#ffffff"]
};

const ActivityDashboard: FC = () => {
  const data: Record<StatusType, number> = {
    "Realizado": 30,
    "Pendiente": 3,
    "Pospuesto": 3,
    "Sin Realizar": 5
  };

  // Datos para las gráficas
  const pieData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(data).map(([name, value]) => ({ name, cantidad: value }));

  const CustomTooltip: FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className=" p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label || payload[0].name}</p>
          <p className="text-sm">
            Cantidad: <span className="font-bold">{value}</span>
          </p>
          <p className="text-xs text-gray-500">
            {((value / 41) * 100).toFixed(1)}% del total
          </p>
        </div>
      );
    }
    return null;
  };

  const StatusCard: FC<StatusCardProps> = ({ status, count, icon: Icon }) => (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{status}</p>
            <h3 className="text-3xl font-bold" style={{ color: COLORS[status] }}>
              {count}
            </h3>
          </div>
          <div 
            className="p-3 rounded-full"
            style={{ backgroundColor: `${COLORS[status]}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: COLORS[status] }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getIconForStatus = (status: StatusType): LucideIcon => {
    const icons: Record<StatusType, LucideIcon> = {
      "Realizado": CheckCircle,
      "Pendiente": Clock,
      "Pospuesto": AlertCircle,
      "Sin Realizar": XCircle
    };
    return icons[status];
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto  rounded-xl">
      {/* El resto del JSX permanece exactamente igual */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Actividades</h1>
        <p className="text-gray-500">Visualización detallada del estado de todas las actividades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(data) as [StatusType, number][]).map(([status, count]) => (
          <StatusCard 
            key={status}
            status={status}
            count={count}
            icon={getIconForStatus(status)}
          />
        ))}
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Gráficas
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Detalles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Estados</CardTitle>
                <CardDescription>Vista porcentual de los estados de actividades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer>
                    <PieChart>
                      <defs>
                        {(Object.entries(GRADIENTS) as [StatusType, [string, string]][]).map(([status, [color1, color2]]) => (
                          <linearGradient key={status} id={`gradient-${status}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color1} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={color2} stopOpacity={0.8}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={`url(#gradient-${entry.name})`}
                            stroke={COLORS[entry.name as StatusType]}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value: string) => (
                          <span className="text-sm font-medium">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparativa de Estados</CardTitle>
                <CardDescription>Visualización comparativa por cantidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <defs>
                        {(Object.entries(GRADIENTS) as [StatusType, [string, string]][]).map(([status, [color1, color2]]) => (
                          <linearGradient key={status} id={`gradient-${status}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color1} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={color2} stopOpacity={0.8}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="cantidad" 
                        radius={[4, 4, 0, 0]}
                      >
                        {barData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={`url(#gradient-${entry.name})`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Actividades</CardTitle>
              <CardDescription>Información detallada de todas las actividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.entries(data) as [StatusType, number][]).map(([status, count]) => {
                  const Icon = getIconForStatus(status);
                  return (
                    <div 
                      key={status}
                      className="flex items-center p-4 rounded-lg border  hover:shadow-md transition-shadow"
                      style={{ borderColor: COLORS[status] }}
                    >
                      <div 
                        className="p-3 rounded-full mr-4"
                        style={{ backgroundColor: `${COLORS[status]}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: COLORS[status] }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: COLORS[status] }}>{status}</p>
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-sm text-gray-500">
                          {((count / 41) * 100).toFixed(1)}% del total
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityDashboard;