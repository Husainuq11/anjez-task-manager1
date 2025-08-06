import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'

export function TaskManager({ t }) {
  const [tasks, setTasks] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium'
  })

  // Load tasks on component mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      // Use mock data if API fails
      setTasks([
        { id: 1, title: 'مراجعة التقرير الشهري', description: 'مراجعة وتحليل التقرير المالي', due_date: '2025-01-27', priority: 'high', completed: false },
        { id: 2, title: 'اجتماع الفريق', description: 'اجتماع أسبوعي مع الفريق', due_date: '2025-01-26', priority: 'medium', completed: true },
        { id: 3, title: 'تحديث الموقع', description: 'إضافة ميزات جديدة للموقع', due_date: '2025-01-28', priority: 'low', completed: false }
      ])
    }
  }

  const createTask = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      
      if (response.ok) {
        const task = await response.json()
        setTasks([...tasks, task])
        setNewTask({ title: '', description: '', due_date: '', priority: 'medium' })
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      // Fallback: add to local state
      const task = {
        id: Date.now(),
        ...newTask,
        completed: false
      }
      setTasks([...tasks, task])
      setNewTask({ title: '', description: '', due_date: '', priority: 'medium' })
      setIsAddDialogOpen(false)
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(task => task.id === taskId ? updatedTask : task))
      }
    } catch (error) {
      console.error('Error updating task:', error)
      // Fallback: update local state
      setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updates } : task))
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      // Fallback: remove from local state
      setTasks(tasks.filter(task => task.id !== taskId))
    }
  }

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      await updateTask(taskId, { completed: !task.completed })
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    if (filter === 'overdue') {
      const today = new Date().toISOString().split('T')[0]
      return !task.completed && task.due_date && task.due_date < today
    }
    return true
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('tasks')}</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t('addNewTask')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addNewTask')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('taskTitle')}</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">{t('taskDescription')}</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="due_date">{t('dueDate')}</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="priority">{t('priority')}</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">{t('high')}</SelectItem>
                    <SelectItem value="medium">{t('medium')}</SelectItem>
                    <SelectItem value="low">{t('low')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={createTask} disabled={!newTask.title}>
                  {t('save')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 rtl:space-x-reverse">
        {['all', 'pending', 'completed', 'overdue'].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            onClick={() => setFilter(filterType)}
          >
            {t(filterType)}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    {task.due_date && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                        {task.due_date}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Badge variant={getPriorityColor(task.priority)}>
                    {t(task.priority)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTask(task)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {filter === 'all' ? 'لا توجد مهام' : `لا توجد مهام ${t(filter)}`}
        </div>
      )}
      
      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editTask')}</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">{t('taskTitle')}</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">{t('taskDescription')}</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-due_date">{t('dueDate')}</Label>
                <Input
                  id="edit-due_date"
                  type="date"
                  value={editingTask.due_date}
                  onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-priority">{t('priority')}</Label>
                <Select 
                  value={editingTask.priority} 
                  onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">{t('high')}</SelectItem>
                    <SelectItem value="medium">{t('medium')}</SelectItem>
                    <SelectItem value="low">{t('low')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button 
                  onClick={async () => {
                    await updateTask(editingTask.id, {
                      title: editingTask.title,
                      description: editingTask.description,
                      due_date: editingTask.due_date,
                      priority: editingTask.priority
                    })
                    setIsEditDialogOpen(false)
                    setEditingTask(null)
                  }} 
                  disabled={!editingTask.title}
                >
                  {t('save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}