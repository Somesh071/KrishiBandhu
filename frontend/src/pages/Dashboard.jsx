import { useEffect, useState } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets,
  Thermometer,
  MapPin,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Phone,
  Upload,
  Leaf,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useConversationStore from '../store/conversationStore';
import dataService from '../services/data.service';
import adminService from '../services/admin.service';
import { AppLayout, PageHeader } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

// Weather icon mapping
const getWeatherIcon = (condition, size = 'w-6 h-6') => {
  const cond = condition?.toLowerCase() || '';
  if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className={size} />;
  if (cond.includes('cloud')) return <Cloud className={size} />;
  return <Sun className={size} />;
};

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// =============================================================================
// WELCOME SECTION
// =============================================================================
const WelcomeSection = ({ user }) => {
  const greeting = getGreeting();
  
  return (
    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-6 lg:p-8 text-white mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-primary-200 text-sm font-medium mb-1">{greeting}</p>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            {user?.name || 'Farmer'}
          </h1>
          <p className="text-primary-100 text-sm lg:text-base max-w-lg">
            WillKommen to KrishiBandhu. Check today's weather, market prices, and get AI-powered farming suggestions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/chat">
            <Button variant="secondary" icon={MessageSquare} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Ask AI
            </Button>
          </Link>
          <Link to="/call">
            <Button variant="secondary" icon={Phone} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Voice Call
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// WEATHER CARD
// =============================================================================
const WeatherCard = ({ weather, isLoading, onRefresh, location }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <Sun className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">Weather</h3>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MapPin className="w-3 h-3" />
              {location || 'Your Location'}
              {weather?.isMockData && <Badge size="sm" variant="warning">Sample</Badge>}
            </div>
          </div>
        </div>
        <IconButton 
          icon={isLoading ? Loader2 : RefreshCw} 
          onClick={onRefresh}
          className={isLoading ? 'animate-spin' : ''}
        />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : weather ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Temperature */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Temperature</p>
                  <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {weather.temperature?.current}°
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Feels {weather.temperature?.feelsLike}°
                  </p>
                </div>
                <Thermometer className="w-5 h-5 text-secondary-500" />
              </div>
            </div>

            {/* Condition */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Condition</p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {weather.condition}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1 capitalize">
                    {weather.description}
                  </p>
                </div>
                <span className="text-sky-500">{getWeatherIcon(weather.condition, 'w-5 h-5')}</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Humidity</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {weather.humidity}%
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {weather.humidity > 70 ? 'High' : weather.humidity > 40 ? 'Moderate' : 'Low'}
                  </p>
                </div>
                <Droplets className="w-5 h-5 text-sky-500" />
              </div>
            </div>

            {/* Wind */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Wind Speed</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {weather.windSpeed}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">km/h</p>
                </div>
                <Wind className="w-5 h-5 text-neutral-400" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-8">Weather data unavailable</p>
        )}
      </CardContent>
    </Card>
  );
};

// =============================================================================
// MARKET PRICES CARD
// =============================================================================
const MarketPricesCard = () => {
  const marketData = [
    { crop: 'Rice (Basmati)', price: '₹3,850', unit: '/quintal', trend: 'up', change: '+2.5%' },
    { crop: 'Wheat', price: '₹2,275', unit: '/quintal', trend: 'down', change: '-1.2%' },
    { crop: 'Cotton', price: '₹6,420', unit: '/quintal', trend: 'up', change: '+3.8%' },
    { crop: 'Sugarcane', price: '₹350', unit: '/quintal', trend: 'stable', change: '0%' },
    { crop: 'Soybean', price: '₹4,180', unit: '/quintal', trend: 'up', change: '+1.5%' },
  ];

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-neutral-400" />;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle icon={TrendingUp}>Market Prices</CardTitle>
        <Badge variant="primary">Today</Badge>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <th className="text-left py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Crop</th>
                <th className="text-right py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Price</th>
                <th className="text-right py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {marketData.map((item, idx) => (
                <tr key={idx} className="group">
                  <td className="py-3">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {item.crop}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {item.price}
                    </span>
                    <span className="text-xs text-neutral-400 ml-1">{item.unit}</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendIcon trend={item.trend} />
                      <span className={`text-xs font-medium ${
                        item.trend === 'up' ? 'text-green-600' : 
                        item.trend === 'down' ? 'text-red-600' : 
                        'text-neutral-500'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// QUICK ACTION CARDS
// =============================================================================
const QuickActionCard = ({ icon: Icon, title, description, onClick, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-600 group-hover:bg-primary-700',
    secondary: 'bg-secondary-500 group-hover:bg-secondary-600',
    sky: 'bg-sky-500 group-hover:bg-sky-600',
    earth: 'bg-earth-600 group-hover:bg-earth-700',
  };

  return (
    <Card hover onClick={onClick} className="group cursor-pointer">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 transition-colors`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{description}</p>
      <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
        Get Started
        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
};

// =============================================================================
// RECENT ACTIVITY PANEL
// =============================================================================
const RecentActivityPanel = ({ conversations }) => {
  const recentItems = conversations?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={Clock}>Recent Activity</CardTitle>
        <Link to="/history" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View All
        </Link>
      </CardHeader>

      <CardContent>
        {recentItems.length > 0 ? (
          <div className="space-y-3">
            {recentItems.map((item, idx) => (
              <Link
                key={item._id || idx}
                to="/chat"
                state={{ resumeConversation: { id: item._id } }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {item.title || 'Conversation'}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-sm text-neutral-500">No recent conversations</p>
            <Link to="/chat">
              <Button variant="ghost" size="sm" className="mt-2">
                Start a conversation
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =============================================================================
// GOVERNMENT SCHEMES PREVIEW
// =============================================================================
const SchemesPreview = ({ schemes, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle icon={FileText}>Government Schemes</CardTitle>
        <Badge variant="success" dot>Active</Badge>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : schemes.length > 0 ? (
          <div className="space-y-3">
            {schemes.slice(0, 3).map((scheme, idx) => (
              <div
                key={scheme._id || idx}
                className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1 truncate">
                      {scheme.name}
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {scheme.description || 'Government agricultural support scheme'}
                    </p>
                  </div>
                  {scheme.link && (
                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-sm text-neutral-500">No schemes available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================
const Dashboard = () => {
  const { user } = useAuthStore();
  const { conversations, fetchConversations } = useConversationStore();
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingSchemes, setIsLoadingSchemes] = useState(true);

  useEffect(() => {
    fetchConversations().catch(console.error);
    fetchWeatherData();
    fetchSchemesData();
  }, [fetchConversations]);

  const fetchWeatherData = async () => {
    setIsLoadingWeather(true);
    try {
      const response = await dataService.getCurrentWeather();
      if (response.success && response.data) {
        setWeather(response.data);
      } else {
        setMockWeather();
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
      setMockWeather();
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const setMockWeather = () => {
    setWeather({
      location: user?.location?.city || user?.location?.district || 'Your Location',
      temperature: { current: 28, feelsLike: 30, min: 24, max: 32, unit: '°C' },
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      description: 'scattered clouds',
      isMockData: true
    });
  };

  const fetchSchemesData = async () => {
    setIsLoadingSchemes(true);
    try {
      const response = await adminService.getPublicSchemes();
      if (response.success && response.data?.length > 0) {
        setSchemes(response.data);
      } else {
        setSchemes([]);
      }
    } catch (error) {
      console.error('Schemes fetch error:', error);
      setSchemes([]);
    } finally {
      setIsLoadingSchemes(false);
    }
  };

  const hasLocation = user?.location?.state;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Location Warning */}
        {!hasLocation && (
          <Card className="mb-6 border-l-4 border-l-secondary-400" padding="sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    Location not set
                  </p>
                  <p className="text-xs text-neutral-500">
                    Set your location to get personalized weather and market data
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/profile')}
              >
                Set Location
              </Button>
            </div>
          </Card>
        )}

        {/* Welcome Section */}
        <WelcomeSection user={user} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Weather Card - Takes 1 column */}
          <div className="lg:col-span-1">
            <WeatherCard 
              weather={weather}
              isLoading={isLoadingWeather}
              onRefresh={fetchWeatherData}
              location={weather?.location || user?.location?.district || user?.location?.state}
            />
          </div>

          {/* Market Prices - Takes 2 columns */}
          <div className="lg:col-span-2">
            <MarketPricesCard />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              icon={MessageSquare}
              title="Ask AI Assistant"
              description="Get instant answers to your farming questions"
              onClick={() => navigate('/chat')}
              color="primary"
            />
            <QuickActionCard
              icon={FileText}
              title="Check Schemes"
              description="Explore government schemes and subsidies"
              onClick={() => navigate('/chat')}
              color="secondary"
            />
            <QuickActionCard
              icon={Leaf}
              title="Crop Advisory"
              description="Get personalized crop recommendations"
              onClick={() => navigate('/chat')}
              color="sky"
            />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RecentActivityPanel conversations={conversations} />
          <SchemesPreview schemes={schemes} isLoading={isLoadingSchemes} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
