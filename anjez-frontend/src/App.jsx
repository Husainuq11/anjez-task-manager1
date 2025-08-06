import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Calendar, CheckCircle, Clock, Plus, Settings, Target, Trash2, Edit, Globe, Moon, Sun, Menu, X } from 'lucide-react'
import { TaskManager } from './components/TaskManager.jsx'
import { HabitTracker } from './components/HabitTracker.jsx'
import logo from './assets/logo.png'
import './App.css'

// Language Context
const LanguageContext = createContext()

// Translation object
const translations = {
  ar: {
    appName: 'أنجز',
    dashboard: 'لوحة التحكم',
    tasks: 'المهام',
    habits: 'العادات',
    settings: 'الإعدادات',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    email: 'البريد الإلكتروني',
    register: 'إنشاء حساب',
    welcome: 'مرحباً بك',
    welcomeDesc: 'إدارة مهامك وتتبع عاداتك بسهولة',
    totalTasks: 'إجمالي المهام',
    completedToday: 'مكتملة اليوم',
    activeHabits: 'العادات النشطة',
    todaysTasks: 'مهام اليوم',
    recentHabits: 'العادات الحديثة',
    addNewTask: 'إضافة مهمة جديدة',
    addNewHabit: 'إضافة عادة جديدة',
    taskTitle: 'عنوان المهمة',
    taskDescription: 'وصف المهمة',
    dueDate: 'تاريخ الاستحقاق',
    priority: 'الأولوية',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
    habitName: 'اسم العادة',
    habitDescription: 'وصف العادة',
    frequency: 'التكرار',
    daily: 'يومي',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    complete: 'مكتمل',
    pending: 'قيد الانتظار',
    overdue: 'متأخر',
    currentStreak: 'السلسلة الحالية',
    days: 'أيام',
    language: 'اللغة',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    all: 'الكل',
    completed: 'مكتملة',
    markComplete: 'تحديد كمكتمل',
    checkIn: 'تسجيل دخول'
  },
  en: {
    appName: 'Anjez',
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    habits: 'Habits',
    settings: 'Settings',
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    register: 'Register',
    welcome: 'Welcome back',
    welcomeDesc: 'Manage your tasks and track your habits with ease',
    totalTasks: 'Total Tasks',
    completedToday: 'Completed Today',
    activeHabits: 'Active Habits',
    todaysTasks: "Today's Tasks",
    recentHabits: 'Recent Habits',
    addNewTask: 'Add New Task',
    addNewHabit: 'Add New Habit',
    taskTitle: 'Task Title',
    taskDescription: 'Task Description',
    dueDate: 'Due Date',
    priority: 'Priority',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    habitName: 'Habit Name',
    habitDescription: 'Habit Description',
    frequency: 'Frequency',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    complete: 'Complete',
    pending: 'Pending',
    overdue: 'Overdue',
    currentStreak: 'Current Streak',
    days: 'days',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    all: 'All',
    completed: 'Completed',
    markComplete: 'Mark Complete',
    checkIn: 'Check In'
  }
}

// Language Provider
function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar')
  const [theme, setTheme] = useState('light')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const t = (key) => translations[language][key] || key

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <LanguageContext.Provider value={{ 
      language, setLanguage, theme, setTheme, t, 
      isAuthenticated, user, login, logout 
    }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`${theme} ${language === 'ar' ? 'font-arabic' : 'font-english'}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

// Custom hook to use language context
function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Header Component
function Header({ currentPage, setCurrentPage }) {
  const { language, setLanguage, theme, setTheme, t, isAuthenticated, user, logout } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'tasks', label: t('tasks') },
    { id: 'habits', label: t('habits') }
  ]

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} alt="Anjez Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">{t('appName')}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`font-medium ${
                  currentPage === item.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* User Info and Logout */}
            {isAuthenticated && user && (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700"
                >
                  {t('logout')}
                </Button>
              </>
            )}

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'ar' ? 'EN' : 'عر'}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`text-left py-2 font-medium ${
                    currentPage === item.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Login Component
function Login() {
  const { t, login } = useLanguage()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.user, data.token)
      } else {
        setError(data.message || 'حدث خطأ أثناء تسجيل الدخول')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img src={logo} alt="Anjez Logo" className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? t('login') : t('register')}
          </h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <div>
                <Label htmlFor="username">{t('username')}</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'جاري التحميل...' : (isLogin ? t('login') : t('register'))}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  {isLogin ? 'إنشاء حساب جديد' : 'لديك حساب؟ سجل دخولك'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Dashboard Component
function Dashboard() {
  const { t } = useLanguage()
  const [tasks, setTasks] = useState([])
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load tasks
      const tasksResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`)
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json()
        setTasks(tasksData)
      }

      // Load habits
      const habitsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/habits`)
      if (habitsResponse.ok) {
        const habitsData = await habitsResponse.json()
        setHabits(habitsData)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Fallback to mock data if API fails
      setTasks([
        { id: 1, title: 'مراجعة التقرير الشهري', description: 'مراجعة وتحليل التقرير المالي', due_date: '2025-01-27', priority: 'high', completed: false },
        { id: 2, title: 'اجتماع الفريق', description: 'اجتماع أسبوعي مع الفريق', due_date: '2025-01-26', priority: 'medium', completed: true },
        { id: 3, title: 'تحديث الموقع', description: 'إضافة ميزات جديدة للموقع', due_date: '2025-01-28', priority: 'low', completed: false }
      ])
      setHabits([
        { id: 1, name: 'قراءة يومية', description: 'قراءة 30 دقيقة يومياً', streak: 5, frequency: 'daily', last_checkin: '2025-01-26' },
        { id: 2, name: 'تمارين رياضية', description: 'ممارسة الرياضة لمدة ساعة', streak: 3, frequency: 'daily', last_checkin: '2025-01-25' },
        { id: 3, name: 'تعلم لغة جديدة', description: 'دراسة اللغة الإنجليزية', streak: 7, frequency: 'daily', last_checkin: '2025-01-26' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const completedToday = tasks.filter(task => task.completed && task.due_date === today).length
  const todaysTasks = tasks.filter(task => task.due_date === today)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('welcome')}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t('welcomeDesc')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalTasks')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completedToday')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeHabits')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habits.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks and Recent Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>{t('todaysTasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysTasks.map(task => (
                <div key={task.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Checkbox checked={task.completed} />
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                    {t(task.priority)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Habits */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recentHabits')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.slice(0, 3).map(habit => (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{habit.name}</p>
                    <p className="text-sm text-gray-500">{t('currentStreak')}: {habit.streak} {t('days')}</p>
                  </div>
                  <Progress value={(habit.streak / 30) * 100} className="w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <LanguageProvider>
      <AppContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </LanguageProvider>
  )
}

// App Content Component
function AppContent({ currentPage, setCurrentPage }) {
  const { t, isAuthenticated } = useLanguage()

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'tasks':
        return <TaskManager t={t} />
      case 'habits':
        return <HabitTracker t={t} />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App