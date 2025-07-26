import { useState, createContext, useContext } from 'react'
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
    statistics: 'الإحصائيات',
    settings: 'الإعدادات',
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
    statistics: 'Statistics',
    settings: 'Settings',
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

  const t = (key) => translations[language][key] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, theme, setTheme, t }}>
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
  const { language, setLanguage, theme, setTheme, t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: t('dashboard') },
    { id: 'tasks', label: t('tasks') },
    { id: 'habits', label: t('habits') },
    { id: 'statistics', label: t('statistics') }
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

// Dashboard Component
function Dashboard() {
  const { t } = useLanguage()
  const [tasks] = useState([
    { id: 1, title: 'مراجعة التقرير الشهري', description: 'مراجعة وتحليل التقرير المالي', dueDate: '2025-01-27', priority: 'high', completed: false },
    { id: 2, title: 'اجتماع الفريق', description: 'اجتماع أسبوعي مع الفريق', dueDate: '2025-01-26', priority: 'medium', completed: true },
    { id: 3, title: 'تحديث الموقع', description: 'إضافة ميزات جديدة للموقع', dueDate: '2025-01-28', priority: 'low', completed: false }
  ])

  const [habits] = useState([
    { id: 1, name: 'قراءة يومية', description: 'قراءة 30 دقيقة يومياً', streak: 5, frequency: 'daily', lastCheckin: '2025-01-26' },
    { id: 2, name: 'تمارين رياضية', description: 'ممارسة الرياضة لمدة ساعة', streak: 3, frequency: 'daily', lastCheckin: '2025-01-25' },
    { id: 3, name: 'تعلم لغة جديدة', description: 'دراسة اللغة الإنجليزية', streak: 7, frequency: 'daily', lastCheckin: '2025-01-26' }
  ])

  const completedToday = tasks.filter(task => task.completed && task.dueDate === '2025-01-26').length
  const todaysTasks = tasks.filter(task => task.dueDate === '2025-01-26')

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

// Statistics Component
function Statistics() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('statistics')}</h1>
      <div className="text-center py-16 text-gray-500">
        قريباً - إحصائيات مفصلة عن أدائك
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
  const { t } = useLanguage()

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'tasks':
        return <TaskManager t={t} />
      case 'habits':
        return <HabitTracker t={t} />
      case 'statistics':
        return <Statistics />
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

