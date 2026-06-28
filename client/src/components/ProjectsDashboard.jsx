import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../api/authUtils';

export function ProjectsDashboard({
  projects,
  setProjects,
  cases,
  selectedProjectId,
  setSelectedProjectId,
  setActiveTab,
  setSelectedSuite,
  showNotification,
}) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [editingProjectDesc, setEditingProjectDesc] = useState('');
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [newProjectError, setNewProjectError] = useState(false);
  const [editingProjectError, setEditingProjectError] = useState(false);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName || !newProjectName.trim()) {
      setNewProjectError(true);
      return;
    }
    setNewProjectError(false);

    const newProject = {
      name: newProjectName,
      description: newProjectDesc
    };

    apiFetch('/projects', {
      method: 'POST',
      body: newProject
    })
      .then(res => res.json())
      .then(data => {
        setProjects([...projects, data]);
        setNewProjectName('');
        setNewProjectDesc('');
        setShowCreateProjectForm(false);
        showNotification('Проект успешно создан!');
      })
      .catch(() => {
        const offlineProj = {
          id: Math.random().toString(),
          name: newProjectName,
          description: newProjectDesc
        };
        setProjects([...projects, offlineProj]);
        setNewProjectName('');
        setNewProjectDesc('');
        setShowCreateProjectForm(false);
        showNotification('Проект создан (Offline Mode)');
      });
  };

  const handleStartEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setEditingProjectName(proj.name);
    setEditingProjectDesc(proj.description || '');
  };

  const handleUpdateProject = (e, id) => {
    e.preventDefault();
    if (!editingProjectName || !editingProjectName.trim()) {
      setEditingProjectError(true);
      return;
    }
    setEditingProjectError(false);

    const updatedData = {
      name: editingProjectName,
      description: editingProjectDesc
    };

    apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body: updatedData
    })
      .then(res => res.json())
      .then(data => {
        setProjects(projects.map(p => p.id === id ? data : p));
        setEditingProjectId(null);
        showNotification('Проект успешно обновлен!');
      })
      .catch(() => {
        setProjects(projects.map(p => p.id === id ? { ...p, name: editingProjectName, description: editingProjectDesc } : p));
        setEditingProjectId(null);
        showNotification('Проект обновлен (Offline Mode)');
      });
  };

  const handleDeleteProject = (id) => {
    apiFetch(`/projects/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setProjects(projects.filter(p => p.id !== id));
        if (selectedProjectId === id) {
          setSelectedProjectId(projects.find(p => p.id !== id)?.id || null);
        }
        setDeletingProjectId(null);
        showNotification('Проект успешно удален');
      })
      .catch(() => {
        setProjects(projects.filter(p => p.id !== id));
        if (selectedProjectId === id) {
          setSelectedProjectId(projects.find(p => p.id !== id)?.id || null);
        }
        setDeletingProjectId(null);
        showNotification('Проект удален (Offline Mode)');
      });
  };

  return (
    <div className="flex-grow overflow-y-auto pb-5 pt-5">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-[20px] font-semibold text-[#f0f6fc]" style={{ border: 'none', margin: 0 }}>Ваши проекты</h1>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 mt-6">
        {projects.map(proj => {
          const isEditing = editingProjectId === proj.id;
          const isDeleting = deletingProjectId === proj.id;
          const projectCaseCount = Array.isArray(cases) ? cases.filter(c => c.projectId === proj.id).length : 0;

          return (
            <div key={proj.id} className="[perspective:1000px] h-[220px]">
              <div
                className="relative w-full h-full"
                style={{
                  transform: isEditing ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Front Side: Отображение проекта (или удаление) */}
                <div className="absolute w-full h-full top-0 left-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                  <div
                    style={{ padding: '20px' }}
                    className={`h-full flex flex-col justify-between rounded-[10px] border bg-[#161b22] transition-all duration-250 cursor-pointer ${
                      selectedProjectId === proj.id ? 'border-[#58a6ff] shadow-[0_4px_20px_rgba(88,166,255,0.08)]' : 'border-[#30363d] hover:border-[#58a6ff] hover:bg-[#21262d]'
                    } ${isDeleting ? 'border-[#f85149] bg-[#f85149]/5' : ''}`}
                    onClick={() => {
                      if (!isEditing && !isDeleting) {
                        setSelectedProjectId(proj.id);
                        setActiveTab('repo');
                        const projCases = Array.isArray(cases) ? cases.filter(c => c.projectId === proj.id) : [];
                        const firstSuite = projCases[0]?.section || projCases[0]?.preconditions || 'Авторизация';
                        setSelectedSuite(firstSuite);
                      }
                    }}
                  >
                    {isDeleting ? (
                      <div onClick={e => e.stopPropagation()} className="flex flex-col gap-3 w-full h-full justify-center items-center">
                        <p className="text-xs font-semibold text-[#f85149] text-center m-0">
                          Удалить проект и все его тест-кейсы?
                        </p>
                        <div className="flex gap-2">
                          <button type="button" className="rounded-lg bg-[#21262d] border border-[#30363d] px-4 py-2 text-xs font-semibold text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] cursor-pointer transition-all h-[32px] flex items-center justify-center" onClick={() => setDeletingProjectId(null)}>Нет</button>
                          <button type="button" className="rounded-lg bg-[#f85149]/10 border border-[#f85149]/30 px-4 py-2 text-xs font-semibold text-[#f85149] hover:bg-[#f85149] hover:text-white hover:border-[#f85149] transition-all cursor-pointer h-[32px] flex items-center justify-center" onClick={() => handleDeleteProject(proj.id)}>Да, удалить</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="relative flex-grow">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-[18px] font-semibold text-[#f0f6fc] m-0 mb-2 leading-snug truncate flex-grow">{proj.name}</h3>
                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                              <button className="text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#30363d] transition-all duration-150 p-1.5 rounded cursor-pointer flex items-center" onClick={() => handleStartEditProject(proj)} title="Редактировать">
                                <Edit2 size={14} />
                              </button>
                              <button className="text-[#f85149] hover:text-[#ff7b72] hover:bg-[#f85149]/10 transition-all duration-150 p-1.5 rounded cursor-pointer flex items-center" onClick={() => setDeletingProjectId(proj.id)} title="Удалить">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p className="text-[13px] text-[#8b949e] m-0 leading-normal line-clamp-2 mt-1">{proj.description}</p>
                        </div>
                        <div className="flex justify-between items-center text-[#8b949e] mt-auto pt-3 border-t border-dashed border-[#30363d] text-xs font-medium w-full">
                          <span>Кейсов: {projectCaseCount}</span>
                          <span className="text-right truncate max-w-[120px]" title={proj.owner || 'Владелец не указан'}>{proj.owner || 'Владелец не указан'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Back Side: Форма редактирования */}
                <div className="absolute w-full h-full top-0 left-0" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                  <div style={{ padding: '20px' }} className="h-full flex flex-col justify-stretch rounded-[10px] border border-[#58a6ff] bg-[#161b22]">
                    <form onSubmit={(e) => handleUpdateProject(e, proj.id)} onClick={e => e.stopPropagation()} className="flex flex-col gap-2.5 w-full h-full justify-between" noValidate>
                      <div>
                        <h3 className="text-sm font-semibold text-[#f0f6fc] m-0 mb-2">Редактирование</h3>
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            className={`rounded-lg border bg-[#0d1117] px-3.5 py-2 text-sm text-[#e6edf3] focus:outline-none transition-all w-full ${
                              editingProjectError 
                                ? 'border-[#f85149] focus:border-[#f85149] focus:ring-2 focus:ring-[#f85149]/15' 
                                : 'border-[#30363d] focus:border-[#58a6ff]'
                            }`}
                            value={editingProjectName} 
                            onChange={e => {
                              setEditingProjectName(e.target.value);
                              if (e.target.value.trim() && editingProjectError) {
                                setEditingProjectError(false);
                              }
                            }} 
                            required 
                          />
                          {editingProjectError && (
                            <div className="text-[11px] text-[#f85149] bg-[#f85149]/8 border border-[#f85149]/25 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 transition-all duration-200">
                              <AlertTriangle size={12} className="flex-shrink-0" />
                              <span>Название проекта обязательно</span>
                            </div>
                          )}
                          <input type="text" className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3.5 py-2 text-sm text-[#e6edf3] focus:border-[#58a6ff] focus:ring-3 focus:ring-[#58a6ff]/15 focus:outline-none transition-all w-full" value={editingProjectDesc} onChange={e => setEditingProjectDesc(e.target.value)} placeholder="Описание" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end mt-auto">
                        <button type="button" className="rounded-lg bg-[#21262d] border border-[#30363d] px-4 py-2 text-xs font-semibold text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] cursor-pointer transition-all h-[32px] flex items-center justify-center" onClick={() => { setEditingProjectId(null); setEditingProjectError(false); }}>Отмена</button>
                        <button type="submit" className="rounded-lg bg-[#2ea44f]/10 border border-[#2ea44f]/30 px-4 py-2 text-xs font-semibold text-[#2ea44f] hover:bg-[#2ea44f] hover:text-white hover:border-[#2ea44f] transition-all cursor-pointer h-[32px] flex items-center justify-center">Сохранить</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="[perspective:1000px] h-[220px]">
          <div
            className="relative w-full h-full"
            style={{ 
              transform: showCreateProjectForm ? 'rotateY(180deg)' : 'rotateY(0deg)', 
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Front Side: Кнопка создания */}
            <div className="absolute w-full h-full top-0 left-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <div
                style={{ padding: '20px' }}
                className="h-full cursor-pointer flex flex-col justify-center items-center rounded-[10px] border border-[#30363d] border-dashed bg-transparent hover:border-[#58a6ff] hover:bg-[#21262d] transition-colors duration-200"
                onClick={() => setShowCreateProjectForm(true)}
              >
                <div className="flex flex-col items-center gap-2 text-[#8b949e]">
                  <Plus size={24} />
                  <span className="text-sm font-semibold">Создать проект</span>
                </div>
              </div>
            </div>

            {/* Back Side: Форма создания */}
            <div className="absolute w-full h-full top-0 left-0" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <div style={{ padding: '20px' }} className="h-full flex flex-col justify-stretch rounded-[10px] border border-[#58a6ff] bg-[#161b22]">
                <form onSubmit={handleCreateProject} onClick={e => e.stopPropagation()} className="flex flex-col gap-2.5 w-full h-full justify-between" noValidate>
                  <div>
                    <h3 className="text-sm font-semibold text-[#f0f6fc] m-0 mb-2">Новый проект</h3>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        className={`rounded-lg border bg-[#0d1117] px-3.5 py-2 text-sm text-[#e6edf3] focus:outline-none transition-all w-full ${
                          newProjectError 
                            ? 'border-[#f85149] focus:border-[#f85149] focus:ring-2 focus:ring-[#f85149]/15' 
                            : 'border-[#30363d] focus:border-[#58a6ff]'
                        }`}
                        placeholder="Название проекта"
                        value={newProjectName}
                        onChange={e => {
                          setNewProjectName(e.target.value);
                          if (e.target.value.trim() && newProjectError) {
                            setNewProjectError(false);
                          }
                        }}
                        required
                      />
                      {newProjectError && (
                        <div className="text-[11px] text-[#f85149] bg-[#f85149]/8 border border-[#f85149]/25 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 transition-all duration-200">
                          <AlertTriangle size={12} className="flex-shrink-0" />
                          <span>Название проекта обязательно</span>
                        </div>
                      )}
                      <input
                        type="text"
                        className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3.5 py-2 text-sm text-[#e6edf3] focus:border-[#58a6ff] focus:ring-3 focus:ring-[#58a6ff]/15 focus:outline-none transition-all w-full"
                        placeholder="Описание"
                        value={newProjectDesc}
                        onChange={e => setNewProjectDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-auto">
                    <button
                      type="button"
                      className="rounded-lg bg-[#21262d] border border-[#30363d] px-4 py-2 text-xs font-semibold text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] cursor-pointer transition-all h-[32px] flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (document.activeElement) {
                          document.activeElement.blur();
                        }
                        setShowCreateProjectForm(false);
                        setNewProjectError(false);
                        setTimeout(() => {
                          setNewProjectName('');
                          setNewProjectDesc('');
                        }, 500);
                      }}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#2ea44f]/10 border border-[#2ea44f]/30 px-4 py-2 text-xs font-semibold text-[#2ea44f] hover:bg-[#2ea44f] hover:text-white hover:border-[#2ea44f] transition-all cursor-pointer h-[32px] flex items-center justify-center"
                    >
                      Создать
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
