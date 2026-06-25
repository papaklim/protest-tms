import React, { useState, useEffect } from 'react'
import { Folder, FileText, Play, Plus, Check, AlertTriangle, Layers, Eye, RefreshCw, BarChart2, Zap, Settings, Bot } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  
  // Данные репозитория
  const [suites, setSuites] = useState(['Авторизация', 'Расходы', 'Профиль', 'Музеи'])
  const [selectedSuite, setSelectedSuite] = useState('Авторизация')
  const [cases, setCases] = useState([])
  
  // Форма кейса
  const [newCaseTitle, setNewCaseTitle] = useState('')
  const [newCaseSteps, setNewCaseSteps] = useState('')
  const [newCaseExpected, setNewCaseExpected] = useState('')
  const [newCaseLayer, setNewCaseLayer] = useState('UI')
  const [newCaseAutomated, setNewCaseAutomated] = useState(false)

  // Тест-раны
  const [runs, setRuns] = useState([])
  const [newRunName, setNewRunName] = useState('')
  const [activeRunId, setActiveRunId] = useState(null)

  const [notification, setNotification] = useState(null)

  // Загрузка
  useEffect(() => {
    fetchProjects()
    fetchCases()
    fetchRuns()
  }, [])

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data)
        if (data.length > 0) setSelectedProjectId(data[0].id)
      })
      .catch(() => {
        // Fallback
        const mockProj = [
          { id: '11111111-1111-1111-1111-111111111111', name: 'Niffler App', description: 'Тестирование финансового приложения Niffler.' },
          { id: '22222222-2222-2222-2222-222222222222', name: 'Rococo App', description: 'Тестирование каталога живописи Rococo.' }
        ]
        setProjects(mockProj)
        setSelectedProjectId(mockProj[0].id)
      })
  }

  const fetchCases = () => {
    fetch('/api/cases?projectId=' + (selectedProjectId || '11111111-1111-1111-1111-111111111111'))
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(() => {
        setCases([
          { id: 'c1', projectId: '11111111-1111-1111-1111-111111111111', section: 'Авторизация', title: 'Успешный вход в систему', steps: '1. Открыть /login\n2. Ввести креды\n3. Войти', expectedResult: 'Дашборд открыт', layer: 'UI', isAutomated: true },
          { id: 'c2', projectId: '11111111-1111-1111-1111-111111111111', section: 'Авторизация', title: 'Валидация токена API', steps: '1. Отправить POST /login\n2. Проверить JWT', expectedResult: '200 OK + Token', layer: 'API', isAutomated: true },
          { id: 'c3', projectId: '22222222-2222-2222-2222-222222222222', section: 'Музеи', title: 'Добавление музея', steps: '1. Форма музея\n2. Сохранить', expectedResult: 'Появился в списке', layer: 'E2E', isAutomated: false }
        ])
      })
  }

  // Обновляем кейсы при смене проекта (для WireMock)
  useEffect(() => {
    if (selectedProjectId) fetchCases();
  }, [selectedProjectId]);

  const fetchRuns = () => {
    fetch('/api/runs')
      .then(res => res.json())
      .then(data => setRuns(data))
      .catch(() => {
        setRuns([
          { id: 'r1', projectId: '11111111-1111-1111-1111-111111111111', name: 'Smoke Test Release 1.4', status: 'COMPLETED', date: '2026-06-23', passedCount: 45, failedCount: 2, totalCount: 47 },
          { id: 'r2', projectId: '11111111-1111-1111-1111-111111111111', name: 'Nightly Regression', status: 'ACTIVE', date: '2026-06-23', passedCount: 120, failedCount: 5, totalCount: 200 }
        ])
      })
  }

  const handleCreateCase = (e) => {
    e.preventDefault()
    if (!newCaseTitle.trim()) return

    const newCase = {
      projectId: selectedProjectId,
      section: selectedSuite,
      title: newCaseTitle,
      steps: newCaseSteps,
      expectedResult: newCaseExpected,
      layer: newCaseLayer,
      isAutomated: newCaseAutomated
    }

    fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCase)
    })
    .then(res => res.json())
    .then(data => {
      setCases([...cases, data])
      resetCaseForm()
      showNotification('Тест-кейс успешно создан! 🧪')
    })
    .catch(() => {
      const offlineCase = { id: Math.random().toString(), ...newCase }
      setCases([...cases, offlineCase])
      resetCaseForm()
      showNotification('Тест-кейс создан (Offline Mode) 🧪')
    })
  }

  const resetCaseForm = () => {
    setNewCaseTitle('')
    setNewCaseSteps('')
    setNewCaseExpected('')
    setNewCaseLayer('UI')
    setNewCaseAutomated(false)
  }

  const handleCreateRun = (e) => {
    e.preventDefault()
    if (!newRunName.trim()) return

    const projectCases = cases.filter(c => c.projectId === selectedProjectId) || []
    const newRun = {
      projectId: selectedProjectId,
      name: newRunName,
      totalCount: Math.max(projectCases.length, 10)
    }

    fetch('/api/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRun)
    })
    .then(res => res.json())
    .then(data => {
      setRuns([...runs, data])
      setNewRunName('')
    })
    .catch(() => {
      const offlineRun = { 
        id: Math.random().toString(), 
        projectId: selectedProjectId, 
        name: newRunName, 
        status: 'ACTIVE', 
        date: '2026-06-23', 
        passedCount: 0, 
        failedCount: 0, 
        totalCount: Math.max(projectCases.length, 10) 
      }
      setRuns([...runs, offlineRun])
      setNewRunName('')
    })
  }

  const handleExecuteTest = (runId, status) => {
    setRuns(runs.map(r => {
      if (r.id === runId) {
        const passed = status === 'PASSED' ? r.passedCount + 1 : r.passedCount
        const failed = status === 'FAILED' ? r.failedCount + 1 : r.failedCount
        const newStatus = (passed + failed >= r.totalCount) ? 'COMPLETED' : 'ACTIVE'
        return { ...r, passedCount: passed, failedCount: failed, status: newStatus }
      }
      return r
    }))
  }

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const currentProject = projects.find(p => p.id === selectedProjectId)
  // Для моков WireMock отключаем жесткую фильтрацию по section, чтобы всегда видеть данные
  const filteredCases = cases.filter(c => c.projectId === selectedProjectId)
  const filteredRuns = runs.filter(r => r.projectId === selectedProjectId)

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <a href="#" className="logo">
          <Zap size={28} color="var(--accent-secondary)" fill="var(--accent-secondary)" /> ProTEST
        </a>
        <nav className="nav-links">
          <span 
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`} 
            onClick={() => setActiveTab('projects')}
          >
            <Layers size={18} /> Дашборд
          </span>
          <span 
            className={`nav-link ${activeTab === 'repo' ? 'active' : ''}`} 
            onClick={() => {
              setActiveTab('repo')
              setSelectedSuite(selectedProjectId === '11111111-1111-1111-1111-111111111111' ? 'Авторизация' : 'Музеи')
            }}
          >
            <Folder size={18} /> Репозиторий
          </span>
          <span 
            className={`nav-link ${activeTab === 'runs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('runs')}
          >
            <Play size={18} /> Тест-раны
          </span>
        </nav>
      </header>

      {/* Main Container */}
      <main className="main-container">
        
        {/* Projects Dashboard */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h1 className="tree-title" style={{ border: 'none', margin: 0 }}>Ваши проекты</h1>
              <button className="btn-primary" onClick={() => fetchProjects()}>
                <RefreshCw size={16} /> Обновить
              </button>
            </div>
            <div className="dashboard-grid">
              {projects.map(proj => (
                <div 
                  key={proj.id} 
                  className={`project-card glass-panel`}
                  style={{ 
                    borderColor: selectedProjectId === proj.id ? 'var(--accent-primary)' : 'var(--panel-border)',
                    boxShadow: selectedProjectId === proj.id ? 'var(--shadow-glow)' : ''
                  }}
                  onClick={() => {
                    setSelectedProjectId(proj.id)
                    setActiveTab('repo')
                    setSelectedSuite(proj.id === '11111111-1111-1111-1111-111111111111' ? 'Авторизация' : 'Музеи')
                  }}
                >
                  <div>
                    <h3 className="project-title">{proj.name}</h3>
                    <p className="project-desc">{proj.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-secondary)' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{proj.isActive ? 'Active' : 'Archived'}</span>
                    <Eye size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Case Repository */}
        {activeTab === 'repo' && (
          <div className="tree-layout">
            {/* Sidebar Folder Tree */}
            <aside className="tree-sidebar glass-panel">
              <h3 className="tree-title">Структура</h3>
              {(selectedProjectId === '11111111-1111-1111-1111-111111111111' ? ['Авторизация', 'Расходы', 'Профиль'] : ['Общее']).map(suite => (
                <div 
                  key={suite} 
                  className={`tree-node ${selectedSuite === suite ? 'active' : ''}`}
                  onClick={() => setSelectedSuite(suite)}
                >
                  <Folder size={18} /> {suite}
                </div>
              ))}
            </aside>

            {/* Cases list & Create form */}
            <div className="cases-content">
              <h2 className="tree-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Репозиторий ({filteredCases.length})</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Проект: <span style={{ color: 'var(--accent-secondary)' }}>{currentProject?.name}</span>
                </span>
              </h2>

              {/* Create Case Form */}
              <form onSubmit={handleCreateCase} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>Создать тест-кейс</h3>
                
                <div className="form-group">
                  <label className="form-label">Название</label>
                  <input type="text" className="form-input" placeholder="Например: Вход с пустыми полями" value={newCaseTitle} onChange={e => setNewCaseTitle(e.target.value)} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Шаги</label>
                    <textarea className="form-input" style={{ height: '90px', resize: 'none' }} placeholder="1. Открыть /login..." value={newCaseSteps} onChange={e => setNewCaseSteps(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ justifyContent: 'space-between' }}>
                    <div className="form-group">
                      <label className="form-label">Ожидаемый результат</label>
                      <input type="text" className="form-input" placeholder="Отобразилась ошибка валидации" value={newCaseExpected} onChange={e => setNewCaseExpected(e.target.value)} />
                    </div>
                    
                    {/* Новые поля: Layer и isAutomated */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
                      <div className="form-group" style={{ width: '45%' }}>
                        <label className="form-label">Layer (Слой)</label>
                        <select className="form-input" value={newCaseLayer} onChange={e => setNewCaseLayer(e.target.value)}>
                          <option value="UI">UI</option>
                          <option value="API">API</option>
                          <option value="E2E">E2E</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ width: '45%' }}>
                        <label className="form-label">Автоматизирован?</label>
                        <div className="switch-container" onClick={() => setNewCaseAutomated(!newCaseAutomated)}>
                          <div className={`switch ${newCaseAutomated ? 'active' : ''}`}>
                            <div className="switch-thumb"></div>
                          </div>
                          <span style={{ fontSize: '14px', color: newCaseAutomated ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: 600 }}>
                            {newCaseAutomated ? 'Да' : 'Нет'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary">
                    <Plus size={18} /> Добавить в репозиторий
                  </button>
                </div>
              </form>

              {/* Test Cases List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredCases.map(tc => (
                  <div key={tc.id} className={`case-card glass-panel layer-${tc.layer?.toLowerCase()}`}>
                    <div className="case-header">
                      <span className="case-title">{tc.title}</span>
                      <div className="tags-container">
                        <span className={`badge layer-${tc.layer?.toLowerCase()}`}>{tc.layer || 'UI'}</span>
                        {tc.isAutomated && (
                          <span className="badge automated" title="Автоматизирован">
                            <Bot size={14} color="var(--accent-secondary)" /> Auto
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="case-body">
                      {tc.steps && <p style={{ whiteSpace: 'pre-line', marginBottom: '8px' }}><strong>Шаги:</strong><br />{tc.steps}</p>}
                      {tc.expectedResult && <p><strong>Ожидаемый результат:</strong> {tc.expectedResult}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Test Runs Tab */}
        {activeTab === 'runs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <form onSubmit={handleCreateRun} className="glass-panel" style={{ padding: '28px', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flexGrow: 1 }}>
                <label className="form-label">Название нового тест-рана</label>
                <input type="text" className="form-input" placeholder="Например: Nightly Smoke Release 1.4" value={newRunName} onChange={e => setNewRunName(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{ height: '46px' }}>
                <Play size={18} fill="currentColor" /> Запустить прогон
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {filteredRuns.map(run => {
                const total = run.totalCount || 1
                const passedPercent = (run.passedCount / total) * 100
                const failedPercent = (run.failedCount / total) * 100
                
                return (
                  <div key={run.id} className="run-card glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{run.name}</h3>
                      <span className="badge" style={{ 
                          background: run.status === 'COMPLETED' ? 'var(--status-green-bg)' : 'rgba(14, 165, 233, 0.15)',
                          color: run.status === 'COMPLETED' ? 'var(--status-green)' : 'var(--accent-secondary)',
                          fontSize: '13px', padding: '6px 12px'
                        }}>
                        {run.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="run-stats-bar">
                        <div className="stats-passed" style={{ width: `${passedPercent}%` }}></div>
                        <div className="stats-failed" style={{ width: `${failedPercent}%` }}></div>
                      </div>
                      <div className="stats-legend">
                        <span>Пройдено: {run.passedCount} / {run.totalCount} кейсов</span>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span style={{ color: 'var(--status-green)' }}>Успешно: {Math.round(passedPercent)}%</span>
                          <span style={{ color: 'var(--status-red)' }}>Упало: {Math.round(failedPercent)}%</span>
                        </div>
                      </div>
                    </div>

                    {run.status === 'ACTIVE' && (
                      <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Ручное выполнение / Имитация:</span>
                        <div className="execution-controls">
                          <button className="btn-status btn-passed" onClick={() => handleExecuteTest(run.id, 'PASSED')}>
                            <Check size={16} /> Отметить PASSED
                          </button>
                          <button className="btn-status btn-failed" onClick={() => handleExecuteTest(run.id, 'FAILED')}>
                            <AlertTriangle size={16} /> Отметить FAILED
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </main>

      {/* Notification */}
      {notification && (
        <div className="match-notification">
          <Check size={20} color="var(--status-green)" /> {notification}
        </div>
      )}
    </div>
  )
}
