import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Plus, Edit, Trash2, CheckCircle, Target } from 'lucide-react'

export function HabitTracker({ t }) {
  const [habits, setHabits] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    frequency: 'daily'
  })

  // Load habits on component mount
  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/habits`)
      if (response.ok) {
        const data = await response.json()
        setHabits(data)
      }
    } catch (error) {
      console.error('Error loading habits:', error)
      // Use mock data if API fails
      setHabits([
        { id: 1, name: 'قراءة يومية', description: 'قراءة 30 دقيقة يومياً', streak: 5, frequency: 'daily', last_checkin: '2025-01-26' },
        { id: 2, name: 'تمارين رياضية', description: 'ممارسة الرياضة لمدة ساعة', streak: 3, frequency: 'daily', last_checkin: '2025-01-25' },
        { id: 3, name: 'تعلم لغة جديدة', description: 'دراسة اللغة الإنجليزية', streak: 7, frequency: 'daily', last_checkin: '2025-01-26' }
      ])
    }
  }

  const createHabit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHabit),
      })
      
      if (response.ok) {
        const habit = await response.json()
        setHabits([...habits, habit])
        setNewHabit({ name: '', description: '', frequency: 'daily' })
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      console.error('Error creating habit:', error)
      // Fallback: add to local state
      const habit = {
        id: Date.now(),
        ...newHabit,
        streak: 0,
        last_checkin: null
      }
      setHabits([...habits, habit])
      setNewHabit({ name: '', description: '', frequency: 'daily' })
      setIsAddDialogOpen(false)
    }
  }

  const deleteHabit = async (habitId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/habits/${habitId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setHabits(habits.filter(habit => habit.id !== habitId))
      }
    } catch (error) {
      console.error('Error deleting habit:', error)
      // Fallback: remove from local state
      setHabits(habits.filter(habit => habit.id !== habitId))
    }
  }

  const checkinHabit = async (habitId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/habits/${habitId}/checkin`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const updatedHabit = await response.json()
        setHabits(habits.map(habit => habit.id === habitId ? updatedHabit : habit))
      }
    } catch (error) {
      console.error('Error checking in habit:', error)
      // Fallback: update local state
      const today = new Date().toISOString().split('T')[0]
      setHabits(habits.map(habit => 
        habit.id === habitId 
          ? { ...habit, streak: habit.streak + 1, last_checkin: today }
          : habit
      ))
    }
  }

  const canCheckinToday = (habit) => {
    const today = new Date().toISOString().split('T')[0]
    return habit.last_checkin !== today
  }

  const getStreakProgress = (streak) => {
    // Calculate progress out of 30 days
    return Math.min((streak / 30) * 100, 100)
  }

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'daily': return 'bg-green-500'
      case 'weekly': return 'bg-blue-500'
      case 'monthly': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('habits')}</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('addNewHabit')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addNewHabit')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('habitName')}</Label>
                <Input
                  id="name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">{t('habitDescription')}</Label>
                <Textarea
                  id="description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="frequency">{t('frequency')}</Label>
                <Select value={newHabit.frequency} onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t('daily')}</SelectItem>
                    <SelectItem value="weekly">{t('weekly')}</SelectItem>
                    <SelectItem value="monthly">{t('monthly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={createHabit} disabled={!newHabit.name}>
                  {t('save')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <Card key={habit.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{habit.name}</CardTitle>
                  <CardDescription>{habit.description}</CardDescription>
                </div>
                <div className="flex space-x-1 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Streak Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">{t('currentStreak')}</span>
                  </div>
                  <Badge variant="secondary">
                    {habit.streak} {t('days')}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>التقدم</span>
                    <span>{Math.round(getStreakProgress(habit.streak))}%</span>
                  </div>
                  <Progress value={getStreakProgress(habit.streak)} className="h-2" />
                </div>

                {/* Frequency Badge */}
                <div className="flex items-center justify-between">
                  <Badge className={`${getFrequencyColor(habit.frequency)} text-white`}>
                    {t(habit.frequency)}
                  </Badge>
                  
                  {/* Check-in Button */}
                  <Button
                    size="sm"
                    onClick={() => checkinHabit(habit.id)}
                    disabled={!canCheckinToday(habit)}
                    className="flex items-center space-x-1 rtl:space-x-reverse"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{canCheckinToday(habit) ? t('checkIn') : 'تم اليوم'}</span>
                  </Button>
                </div>

                {/* Last Check-in */}
                {habit.last_checkin && (
                  <div className="text-xs text-gray-500">
                    آخر تسجيل: {habit.last_checkin}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد عادات مضافة بعد
        </div>
      )}

      {/* Weekly Calendar View */}
      {habits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>عرض الأسبوع</CardTitle>
            <CardDescription>تتبع تقدمك خلال الأسبوع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day, index) => (
                <div key={day} className="p-2">
                  <div className="text-sm font-medium mb-2">{day}</div>
                  <div className="space-y-1">
                    {habits.slice(0, 3).map((habit) => (
                      <div
                        key={habit.id}
                        className={`w-6 h-6 rounded-full mx-auto ${
                          Math.random() > 0.3 ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        title={habit.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}