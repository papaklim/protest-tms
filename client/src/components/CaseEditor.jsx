import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Edit2, Trash2, ChevronDown, AlertTriangle } from 'lucide-react';
import { AutoTestIcon, ManualTestIcon, CustomSelect } from './Common';

const SectionSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => o.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative w-full" ref={ref}>
      <input
        type="text"
        className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] text-sm font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] w-full"
        placeholder="Введите или выберите папку"
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      <div 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDown size={14} />
      </div>
      
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#161b22] border border-[#30363d] rounded-[6px] shadow-lg max-h-[200px] overflow-y-auto z-50">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <div
                key={opt}
                className="px-3 py-2 text-sm text-[#c9d1d9] cursor-pointer hover:bg-[#21262d] transition-colors"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div 
              className="px-3 py-2 text-sm text-[#8b949e] italic cursor-pointer hover:bg-[#21262d] transition-colors"
              onClick={() => {
                onChange(value);
                setIsOpen(false);
              }}
            >
              Новая папка: {value}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export const CaseEditor = ({
  projectCases,
  filteredCases,
  currentProject,
  allSuites,
  handleCreateCase,
  handleUpdateCase,
  handleDeleteCase,
  newCaseTitle,
  setNewCaseTitle,
  newCaseSection,
  setNewCaseSection,
  newCaseFormat,
  setNewCaseFormat,
  newCaseStepsList,
  setNewCaseStepsList,
  newStepAction,
  setNewStepAction,
  newStepExpected,
  setNewStepExpected,
  handleAddNewStep,
  newCaseChecklistItems,
  setNewCaseChecklistItems,
  newChecklistItem,
  setNewChecklistItem,
  handleAddChecklistItem,
  newCaseExpectedResult,
  setNewCaseExpectedResult,
  newCaseLayer,
  setNewCaseLayer,
  newCaseAutomated,
  setNewCaseAutomated,
  
  editingCaseId,
  setEditingCaseId,
  editingCaseTitle,
  setEditingCaseTitle,
  editingCaseSection,
  setEditingCaseSection,
  editingCaseFormat,
  setEditingCaseFormat,
  editingCaseStepsList,
  setEditingCaseStepsList,
  editingStepAction,
  setEditingStepAction,
  editingStepExpected,
  setEditingStepExpected,
  handleAddEditingStep,
  editingCaseChecklistItems,
  setEditingCaseChecklistItems,
  editingChecklistItem,
  setEditingChecklistItem,
  handleAddEditingChecklistItem,
  editingCaseExpectedResult,
  setEditingCaseExpectedResult,
  editingCaseLayer,
  setEditingCaseLayer,
  editingCaseAutomated,
  setEditingCaseAutomated,
  deletingCaseId,
  setDeletingCaseId,
  handleStartEditCase,
  caseActiveTab,
  setCaseActiveTab,
  openCaseTabs,
  openCaseTab,
  closeCaseTab,
  closeAllCaseTabs
}) => {
  const [newCaseTitleError, setNewCaseTitleError] = React.useState(false);
  const [editingCaseTitleError, setEditingCaseTitleError] = React.useState(false);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCaseTitle || !newCaseTitle.trim()) {
      setNewCaseTitleError(true);
      return;
    }
    setNewCaseTitleError(false);
    handleCreateCase(e);
  };

  const handleUpdateSubmit = (e, id) => {
    e.preventDefault();
    if (!editingCaseTitle || !editingCaseTitle.trim()) {
      setEditingCaseTitleError(true);
      return;
    }
    setEditingCaseTitleError(false);
    handleUpdateCase(e, id);
  };


  return (
    <div className="flex flex-col gap-0 h-full">

      {/* Таб-бар: счётчик справа, стилизован под шапку боковой панели */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#1a1f26] h-[42px] px-4 flex-shrink-0 select-none">
        {/* Вкладки слева и кнопка удаления */}
        <div className="flex items-center gap-2 h-full min-w-0 flex-grow mr-4">
          <div className="flex items-end gap-0 h-full overflow-x-auto min-w-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* + Новый кейс */}
            <button
              type="button"
              onClick={() => setCaseActiveTab('new')}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                height: '100%', padding: '0 14px',
                fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
                background: caseActiveTab === 'new' ? 'rgba(88,166,255,0.10)' : 'transparent',
                color: caseActiveTab === 'new' ? '#58a6ff' : '#8b949e',
                border: 'none',
                borderBottom: caseActiveTab === 'new' ? '2px solid #58a6ff' : '2px solid transparent',
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (caseActiveTab !== 'new') { e.currentTarget.style.color = '#c9d1d9'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
              onMouseLeave={e => { if (caseActiveTab !== 'new') { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.background = 'transparent'; }}}
            >
              <Plus size={11} /> Новый кейс
            </button>

            {/* Открытые кейсы-вкладки */}
            {openCaseTabs.map(tab => {
              const isActive = caseActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCaseActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    height: '100%', padding: '0 12px',
                    fontSize: '12px', fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer', whiteSpace: 'nowrap', maxWidth: '180px',
                    background: isActive ? 'rgba(88,166,255,0.10)' : 'transparent',
                    color: isActive ? '#c9d1d9' : '#8b949e',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #58a6ff' : '2px solid transparent',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#c9d1d9'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.background = 'transparent'; }}}
                >
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.title}</span>
                  <span
                    onClick={(e) => closeCaseTab(tab.id, e)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', borderRadius: '3px', padding: '1px', marginLeft: '2px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#30363d'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <X size={10} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Кнопка "Закрыть все" в виде иконки */}
          {openCaseTabs.length > 0 && (
            <button
              type="button"
              onClick={closeAllCaseTabs}
              className="text-[#8b949e] hover:text-[#f85149] hover:bg-[#21262d] rounded-md transition-all cursor-pointer flex items-center justify-center h-[26px] w-[26px] flex-shrink-0"
              title="Закрыть все вкладки"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Счётчик и проект справа */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            {filteredCases.length} кейсов
          </span>
          <span className="text-[11px] text-[#8b949e]">
            <span className="text-[#58a6ff] font-medium">{currentProject?.name}</span>
          </span>
        </div>

      </div>


      {/* Контентная область под таб-баром */}
      <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-0 min-h-0">
        {caseActiveTab === 'new' && (
          <div className="flex flex-col gap-4">
          <div className="p-5 flex flex-col gap-3 relative bg-[#161b22] border border-[#30363d] rounded-[10px] before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:w-[3px] before:bg-[#30363d] before:rounded-l-[10px]">
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex gap-4">

          <div className="flex flex-col gap-1.5 flex-grow">
            <label className="text-xs font-semibold text-[#8b949e]">Название</label>
            <input
              type="text"
              className={`bg-[#0d1117] border rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] text-sm font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none w-full ${
                newCaseTitleError 
                  ? 'border-[#f85149] focus:border-[#f85149] focus:shadow-[0_0_0_3px_rgba(248,81,73,0.15)]' 
                  : 'border-[#30363d] focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)]'
              }`}
              placeholder="Например: Вход с пустыми полями"
              value={newCaseTitle}
              onChange={e => {
                setNewCaseTitle(e.target.value);
                if (e.target.value.trim() && newCaseTitleError) {
                  setNewCaseTitleError(false);
                }
              }}
              required
            />
            {newCaseTitleError && (
              <div className="text-[11px] text-[#f85149] bg-[#f85149]/8 border border-[#f85149]/25 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 mt-1 transition-all duration-200">
                <AlertTriangle size={12} className="flex-shrink-0" />
                <span>Название тест-кейса обязательно</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 w-[240px]">
            <label className="text-xs font-semibold text-[#8b949e]">Папка (Секция)</label>
            <SectionSelect 
              value={newCaseSection} 
              onChange={setNewCaseSection} 
              options={allSuites} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#8b949e]">Формат описания</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNewCaseFormat('steps')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                newCaseFormat === 'steps' 
                  ? 'bg-[#21262d] text-[#58a6ff] shadow-sm' 
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'
              }`}
            >
              Тест-кейс
            </button>
            <button
              type="button"
              onClick={() => setNewCaseFormat('checklist')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                newCaseFormat === 'checklist' 
                  ? 'bg-[#21262d] text-[#58a6ff] shadow-sm' 
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'
              }`}
            >
              Чек-лист
            </button>
          </div>
        </div>

        {newCaseFormat === 'steps' ? (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-[#8b949e]">Шаги выполнения</label>

            {newCaseStepsList.length > 0 && (
              <div className="rounded-md border border-[#30363d] overflow-hidden bg-[#0d1117]/50">
                <table className="w-full border-collapse text-[13px] [table-layout:fixed] [&_th]:px-[14px] [&_th]:py-[10px] [&_th]:text-left [&_th]:break-words [&_th]:align-top [&_th]:leading-relaxed [&_th]:bg-white/[0.02] [&_th]:border-b [&_th]:border-[#30363d] [&_th]:text-[#8b949e] [&_th]:font-semibold [&_td]:px-[14px] [&_td]:py-[10px] [&_td]:text-left [&_td]:break-words [&_td]:align-top [&_td]:leading-relaxed [&_td]:border-b [&_td]:border-[#30363d] [&_tr:last-child_td]:border-b-0">
                  <colgroup>
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '44%' }} />
                    <col style={{ width: '44%' }} />
                    <col style={{ width: '6%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Действие</th>
                      <th>Ожидаемый результат</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newCaseStepsList.map((step, idx) => (
                      <tr key={idx} className="hover:bg-[#21262d]/20 transition-colors">
                        <td className="text-[#8b949e]">{idx + 1}</td>
                        <td className="font-mono text-[#c9d1d9] break-all">{step.action}</td>
                        <td className="font-mono text-[#58a6ff] break-all">{step.expected || '—'}</td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => setNewCaseStepsList(newCaseStepsList.filter((_, i) => i !== idx))}
                            className="text-[#f85149] hover:text-[#ff7b72] border-none bg-transparent cursor-pointer flex items-center justify-center w-full"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-3 items-end">
              <div className="flex flex-col gap-1.5 flex-grow">
                <label className="text-xs font-semibold text-[#8b949e]">Действие</label>
                <input
                  id="new-step-action-input"
                  type="text"
                  className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] w-full text-sm"
                  placeholder="Что нужно сделать"
                  value={newStepAction}
                  onChange={e => setNewStepAction(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewStep(e);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-grow">
                <label className="text-xs font-semibold text-[#8b949e]">Ожидаемый результат</label>
                <input
                  type="text"
                  className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] w-full text-sm"
                  placeholder="Что должно произойти"
                  value={newStepExpected}
                  onChange={e => setNewStepExpected(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewStep(e);
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddNewStep}
                className="btn btn-default h-[38px] px-4 font-semibold text-xs whitespace-nowrap"
              >
                <Plus size={14} /> Шаг
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-[#8b949e]">Пункты чек-листа</label>
            {newCaseChecklistItems.length > 0 && (
              <div className="rounded-md border border-[#30363d] overflow-hidden bg-[#0d1117]/50">
                <table className="w-full border-collapse text-[13px] [table-layout:fixed] [&_th]:px-[14px] [&_th]:py-[10px] [&_th]:text-left [&_th]:break-words [&_th]:align-top [&_th]:leading-relaxed [&_th]:bg-white/[0.02] [&_th]:border-b [&_th]:border-[#30363d] [&_th]:text-[#8b949e] [&_th]:font-semibold [&_td]:px-[14px] [&_td]:py-[10px] [&_td]:text-left [&_td]:break-words [&_td]:align-top [&_td]:leading-relaxed [&_td]:border-b [&_td]:border-[#30363d] [&_tr:last-child_td]:border-b-0">
                  <colgroup>
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '88%' }} />
                    <col style={{ width: '6%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Действие</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newCaseChecklistItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#21262d]/20 transition-colors">
                        <td className="text-[#8b949e] font-semibold">{idx + 1}</td>
                        <td className="font-mono text-[#c9d1d9] break-all">{item}</td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => setNewCaseChecklistItems(newCaseChecklistItems.filter((_, i) => i !== idx))}
                            className="text-[#f85149] hover:text-[#ff7b72] border-none bg-transparent cursor-pointer flex items-center justify-center w-full"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8b949e]">Действие</label>
              <div className="flex gap-3">
                <input
                  id="new-checklist-item-input"
                  type="text"
                  className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] text-sm font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] flex-grow"
                  placeholder="Что нужно сделать"
                  value={newChecklistItem}
                  onChange={e => setNewChecklistItem(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="btn btn-default h-[38px] px-4 font-semibold text-xs"
                >
                  Добавить
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#8b949e]">Общий ожидаемый результат чек-листа</label>
              <input
                type="text"
                className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] text-sm font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] w-full"
                placeholder="Например: Успешный переход в личный кабинет"
                value={newCaseExpectedResult}
                onChange={e => setNewCaseExpectedResult(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateCase(e);
                  }
                }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-[#30363d] pt-4 mt-2">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8b949e]">Слой:</span>
              <CustomSelect
                value={newCaseLayer}
                onChange={setNewCaseLayer}
                options={[
                  { value: 'UI', label: 'UI' },
                  { value: 'API', label: 'API' },
                  { value: 'E2E', label: 'E2E' }
                ]}
              />
            </div>

            <div className="flex items-center gap-2.5 cursor-pointer select-none group" onClick={() => setNewCaseAutomated(!newCaseAutomated)}>
              <span className={`text-xs font-semibold transition-colors ${newCaseAutomated ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-[#c9d1d9]'}`}>Авто:</span>
              <div className={`relative w-[38px] h-[20px] rounded-[20px] transition-all duration-300 border ${newCaseAutomated ? 'bg-[#58a6ff]/10 border-[#58a6ff] shadow-[0_0_8px_rgba(88,166,255,0.3)]' : 'bg-transparent border-[#30363d] group-hover:border-[#8b949e]'}`}>
                <div className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full transition-all duration-300 transform ${newCaseAutomated ? 'translate-x-[18px] bg-[#58a6ff] shadow-[0_0_5px_rgba(88,166,255,0.8)]' : 'translate-x-0 bg-[#8b949e] group-hover:bg-[#c9d1d9]'}`} />
              </div>
              <span className={`text-xs font-medium transition-colors ${newCaseAutomated ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-[#c9d1d9]'}`}>{newCaseAutomated ? 'Да' : 'Нет'}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            <Plus size={14} /> Добавить
          </button>
        </div>
          </form>
        </div>
        </div>
      )}

      {/* Содержимое открытой вкладки кейса */}
      {caseActiveTab !== 'new' && (
        <div className="flex flex-col gap-4">
          {(() => {
            const tc = projectCases?.find(c => c.id === caseActiveTab);
            if (!tc) return null;

            const isEditing = editingCaseId === tc.id;
            const isDeleting = deletingCaseId === tc.id;

            return (
              <div
                key={tc.id}
              className={`p-5 flex flex-col gap-3 relative bg-[#161b22] border rounded-[10px] transition-all duration-250 hover:-translate-y-px ${
                isDeleting
                  ? 'border-[#f85149]/45 shadow-[0_0_16px_rgba(248,81,73,0.15)]'
                  : 'border-[#30363d] hover:border-[#0ea5e9]/35 hover:shadow-[0_4px_20px_rgba(14,165,233,0.05)]'
              } ${
                !isDeleting ? `before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:w-[3px] before:rounded-l-[10px] ${tc.layer === 'API' ? 'before:bg-[#58a6ff]' : tc.layer === 'UI' ? 'before:bg-[#bc8cff]' : 'before:bg-[#2ea44f]'}` : ''
              }`}
            >
              {isEditing ? (
                <form onSubmit={(e) => handleUpdateSubmit(e, tc.id)} className="flex flex-col gap-4" noValidate>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 flex-grow">
                      <label className="text-xs font-semibold text-[#8b949e]">Название</label>
                      <input
                        type="text"
                        className={`bg-[#0d1117] border rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] text-sm font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none w-full ${
                          editingCaseTitleError 
                            ? 'border-[#f85149] focus:border-[#f85149] focus:shadow-[0_0_0_3px_rgba(248,81,73,0.15)]' 
                            : 'border-[#30363d] focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)]'
                        }`}
                        value={editingCaseTitle}
                        onChange={e => {
                          setEditingCaseTitle(e.target.value);
                          if (e.target.value.trim() && editingCaseTitleError) {
                            setEditingCaseTitleError(false);
                          }
                        }}
                        required
                      />
                      {editingCaseTitleError && (
                        <div className="text-[11px] text-[#f85149] bg-[#f85149]/8 border border-[#f85149]/25 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 mt-1 transition-all duration-200">
                          <AlertTriangle size={12} className="flex-shrink-0" />
                          <span>Название тест-кейса обязательно</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 w-[240px]">
                      <label className="text-xs font-semibold text-[#8b949e]">Папка (Секция)</label>
                      <SectionSelect 
                        value={editingCaseSection} 
                        onChange={setEditingCaseSection} 
                        options={allSuites} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#8b949e]">Формат описания</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCaseFormat('steps')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          editingCaseFormat === 'steps' 
                            ? 'bg-[#21262d] text-[#58a6ff] shadow-sm' 
                            : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'
                        }`}
                      >
                        Тест-кейс
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCaseFormat('checklist')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          editingCaseFormat === 'checklist' 
                            ? 'bg-[#21262d] text-[#58a6ff] shadow-sm' 
                            : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'
                        }`}
                      >
                        Чек-лист
                      </button>
                    </div>
                  </div>

                  {editingCaseFormat === 'steps' ? (
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold text-[#8b949e]">Шаги выполнения</label>

                      {editingCaseStepsList.length > 0 && (
                        <div className="rounded-md border border-[#30363d] overflow-hidden bg-[#0d1117]/50">
                          <table className="w-full border-collapse text-[13px] [table-layout:fixed] [&_th]:px-[14px] [&_th]:py-[10px] [&_th]:text-left [&_th]:break-words [&_th]:align-top [&_th]:leading-relaxed [&_th]:bg-white/[0.02] [&_th]:border-b [&_th]:border-[#30363d] [&_th]:text-[#8b949e] [&_th]:font-semibold [&_td]:px-[14px] [&_td]:py-[10px] [&_td]:text-left [&_td]:break-words [&_td]:align-top [&_td]:leading-relaxed [&_td]:border-b [&_td]:border-[#30363d] [&_tr:last-child_td]:border-b-0">
                            <colgroup>
                              <col style={{ width: '6%' }} />
                              <col style={{ width: '44%' }} />
                              <col style={{ width: '44%' }} />
                              <col style={{ width: '6%' }} />
                            </colgroup>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Действие</th>
                                <th>Ожидаемый результат</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {editingCaseStepsList.map((step, idx) => (
                                <tr key={idx} className="hover:bg-[#21262d]/20 transition-colors">
                                  <td className="text-[#8b949e]">{idx + 1}</td>
                                  <td className="font-mono text-[#c9d1d9] break-all">{step.action}</td>
                                  <td className="font-mono text-[#58a6ff] break-all">{step.expected || '—'}</td>
                                  <td className="text-center">
                                    <button
                                      type="button"
                                      onClick={() => setEditingCaseStepsList(editingCaseStepsList.filter((_, i) => i !== idx))}
                                      className="text-[#f85149] hover:text-[#ff7b72] border-none bg-transparent cursor-pointer flex items-center justify-center w-full"
                                    >
                                      <X size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex gap-3 items-end">
                        <div className="flex flex-col gap-1.5 flex-grow">
                          <label className="text-xs font-semibold text-[#8b949e]">Действие</label>
                          <input
                            id="edit-step-action-input"
                            type="text"
                            className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] w-full text-sm"
                            placeholder="Введите действие шага"
                            value={editingStepAction}
                            onChange={e => setEditingStepAction(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEditingStep(e);
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-grow">
                          <label className="text-xs font-semibold text-[#8b949e]">Ожидаемый результат</label>
                          <input
                            type="text"
                            className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] w-full text-sm"
                            placeholder="Что должно произойти"
                            value={editingStepExpected}
                            onChange={e => setEditingStepExpected(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEditingStep(e);
                              }
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddEditingStep}
                          className="btn btn-default h-[38px] px-4 font-semibold text-xs"
                        >
                          Добавить
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold text-[#8b949e]">Пункты чек-листа</label>
                      {editingCaseChecklistItems.length > 0 && (
                        <div className="rounded-md border border-[#30363d] overflow-hidden bg-[#0d1117]/50">
                          <table className="w-full border-collapse text-[13px] [table-layout:fixed] [&_th]:px-[14px] [&_th]:py-[10px] [&_th]:text-left [&_th]:break-words [&_th]:align-top [&_th]:leading-relaxed [&_th]:bg-white/[0.02] [&_th]:border-b [&_th]:border-[#30363d] [&_th]:text-[#8b949e] [&_th]:font-semibold [&_td]:px-[14px] [&_td]:py-[10px] [&_td]:text-left [&_td]:break-words [&_td]:align-top [&_td]:leading-relaxed [&_td]:border-b [&_td]:border-[#30363d] [&_tr:last-child_td]:border-b-0">
                            <colgroup>
                              <col style={{ width: '6%' }} />
                              <col style={{ width: '88%' }} />
                              <col style={{ width: '6%' }} />
                            </colgroup>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Действие</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {editingCaseChecklistItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-[#21262d]/20 transition-colors">
                                  <td className="text-[#8b949e] font-semibold">{idx + 1}</td>
                                  <td className="font-mono text-[#c9d1d9] break-all">{item}</td>
                                  <td className="text-center">
                                    <button
                                      type="button"
                                      onClick={() => setEditingCaseChecklistItems(editingCaseChecklistItems.filter((_, i) => i !== idx))}
                                      className="text-[#f85149] hover:text-[#ff7b72] border-none bg-transparent cursor-pointer flex items-center justify-center w-full"
                                    >
                                      <X size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#8b949e]">Действие</label>
                        <div className="flex gap-3">
                          <input
                            id="edit-checklist-item-input"
                            type="text"
                            className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] text-sm font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] flex-grow"
                            placeholder="Введите действие"
                            value={editingChecklistItem}
                            onChange={e => setEditingChecklistItem(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEditingChecklistItem(e);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddEditingChecklistItem}
                            className="btn btn-default h-[38px] px-4 font-semibold text-xs"
                          >
                            Добавить
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#8b949e]">Общий ожидаемый результат чек-листа</label>
                        <input
                          type="text"
                          className="bg-[#0d1117] border border-[#30363d] rounded-[6px] px-[14px] py-[10px] text-[#c9d1d9] text-sm font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] w-full"
                          placeholder="Например: Успешный переход в личный кабинет"
                          value={editingCaseExpectedResult}
                          onChange={e => setEditingCaseExpectedResult(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleUpdateCase(e, tc.id);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-[#30363d] pt-3">
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#8b949e] font-semibold">Слой:</span>
                        <CustomSelect
                          value={editingCaseLayer}
                          onChange={setEditingCaseLayer}
                          options={[
                            { value: 'UI', label: 'UI' },
                            { value: 'API', label: 'API' },
                            { value: 'E2E', label: 'E2E' }
                          ]}
                        />
                      </div>
                      <div className="flex items-center gap-2.5 cursor-pointer select-none group" onClick={() => setEditingCaseAutomated(!editingCaseAutomated)}>
                        <span className={`text-xs font-semibold transition-colors ${editingCaseAutomated ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-[#c9d1d9]'}`}>Авто:</span>
                        <div className={`relative w-[38px] h-[20px] rounded-[20px] transition-all duration-300 border ${editingCaseAutomated ? 'bg-[#58a6ff]/10 border-[#58a6ff] shadow-[0_0_8px_rgba(88,166,255,0.3)]' : 'bg-transparent border-[#30363d] group-hover:border-[#8b949e]'}`}>
                          <div className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full transition-all duration-300 transform ${editingCaseAutomated ? 'translate-x-[18px] bg-[#58a6ff] shadow-[0_0_5px_rgba(88,166,255,0.8)]' : 'translate-x-0 bg-[#8b949e] group-hover:bg-[#c9d1d9]'}`} />
                        </div>
                        <span className={`text-xs font-medium transition-colors ${editingCaseAutomated ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-[#c9d1d9]'}`}>{editingCaseAutomated ? 'Да' : 'Нет'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEditingCaseId(null)} className="btn btn-default">Отмена</button>
                      <button type="submit" className="btn btn-primary">Сохранить</button>
                    </div>
                  </div>
                </form>
              ) : isDeleting ? (
                <div onClick={e => e.stopPropagation()} className="flex flex-col gap-3 justify-center items-center py-1">
                  <span className="text-sm font-semibold text-[#f85149]">Удалить этот тест-кейс?</span>
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-default btn-sm" onClick={() => setDeletingCaseId(null)}>Нет</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDeleteCase(tc.id)}>Да, удалить</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[15px] font-semibold text-[#f0f6fc]">{tc.title}</span>
                    <div className="flex gap-2 items-center">
                      <span className={`text-[11px] px-2 py-0.5 rounded-xl font-semibold flex items-center gap-1 ${
                        tc.layer === 'API' ? 'bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/20' :
                        tc.layer === 'UI' ? 'bg-[#bc8cff]/10 text-[#bc8cff] border border-[#bc8cff]/20' :
                        'bg-[#2ea44f]/15 text-[#2ea44f] border border-[#2ea44f]/20'
                      }`}>
                        {tc.layer || 'UI'}
                      </span>
                      {tc.isAutomated ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-xl font-semibold flex items-center gap-1 bg-[#f0f6fc]/5 text-[#c9d1d9] border border-[#f0f6fc]/15">
                          <AutoTestIcon size={10} /> Auto
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-xl font-semibold flex items-center gap-1 bg-[#f0f6fc]/5 text-[#c9d1d9] border border-[#f0f6fc]/15">
                          <ManualTestIcon size={10} /> Manual
                        </span>
                      )}
                      <button
                        className="rounded p-1 hover:bg-[#30363d] text-[#8b949e] hover:text-[#f0f6fc] transition-all cursor-pointer ml-1"
                        onClick={() => openCaseTab(tc)}
                        title="Редактировать"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="rounded p-1 hover:bg-[#30363d] text-[#f85149] hover:text-[#ff7b72] transition-all cursor-pointer"
                        onClick={() => setDeletingCaseId(tc.id)}
                        title="Удалить"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm leading-normal text-[#8b949e] flex flex-col gap-2">
                    {Array.isArray(tc.steps) && tc.steps.length > 0 ? (
                      tc.steps.some(s => s.expected && s.expected.trim() !== '') ? (
                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Шаги выполнения</div>
                          <div className="overflow-x-auto border border-[#30363d] rounded-md bg-[#0d1117]/50">
                            <table className="w-full border-collapse text-[13px] [table-layout:fixed] [&_th]:px-[14px] [&_th]:py-[10px] [&_th]:text-left [&_th]:break-words [&_th]:align-top [&_th]:leading-relaxed [&_th]:bg-white/[0.02] [&_th]:border-b [&_th]:border-[#30363d] [&_th]:text-[#8b949e] [&_th]:font-semibold [&_td]:px-[14px] [&_td]:py-[10px] [&_td]:text-left [&_td]:break-words [&_td]:align-top [&_td]:leading-relaxed [&_td]:border-b [&_td]:border-[#30363d] [&_tr:last-child_td]:border-b-0">
                              <colgroup>
                                <col style={{ width: '6%' }} />
                                <col style={{ width: '47%' }} />
                                <col style={{ width: '47%' }} />
                              </colgroup>
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Действие</th>
                                  <th>Ожидаемый результат</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tc.steps.map((s, idx) => (
                                  <tr key={idx} className="hover:bg-[#21262d]/20 transition-colors">
                                    <td className="text-[#8b949e] font-semibold">{idx + 1}</td>
                                    <td className="font-mono text-[#c9d1d9] break-all">{s.action}</td>
                                    <td className="font-mono text-[#58a6ff] break-all">{s.expected || '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Пункты чек-листа</div>
                          <div className="flex flex-col gap-1.5 pl-1">
                            {tc.steps.map((s, idx) => (
                              <div key={idx} className="flex gap-2 items-start text-[13px] text-[#c9d1d9]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] mt-1.5 flex-shrink-0" />
                                <span className="font-mono break-all align-top">{s.action}</span>
                              </div>
                            ))}
                          </div>
                          {tc.expectedResult && (
                            <div className="mt-2 border-t border-[#30363d] border-dashed pt-2 text-[13px]">
                              <span className="text-[#8b949e]">Ожидаемый результат: </span>
                              <span className="text-[#58a6ff] font-medium">{tc.expectedResult}</span>
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      <>
                        {tc.description && (
                          <div className="flex flex-col gap-2">
                            <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Описание / Шаги</div>
                            <pre className="font-mono text-[13px] whitespace-pre-wrap bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] text-[#c9d1d9]">{tc.description}</pre>
                          </div>
                        )}
                        {tc.expectedResult && (
                          <div className="mt-2 border-t border-[#30363d] border-dashed pt-2 text-[13px]">
                            <span className="text-[#8b949e]">Ожидаемый результат: </span>
                            <span className="text-[#58a6ff] font-medium">{tc.expectedResult}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            );
          })()}
        </div>
      )}
      </div>
    </div>
  );
};
