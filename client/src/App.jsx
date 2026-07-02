import React, { useState, useEffect, useRef } from 'react'
import { Folder, Play, Plus, Check, AlertTriangle, Layers, RefreshCw, ChevronDown, ChevronUp, X, Edit2, Trash2, Ban, SkipForward, Sparkles, Settings, User, Locate, ChevronsUpDown, ChevronsDownUp, BarChart2 } from 'lucide-react'
import { useResizer } from './hooks/useResizer'

import { apiFetch, initSessionAndRedirect, getAccessToken, clearSession, exchangeCodeForToken, generateCodeVerifier, generateCodeChallenge } from './api/authUtils'

// Новые модульные компоненты среды ProTEST IDE
import { IdeLayout } from './components/IdeLayout'
import { ProjectExplorer } from './components/ProjectExplorer'
import { RunListSidebar } from './components/RunListSidebar'
import { CaseEditor } from './components/CaseEditor'
import { RunWorkspace } from './components/RunWorkspace'
import { AiAssistant } from './components/AiAssistant'
import { BottomConsole } from './components/BottomConsole'
import { StatisticsView } from './components/StatisticsView'
import { ProtestLogo } from './components/Common'
import { ProjectsDashboard } from './components/ProjectsDashboard'

export default function App() {
  const [activeTab, setActiveTab] = useState('projects')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)




  // Данные репозитория
  const [localSuites, setLocalSuites] = useState([])
  const [selectedSuite, setSelectedSuite] = useState('Авторизация')
  const [newSuiteNameInput, setNewSuiteNameInput] = useState('')
  const [showNewSuiteInput, setShowNewSuiteInput] = useState(false)
  const [cases, setCases] = useState([])

  // Состояние открытых вкладок тест-кейсов
  const [caseActiveTab, setCaseActiveTab] = useState('new'); // 'new' или case.id
  const [openCaseTabs, setOpenCaseTabs] = useState([]); // [{id, title}]

  const openCaseTab = (tc) => {
    if (!openCaseTabs.find(t => t.id === tc.id)) {
      setOpenCaseTabs(prev => [...prev, { id: tc.id, title: tc.title }]);
    }
    setCaseActiveTab(tc.id);
    handleStartEditCase(tc);
  };

  const closeCaseTab = (tabId, e) => {
    e.stopPropagation();
    setOpenCaseTabs(prev => prev.filter(t => t.id !== tabId));
    if (caseActiveTab === tabId) setCaseActiveTab('new');
  };

  const closeAllCaseTabs = () => {
    setOpenCaseTabs([]);
    setCaseActiveTab('new');
  };

  // Форма тест-кейса (создание)
  const [newCaseTitle, setNewCaseTitle] = useState('')
  const [newCaseSection, setNewCaseSection] = useState('Авторизация')
  const [newCaseFormat, setNewCaseFormat] = useState('steps')
  const [newCaseStepsList, setNewCaseStepsList] = useState([]) // [{ action, expected }]
  const [newStepAction, setNewStepAction] = useState('')
  const [newStepExpected, setNewStepExpected] = useState('')
  const [newCaseChecklistItems, setNewCaseChecklistItems] = useState([]) // [string]
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [newCaseExpectedResult, setNewCaseExpectedResult] = useState('') // ОР для чек-листа
  const [newCaseLayer, setNewCaseLayer] = useState('UI')
  const [newCaseAutomated, setNewCaseAutomated] = useState(false)

  // Форма тест-кейса (редактирование)
  const [editingCaseId, setEditingCaseId] = useState(null)
  const [editingCaseTitle, setEditingCaseTitle] = useState('')
  const [editingCaseSection, setEditingCaseSection] = useState('')
  const [editingCaseFormat, setEditingCaseFormat] = useState('steps')
  const [editingCaseStepsList, setEditingCaseStepsList] = useState([])
  const [editingStepAction, setEditingStepAction] = useState('')
  const [editingStepExpected, setEditingStepExpected] = useState('')
  const [editingCaseChecklistItems, setEditingCaseChecklistItems] = useState([])
  const [editingChecklistItem, setEditingChecklistItem] = useState('')
  const [editingCaseExpectedResult, setEditingCaseExpectedResult] = useState('')
  const [editingCaseLayer, setEditingCaseLayer] = useState('UI')
  const [editingCaseAutomated, setEditingCaseAutomated] = useState(false)
  const [deletingCaseId, setDeletingCaseId] = useState(null)

  // Тест-раны
  const [runs, setRuns] = useState([])
  const [newRunName, setNewRunName] = useState('')
  const [selectedCaseIdsForRun, setSelectedCaseIdsForRun] = useState([])
  const [activeRunCase, setActiveRunCase] = useState(null) // { runId, testcaseId }
  const [isCreatingRun, setIsCreatingRun] = useState(false)
  const [selectedRunId, setSelectedRunId] = useState(null)
  const [runsSidebarWidth, setRunsSidebarWidth] = useState(380)
  const [repoSidebarWidth, setRepoSidebarWidth] = useState(280)
  const [expandedStates, setExpandedStates] = useState({})
  const [rightPanelWidth, setRightPanelWidth] = useState(320)
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(180)
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false)
  const [activityLogs, setActivityLogs] = useState([])

  const addLog = (message) => {
    setActivityLogs(prev => [
      { timestamp: new Date().toISOString(), message },
      ...prev
    ].slice(0, 100));
  };

  const runsSidebarRef = useRef(null)
  const repoSidebarRef = useRef(null)
  const rightPanelRef = useRef(null)

  const rightResizer = useResizer({
    sidebarRef: rightPanelRef,
    type: 'width',
    direction: 'rtl',
    minSize: 280,
    maxSize: 680,
    onResizeEnd: setRightPanelWidth,
  });

  const handleMouseDown = (e, sidebarRef, type) => {

    e.preventDefault();
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const startX = e.clientX;
    const startWidth = sidebar.offsetWidth;

    document.body.classList.add('dragging');

    const doDrag = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = startWidth + deltaX;

      let finalWidth = newWidth;
      if (type === 'runs') {
        finalWidth = Math.max(150, Math.min(1000, newWidth));
      } else {
        finalWidth = Math.max(150, Math.min(800, newWidth));
      }

      sidebar.style.width = `${finalWidth}px`;
    };

    const stopDrag = () => {
      document.body.classList.remove('dragging');
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);

      const finalWidth = sidebar.offsetWidth;
      if (type === 'runs') {
        setRunsSidebarWidth(finalWidth);
      } else {
        setRepoSidebarWidth(finalWidth);
      }
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const [notification, setNotification] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // OIDC авторизация и загрузка
  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (window.location.pathname === '/authorized' && code) {
        try {
          await exchangeCodeForToken(code);
          window.history.replaceState({}, document.title, '/');
        } catch (err) {
          console.error('Ошибка авторизации:', err);
          showNotification('Ошибка авторизации. Перенаправление...');
          setTimeout(() => {
            clearSession();
            initSessionAndRedirect();
          }, 2000);
          return;
        }
      }

      const token = getAccessToken();
      if (!token) {
        initSessionAndRedirect();
      } else {
        setLoadingAuth(false);
        // Сначала загружаем проекты, затем кейсы для ВСЕХ проектов параллельно
        const loadedProjects = await fetchProjects();
        await fetchAllCases(loadedProjects);
        fetchRuns();
      }
    };

    handleAuth();
  }, []);

  // Загружает проекты и возвращает их (Promise)
  const fetchProjects = () => {
    return apiFetch('/projects')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Not an array');
        setProjects(data);
        if (data.length > 0) setSelectedProjectId(data[0].id);
        return data;
      })
      .catch(() => {
        const mockProj = [
          { id: '11111111-1111-1111-1111-111111111111', name: 'ProTEST Core', description: 'Тестирование основного функционала платформы ProTEST.' },
          { id: '22222222-2222-2222-2222-222222222222', name: 'Billing Service', description: 'Тестирование модуля выставления счетов и платежей.' }
        ];
        setProjects(mockProj);
        setSelectedProjectId(mockProj[0].id);
        return mockProj;
      });
  };

  // Загружает кейсы сразу для ВСЕХ проектов параллельно и мёрджит в один стейт
  const fetchAllCases = async (projectList) => {
    if (!Array.isArray(projectList) || projectList.length === 0) return;
    const mockCasesFallback = [
      { id: 'c1', projectId: '11111111-1111-1111-1111-111111111111', section: 'Авторизация', title: 'Успешный вход в систему', steps: [{ action: 'Открыть /login', expected: '' }, { action: 'Ввести креды', expected: '' }, { action: 'Войти', expected: 'Дашборд открыт' }], expectedResult: 'Дашборд открыт', layer: 'UI', isAutomated: true },
      { id: 'c2', projectId: '11111111-1111-1111-1111-111111111111', section: 'Авторизация', title: 'Валидация токена API', steps: [{ action: 'Отправить POST /login', expected: '' }, { action: 'Проверить JWT', expected: '200 OK + Token' }], expectedResult: '200 OK + Token', layer: 'API', isAutomated: true },
      { id: 'c3', projectId: '22222222-2222-2222-2222-222222222222', section: 'Платежи', title: 'Создание счета на оплату', steps: [{ action: 'Открыть форму выставления счета', expected: '' }, { action: 'Заполнить сумму и нажать Создать', expected: 'Счет успешно сохранен в БД и отображен в списке' }], expectedResult: 'Счет успешно сохранен в БД и отображен в списке', layer: 'E2E', isAutomated: false }
    ];
    try {
      const results = await Promise.all(
        projectList.map(p =>
          apiFetch(`/testcases?project_id=${p.id}`)
            .then(r => r.json())
            .then(d => Array.isArray(d) ? d : [])
            .catch(() => [])
        )
      );
      const merged = results.flat();
      if (merged.length === 0) {
        setCases(mockCasesFallback);
        addLog('Загружен локальный репозиторий тест-кейсов (Offline)');
      } else {
        setCases(merged);
        addLog(`Загружено ${merged.length} тест-кейсов из ${projectList.length} проектов`);
      }
    } catch {
      setCases(mockCasesFallback);
      addLog('Загружен локальный репозиторий тест-кейсов (Offline)');
    }
  };

  // Загружает кейсы для конкретного проекта и МЁРДЖИТ в общий стейт (не заменяет все!)
  const fetchCases = (projectId) => {
    const pid = projectId || selectedProjectId;
    if (!pid) return;
    apiFetch(`/testcases?project_id=${pid}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Not an array');
        // Заменяем кейсы только этого проекта, остальные сохраняем
        setCases(prev => [
          ...(Array.isArray(prev) ? prev.filter(c => c.projectId !== pid) : []),
          ...data
        ]);
        addLog(`Обновлены кейсы проекта (${data.length} шт.)`);
      })
      .catch(() => {
        // Offline: ничего не перезаписываем, данные уже есть из fetchAllCases
        addLog('Не удалось обновить кейсы (Offline).');
      });
  };

  useEffect(() => {
    if (selectedProjectId) {
      setSelectedRunId(null);
      setActiveRunCase(null);
      fetchCases(selectedProjectId);  // мёрджит кейсы этого проекта
      fetchRuns();
    }
  }, [selectedProjectId]);

  const fetchRuns = () => {
    if (!selectedProjectId) return;
    apiFetch(`/runs?project_id=${selectedProjectId}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Runs response is not an array');
        setRuns(data)
        addLog(`Успешно загружены тест-раны из БД (${data.length} шт.)`)
        if (data.length > 0) {
          const sorted = [...data].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          setSelectedRunId(sorted[0].id);
        }
      })
      .catch(() => {
        const defaultMock = [
          {
            id: 'r1',
            projectId: selectedProjectId,
            name: 'Smoke Test Release 1.4',
            title: 'Smoke Test Release 1.4',
            status: 'COMPLETED',
            date: '2026-06-23',
            passedCount: 2,
            failedCount: 1,
            totalCount: 3,
            results: [
              { testcaseId: 'c1', testcaseTitle: 'Успешный вход в систему', status: 'PASSED' },
              { testcaseId: 'c2', testcaseTitle: 'Валидация токена API', status: 'PASSED' },
              { testcaseId: 'c3', testcaseTitle: 'Добавление музея', status: 'FAILED' }
            ]
          },
          {
            id: 'r2',
            projectId: selectedProjectId,
            name: 'Nightly Regression',
            title: 'Nightly Regression',
            status: 'NEW',
            date: '2026-06-23',
            passedCount: 0,
            failedCount: 0,
            totalCount: 2,
            results: [
              { testcaseId: 'c1', testcaseTitle: 'Успешный вход в систему', status: 'UNTESTED' },
              { testcaseId: 'c2', testcaseTitle: 'Валидация токена API', status: 'UNTESTED' }
            ]
          }
        ];
        setRuns(defaultMock);
        setSelectedRunId('r2');
        addLog('Загружен локальный список тест-ранов (Offline)');
      })
  }

  const handleUpdateRunResult = (runId, testcaseId, status) => {
    apiFetch(`/runs/${runId}/results/${testcaseId}`, {
      method: 'PUT',
      body: { status }
    })
      .then(res => res.json())
      .then(() => {
        fetchRuns();
        showNotification('Статус тест-кейса успешно обновлен!');
        addLog(`Статус тест-кейса #${testcaseId} изменен на ${status}`);
      })
      .catch(() => {
        setRuns(runs.map(r => {
          if (r.id === runId && Array.isArray(r.results)) {
            const updatedResults = r.results.map(res => res.testcaseId === testcaseId ? { ...res, status } : res);
            const passed = updatedResults.filter(res => res.status === 'PASSED').length;
            const failed = updatedResults.filter(res => res.status === 'FAILED').length;
            const completed = updatedResults.every(res => res.status !== 'UNTESTED');
            return {
              ...r,
              results: updatedResults,
              passedCount: passed,
              failedCount: failed,
              status: completed ? 'COMPLETED' : 'IN_PROGRESS'
            };
          }
          return r;
        }));
        showNotification('Статус обновлен (Offline Mode)');
        addLog(`Статус тест-кейса #${testcaseId} изменен на ${status} (Offline)`);
      });
  };

  const handleUpdateStatusAndNext = (run, testcaseId, status) => {
    // 1. Вызываем обновление статуса
    handleUpdateRunResult(run.id, testcaseId, status);

    // 2. Локально обновляем результаты в стейте, чтобы мгновенно увидеть изменения до окончания fetchRuns
    setRuns(prevRuns => prevRuns.map(r => {
      if (r.id === run.id && Array.isArray(r.results)) {
        const updatedResults = r.results.map(res => res.testcaseId === testcaseId ? { ...res, status } : res);
        return { ...r, results: updatedResults };
      }
      return r;
    }));

    // 3. Переходим к следующему Untested тест-кейсу
    const sortedResults = [...run.results].sort((a, b) => (a.testcaseTitle || '').localeCompare(b.testcaseTitle || ''));
    const currentIndex = sortedResults.findIndex(r => r.testcaseId === testcaseId);

    let nextCase = sortedResults.slice(currentIndex + 1).find(r => r.status === 'UNTESTED');
    if (!nextCase) {
      nextCase = sortedResults.slice(0, currentIndex).find(r => r.status === 'UNTESTED');
    }

    if (nextCase) {
      setActiveRunCase({ runId: run.id, testcaseId: nextCase.testcaseId });
    } else {
      setActiveRunCase(null);
    }
  };

  // Управление шагами (создание)
  const handleAddNewStep = (e) => {
    e?.preventDefault();
    if (!newStepAction.trim()) return;
    setNewCaseStepsList([...newCaseStepsList, { action: newStepAction.trim(), expected: newStepExpected.trim() }]);
    setNewStepAction('');
    setNewStepExpected('');
    const actionInput = document.getElementById('new-step-action-input');
    if (actionInput) actionInput.focus();
  };

  const handleAddChecklistItem = (e) => {
    e?.preventDefault();
    if (!newChecklistItem.trim()) return;
    setNewCaseChecklistItems([...newCaseChecklistItems, newChecklistItem.trim()]);
    setNewChecklistItem('');
    const checklistInput = document.getElementById('new-checklist-item-input');
    if (checklistInput) checklistInput.focus();
  };

  // Управление шагами (редактирование)
  const handleAddEditingStep = (e) => {
    e?.preventDefault();
    if (!editingStepAction.trim()) return;
    setEditingCaseStepsList([...editingCaseStepsList, { action: editingStepAction.trim(), expected: editingStepExpected.trim() }]);
    setEditingStepAction('');
    setEditingStepExpected('');
    const actionInput = document.getElementById('edit-step-action-input');
    if (actionInput) actionInput.focus();
  };

  const handleAddEditingChecklistItem = (e) => {
    e?.preventDefault();
    if (!editingChecklistItem.trim()) return;
    setEditingCaseChecklistItems([...editingCaseChecklistItems, editingChecklistItem.trim()]);
    setEditingChecklistItem('');
    const checklistInput = document.getElementById('edit-checklist-item-input');
    if (checklistInput) checklistInput.focus();
  };

  const handleCreateCase = (e) => {
    e?.preventDefault()
    if (!newCaseTitle.trim()) return

    let stepsToSend = [];
    if (newCaseFormat === 'steps') {
      stepsToSend = newCaseStepsList.filter(s => s.action.trim() !== '');
    } else {
      stepsToSend = newCaseChecklistItems.map(item => ({ action: item, expected: '' }));
    }

    const newCase = {
      projectId: selectedProjectId,
      section: newCaseSection || 'Авторизация',
      title: newCaseTitle,
      steps: stepsToSend,
      expectedResult: newCaseFormat === 'checklist' ? newCaseExpectedResult : '',
      layer: newCaseLayer,
      isAutomated: newCaseAutomated
    }

    apiFetch('/testcases', {
      method: 'POST',
      body: newCase
    })
      .then(res => res.json())
      .then(data => {
        setCases([...cases, data])
        resetCaseForm()
        showNotification('Тест-кейс успешно создан!')
        addLog(`Создан тест-кейс: "${data.title}" (секция: "${data.section}")`);
      })
      .catch(() => {
        const offlineCase = { id: Math.random().toString(), ...newCase }
        setCases([...cases, offlineCase])
        resetCaseForm()
        showNotification('Тест-кейс создан (Offline Mode)')
        addLog(`Создан тест-кейс: "${offlineCase.title}" (Offline Mode)`);
      })
  }

  const resetCaseForm = () => {
    setNewCaseTitle('')
    setNewCaseStepsList([])
    setNewStepAction('')
    setNewStepExpected('')
    setNewCaseChecklistItems([])
    setNewChecklistItem('')
    setNewCaseExpectedResult('')
    setNewCaseLayer('UI')
    setNewCaseAutomated(false)
  }

  const handleStartEditCase = (tc) => {
    setEditingCaseId(tc.id);
    setEditingCaseTitle(tc.title);
    setEditingCaseSection(tc.section || tc.preconditions || 'Авторизация');
    setEditingCaseLayer(tc.layer || 'UI');
    setEditingCaseAutomated(tc.isAutomated || false);

    const hasStepsWithExpected = Array.isArray(tc.steps) && tc.steps.some(s => s.expected && s.expected.trim() !== '');
    if (hasStepsWithExpected || (Array.isArray(tc.steps) && tc.steps.length > 0 && !tc.expectedResult)) {
      setEditingCaseFormat('steps');
      setEditingCaseStepsList(tc.steps || []);
      setEditingCaseChecklistItems([]);
      setEditingCaseExpectedResult('');
    } else {
      setEditingCaseFormat('checklist');
      setEditingCaseChecklistItems(Array.isArray(tc.steps) ? tc.steps.map(s => s.action) : []);
      setEditingCaseExpectedResult(tc.expectedResult || '');
      setEditingCaseStepsList([]);
    }
  };

  const handleUpdateCase = (e, id) => {
    e.preventDefault();
    if (!editingCaseTitle.trim()) return;

    let stepsToSend = [];
    if (editingCaseFormat === 'steps') {
      stepsToSend = editingCaseStepsList.filter(s => s.action.trim() !== '');
    } else {
      stepsToSend = editingCaseChecklistItems.map(item => ({ action: item, expected: '' }));
    }

    const updatedCase = {
      projectId: selectedProjectId,
      section: editingCaseSection || 'Авторизация',
      title: editingCaseTitle,
      steps: stepsToSend,
      expectedResult: editingCaseFormat === 'checklist' ? editingCaseExpectedResult : '',
      layer: editingCaseLayer,
      isAutomated: editingCaseAutomated
    };

    apiFetch(`/testcases/${id}`, {
      method: 'PUT',
      body: updatedCase
    })
      .then(res => res.json())
      .then(data => {
        setCases(cases.map(c => c.id === id ? data : c));
        setEditingCaseId(null);
        showNotification('Тест-кейс успешно обновлен!');
        addLog(`Обновлен тест-кейс: "${data.title}"`);
      })
      .catch(() => {
        setCases(cases.map(c => c.id === id ? { ...c, ...updatedCase } : c));
        setEditingCaseId(null);
        showNotification('Тест-кейс обновлен (Offline Mode)');
        addLog(`Обновлен тест-кейс: "${updatedCase.title}" (Offline Mode)`);
      });
  };

  const handleDeleteCase = (id) => {
    apiFetch(`/testcases/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setCases(cases.filter(c => c.id !== id));
        setDeletingCaseId(null);
        showNotification('Тест-кейс успешно удален');
        addLog(`Удален тест-кейс #${id}`);
      })
      .catch(() => {
        setCases(cases.filter(c => c.id !== id));
        setDeletingCaseId(null);
        showNotification('Тест-кейс удален (Offline Mode)');
        addLog(`Удален тест-кейс #${id} (Offline Mode)`);
      });
  };

  const handleCreateRun = (e) => {
    e.preventDefault()
    if (!newRunName.trim()) return
    setIsCreatingRun(true)
    const startTime = Date.now();

    const newRun = {
      projectId: selectedProjectId,
      title: newRunName,
      testcaseIds: selectedCaseIdsForRun
    }

    const finalize = (successCallback) => {
      const elapsedTime = Date.now() - startTime;
      const minDelay = 800; // Минимальная задержка 800 мс для плавной анимации
      const remainingTime = Math.max(0, minDelay - elapsedTime);

      setTimeout(() => {
        successCallback();
        setIsCreatingRun(false);
      }, remainingTime);
    };

    apiFetch('/runs', {
      method: 'POST',
      body: newRun
    })
      .then(res => res.json())
      .then(data => {
        finalize(() => {
          setRuns([...runs, data])
          setNewRunName('')
          setSelectedCaseIdsForRun([])
          showNotification('Тест-ран успешно запущен!')
          addLog(`Запущен новый тест-прогон: "${data.name || data.title}"`);
        });
      })
      .catch(() => {
        finalize(() => {
          const offlineRun = {
            id: Math.random().toString(),
            projectId: selectedProjectId,
            name: newRunName,
            title: newRunName,
            status: 'NEW',
            date: new Date().toISOString().split('T')[0],
            passedCount: 0,
            failedCount: 0,
            totalCount: selectedCaseIdsForRun.length || 1,
            results: selectedCaseIdsForRun.map(id => {
              const tc = cases.find(c => c.id === id);
              return {
                testcaseId: id,
                testcaseTitle: tc ? tc.title : `Кейс #${id}`,
                status: 'UNTESTED'
              };
            })
          }
          setRuns([...runs, offlineRun])
          setNewRunName('')
          setSelectedCaseIdsForRun([])
          showNotification('Тест-ран запущен (Offline Mode)')
          addLog(`Запущен новый тест-прогон: "${offlineRun.name}" (Offline Mode)`);
        });
      })
  }



  const handleExecuteTest = (runId, status) => {
    setRuns(runs.map(r => {
      if (r.id === runId) {
        const passed = status === 'PASSED' ? r.passedCount + 1 : r.passedCount
        const failed = status === 'FAILED' ? r.failedCount + 1 : r.failedCount
        const newStatus = (passed + failed >= r.totalCount) ? 'COMPLETED' : 'IN_PROGRESS'
        addLog(`Имитация выполнения прогона: тест-кейс отмечен как ${status}`);
        return { ...r, passedCount: passed, failedCount: failed, status: newStatus }
      }
      return r
    }))
  }

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleLogout = () => {
    clearSession();
    window.location.replace('http://localhost:9000/logout');
  };

  const currentProject = Array.isArray(projects) ? projects.find(p => p.id === selectedProjectId) : null
  const projectCases = Array.isArray(cases) ? cases.filter(c => c.projectId === selectedProjectId) : []
  const allSuites = Array.from(new Set([
    'Авторизация',
    ...localSuites,
    ...projectCases.map(c => c.section || c.preconditions || 'Авторизация')
  ].map(s => typeof s === 'string' ? s.trim() : s)))
  const filteredCases = projectCases.filter(c => (c.section || c.preconditions || 'Авторизация') === selectedSuite)
  const filteredRuns = Array.isArray(runs)
    ? [...runs]
      .filter(r => r.projectId === selectedProjectId)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    : []
  const selectedRun = Array.isArray(runs) ? runs.find(r => r.id === selectedRunId) : null

  const handleLocateActiveCase = () => {
    if (!caseActiveTab) return;
    const activeCase = projectCases.find(c => c.id === caseActiveTab);
    if (!activeCase) return;
    const section = activeCase.section || 'Авторизация';
    const parts = section.split('/');
    const next = { ...expandedStates };
    let currentPath = '';
    parts.forEach(part => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      next[currentPath] = true;
    });
    setExpandedStates(next);
    setSelectedSuite(section);
    setNewCaseSection(section);
  };

  const handleExpandAll = () => {
    setExpandedStates({}); // All open by default
  };

  const handleCollapseAll = () => {
    const next = {};
    allSuites.forEach(suite => {
      let parts = suite.split('/');
      let currentPath = '';
      parts.forEach(part => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        next[currentPath] = false;
      });
    });
    setExpandedStates(next);
  };

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', gap: '16px' }}>
        <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        <span style={{ fontSize: '18px', fontWeight: 500 }}>Авторизация ProTEST...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="h-[60px] flex-shrink-0 flex items-center justify-between px-[40px] border-b border-[#30363d] bg-[#161b22]/75 backdrop-blur-[12px] sticky top-0 z-[100]">

        <a href="#" className="flex items-center no-underline mr-12">
          <ProtestLogo />
        </a>
        <nav className="flex gap-4" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <span
            className={`no-underline font-medium text-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-[6px] border ${activeTab === 'projects'
                ? 'text-[#c9d1d9] bg-[#21262d] border-[#30363d]'
                : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9] hover:bg-[#21262d]'
              }`}
            onClick={() => setActiveTab('projects')}
          >
            <Layers size={18} /> Проекты
          </span>
          <span
            className={`no-underline font-medium text-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-[6px] border ${activeTab === 'repo'
                ? 'text-[#c9d1d9] bg-[#21262d] border-[#30363d]'
                : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9] hover:bg-[#21262d]'
              }`}
            onClick={() => {
              setActiveTab('repo')
              if (!selectedSuite) {
                const projCases = Array.isArray(cases) ? cases.filter(c => c.projectId === selectedProjectId) : []
                const firstSuite = projCases[0]?.section || projCases[0]?.preconditions || 'Авторизация'
                setSelectedSuite(firstSuite)
              }
            }}
          >
            <Folder size={18} /> Репозиторий
          </span>
          <span
            className={`no-underline font-medium text-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-[6px] border ${activeTab === 'runs'
                ? 'text-[#c9d1d9] bg-[#21262d] border-[#30363d]'
                : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9] hover:bg-[#21262d]'
              }`}
            onClick={() => setActiveTab('runs')}
          >
            <Play size={18} /> Тест-раны
          </span>
          <span
            className={`no-underline font-medium text-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-[6px] border ${activeTab === 'stats'
                ? 'text-[#c9d1d9] bg-[#21262d] border-[#30363d]'
                : 'text-[#8b949e] border-transparent hover:text-[#c9d1d9] hover:bg-[#21262d]'
              }`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart2 size={18} /> Статистика
          </span>
        </nav>
      </header>

      {/* Main Flex Wrapper */}
      <div className="flex flex-grow overflow-hidden relative">

        {/* Main Content Area */}
        <main className={`flex-grow flex flex-col min-w-0 pl-5 pt-5 pb-5 overflow-hidden ${isRightPanelOpen ? 'pr-[6px]' : 'pr-5'}`}>



          {/* Projects Dashboard */}
          {activeTab === 'projects' && (
            <ProjectsDashboard
              projects={projects}
              setProjects={setProjects}
              cases={cases}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              setActiveTab={setActiveTab}
              setSelectedSuite={setSelectedSuite}
              showNotification={showNotification}
            />
          )}

          {/* Test Case Repository */}
          {activeTab === 'repo' && (
            <IdeLayout
              className="flex-grow"
              sidebarTitle="СТРУКТУРА"
              sidebarHeaderActions={
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const nextState = !showNewSuiteInput;
                      setShowNewSuiteInput(nextState);
                      if (nextState && selectedSuite) {
                        setNewSuiteNameInput(`${selectedSuite}/`);
                      } else {
                        setNewSuiteNameInput('');
                      }
                    }}
                    className="text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-all duration-150 flex items-center justify-center w-5 h-5 rounded border border-transparent cursor-pointer"
                    title="Создать папку (используйте / для вложенности)"
                  >
                    <Plus size={13} />
                  </button>
                  <button
                    onClick={handleLocateActiveCase}
                    className="text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-all duration-150 flex items-center justify-center w-5 h-5 rounded border border-transparent cursor-pointer"
                    title="Сфокусироваться на текущем тест-кейсе"
                  >
                    <Locate size={13} />
                  </button>
                  <button
                    onClick={handleExpandAll}
                    className="text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-all duration-150 flex items-center justify-center w-5 h-5 rounded border border-transparent cursor-pointer"
                    title="Развернуть все"
                  >
                    <ChevronsUpDown size={13} />
                  </button>
                  <button
                    onClick={handleCollapseAll}
                    className="text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-all duration-150 flex items-center justify-center w-5 h-5 rounded border border-transparent cursor-pointer"
                    title="Свернуть все"
                  >
                    <ChevronsDownUp size={13} />
                  </button>
                </div>
              }
              sidebar={
                <ProjectExplorer
                  allSuites={allSuites}
                  selectedSuite={selectedSuite}
                  setSelectedSuite={setSelectedSuite}
                  setNewCaseSection={setNewCaseSection}
                  showNewSuiteInput={showNewSuiteInput}
                  setShowNewSuiteInput={setShowNewSuiteInput}
                  newSuiteNameInput={newSuiteNameInput}
                  setNewSuiteNameInput={setNewSuiteNameInput}
                  localSuites={localSuites}
                  setLocalSuites={setLocalSuites}
                  cases={projectCases}
                  activeCaseId={caseActiveTab}
                  openCaseTab={openCaseTab}
                  expandedStates={expandedStates}
                  setExpandedStates={setExpandedStates}
                />
              }
              sidebarWidth={repoSidebarWidth}
              setSidebarWidth={setRepoSidebarWidth}
              bottomPanel={
                <BottomConsole
                  activityLogs={activityLogs}
                  cases={cases}
                  onClearLogs={() => setActivityLogs([])}
                />
              }
              bottomPanelHeight={bottomPanelHeight}
              setBottomPanelHeight={setBottomPanelHeight}
              isBottomPanelOpen={isBottomPanelOpen}
              setIsBottomPanelOpen={setIsBottomPanelOpen}
            >

              <CaseEditor
                projectCases={projectCases}
                filteredCases={filteredCases}
                currentProject={currentProject}
                allSuites={allSuites}
                caseActiveTab={caseActiveTab}
                setCaseActiveTab={setCaseActiveTab}
                openCaseTabs={openCaseTabs}
                openCaseTab={openCaseTab}
                closeCaseTab={closeCaseTab}
                closeAllCaseTabs={closeAllCaseTabs}
                handleCreateCase={handleCreateCase}
                handleUpdateCase={handleUpdateCase}
                handleDeleteCase={handleDeleteCase}
                newCaseTitle={newCaseTitle}
                setNewCaseTitle={setNewCaseTitle}
                newCaseSection={newCaseSection}
                setNewCaseSection={setNewCaseSection}
                newCaseFormat={newCaseFormat}
                setNewCaseFormat={setNewCaseFormat}
                newCaseStepsList={newCaseStepsList}
                setNewCaseStepsList={setNewCaseStepsList}
                newStepAction={newStepAction}
                setNewStepAction={setNewStepAction}
                newStepExpected={newStepExpected}
                setNewStepExpected={setNewStepExpected}
                handleAddNewStep={handleAddNewStep}
                newCaseChecklistItems={newCaseChecklistItems}
                setNewCaseChecklistItems={setNewCaseChecklistItems}
                newChecklistItem={newChecklistItem}
                setNewChecklistItem={setNewChecklistItem}
                handleAddChecklistItem={handleAddChecklistItem}
                newCaseExpectedResult={newCaseExpectedResult}
                setNewCaseExpectedResult={setNewCaseExpectedResult}
                newCaseLayer={newCaseLayer}
                setNewCaseLayer={setNewCaseLayer}
                newCaseAutomated={newCaseAutomated}
                setNewCaseAutomated={setNewCaseAutomated}
                editingCaseId={editingCaseId}
                setEditingCaseId={setEditingCaseId}
                editingCaseTitle={editingCaseTitle}
                setEditingCaseTitle={setEditingCaseTitle}
                editingCaseSection={editingCaseSection}
                setEditingCaseSection={setEditingCaseSection}
                editingCaseFormat={editingCaseFormat}
                setEditingCaseFormat={setEditingCaseFormat}
                editingCaseStepsList={editingCaseStepsList}
                setEditingCaseStepsList={setEditingCaseStepsList}
                editingStepAction={editingStepAction}
                setEditingStepAction={setEditingStepAction}
                editingStepExpected={editingStepExpected}
                setEditingStepExpected={setEditingStepExpected}
                handleAddEditingStep={handleAddEditingStep}
                editingCaseChecklistItems={editingCaseChecklistItems}
                setEditingCaseChecklistItems={setEditingCaseChecklistItems}
                editingChecklistItem={editingChecklistItem}
                setEditingChecklistItem={setEditingChecklistItem}
                handleAddEditingChecklistItem={handleAddEditingChecklistItem}
                editingCaseExpectedResult={editingCaseExpectedResult}
                setEditingCaseExpectedResult={setEditingCaseExpectedResult}
                editingCaseLayer={editingCaseLayer}
                setEditingCaseLayer={setEditingCaseLayer}
                editingCaseAutomated={editingCaseAutomated}
                setEditingCaseAutomated={setEditingCaseAutomated}
                deletingCaseId={deletingCaseId}
                setDeletingCaseId={setDeletingCaseId}
                handleStartEditCase={handleStartEditCase}
              />
            </IdeLayout>
          )}

          {/* Test Runs Tab */}
          {activeTab === 'runs' && (
            <IdeLayout
              className="flex-grow"
              sidebarTitle="ТЕСТ-РАНЫ"
              sidebar={
                <RunListSidebar
                  runs={runs}
                  selectedRunId={selectedRunId}
                  setSelectedRunId={setSelectedRunId}
                  filteredRuns={filteredRuns}
                  newRunName={newRunName}
                  setNewRunName={setNewRunName}
                  selectedCaseIdsForRun={selectedCaseIdsForRun}
                  setSelectedCaseIdsForRun={setSelectedCaseIdsForRun}
                  cases={projectCases}
                  handleCreateRun={handleCreateRun}
                  isCreatingRun={isCreatingRun}
                  setActiveRunCase={setActiveRunCase}
                />
              }
              sidebarWidth={runsSidebarWidth}
              setSidebarWidth={setRunsSidebarWidth}
              bottomPanel={
                <BottomConsole
                  activityLogs={activityLogs}
                  cases={cases}
                  onClearLogs={() => setActivityLogs([])}
                />
              }
              bottomPanelHeight={bottomPanelHeight}
              setBottomPanelHeight={setBottomPanelHeight}
              isBottomPanelOpen={isBottomPanelOpen}
              setIsBottomPanelOpen={setIsBottomPanelOpen}
            >
              <RunWorkspace
                selectedRunId={selectedRunId}
                filteredRuns={filteredRuns}
                cases={cases}
                activeRunCase={activeRunCase}
                setActiveRunCase={setActiveRunCase}
                handleUpdateStatusAndNext={handleUpdateStatusAndNext}
                handleUpdateRunResult={handleUpdateRunResult}
                handleExecuteTest={handleExecuteTest}
              />
            </IdeLayout>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="flex-grow min-h-0 overflow-y-auto rounded-[10px] border border-[#30363d] bg-[#161b22] p-5 w-full flex flex-col gap-5 transition-all duration-250 hover:border-[#0ea5e9]/35 hover:shadow-[0_4px_20px_rgba(14,165,233,0.05)]">
              <StatisticsView
                projects={projects}
                cases={cases}
                runs={runs}
                selectedProjectId={selectedProjectId}
              />
            </div>
          )}

        </main>

        {/* Правая панель с AI (глобальная) */}
        {isRightPanelOpen && (
          <>
            {/* Ресайзер */}
            <div className="resizer-bar" style={{ margin: '20px -6px' }} onMouseDown={rightResizer.onMouseDown} />
            {/* Сама панель */}
            <div
              ref={rightPanelRef}
              style={{ width: `${rightPanelWidth}px` }}
              className="flex flex-col flex-shrink-0 h-full py-5 pl-[6px] pr-5"
            >
              <div className="flex-1 flex flex-col overflow-y-auto rounded-[10px] border border-[#30363d] bg-[#161b22] p-4 transition-colors duration-200 hover:border-[#0ea5e9]/35 hover:shadow-[0_4px_20px_rgba(14,165,233,0.05)]">
                <AiAssistant
                  activeCase={activeTab === 'repo' ? cases.find(c => c.id === editingCaseId) : null}
                  activeRunCase={activeTab === 'runs' ? activeRunCase : null}
                  cases={cases}
                />
              </div>
            </div>
          </>
        )}

        {/* Правый вертикальный тулбар (часть flex-потока) */}
        <div className="flex-shrink-0 bg-transparent border-l border-[#30363d] flex flex-col items-center py-5 gap-2 z-40 px-1.5">
          {/* AI */}

          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            title="AI Ассистент"
            style={{
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: isRightPanelOpen ? 'rgba(88,166,255,0.15)' : 'transparent',
              color: isRightPanelOpen ? '#58a6ff' : '#8b949e',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = isRightPanelOpen ? 'rgba(88,166,255,0.2)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#c9d1d9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = isRightPanelOpen ? 'rgba(88,166,255,0.15)' : 'transparent'; e.currentTarget.style.color = isRightPanelOpen ? '#58a6ff' : '#8b949e'; }}
          >
            <Sparkles size={22} />
          </button>

          <div className="flex-grow" />

          {/* Settings */}
          <button
            title="Настройки"
            style={{
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: 'transparent', color: '#8b949e', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#c9d1d9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e'; }}
          >
            <Settings size={22} />
          </button>

          {/* User Profile */}
          <div className="relative mt-auto">
            <button
              title="Профиль пользователя"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: showProfileMenu ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: showProfileMenu ? '#c9d1d9' : '#8b949e',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!showProfileMenu) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#c9d1d9'; } }}
              onMouseLeave={e => { if (!showProfileMenu) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b949e'; } }}
            >
              <User size={22} />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div
                  className="absolute z-50 bg-[#161b22] border border-[#30363d] rounded-[8px] p-1 shadow-lg min-w-[120px]"
                  style={{ right: '50px', bottom: '10px' }}
                >
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-start gap-2 px-3 py-2 text-sm text-[#f85149] hover:bg-[#f85149]/10 rounded-[4px] border-none cursor-pointer text-left transition-colors font-medium"
                  >
                    Выйти
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>


    </div>
  );
}
