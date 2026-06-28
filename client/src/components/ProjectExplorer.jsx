import React, { useState, useMemo } from 'react';
import { Folder, FolderOpen, Plus, ChevronRight, ChevronDown } from 'lucide-react';

import { AutoTestIcon, ManualTestIcon } from './Common';

// Рекурсивный компонент для рендеринга узла дерева
const TreeNode = ({ node, level, selectedSuite, onSelectSuite, cases, activeCaseId, openCaseTab, expandedStates = {}, onToggleOpen }) => {
  const isOpen = expandedStates[node.fullPath] !== false; // по умолчанию открыты
  
  const isSelected = selectedSuite === node.fullPath;
  const hasChildren = Object.keys(node.children).length > 0;
  
  const folderCases = node.name !== 'Root' && cases ? cases.filter(c => c.section === node.fullPath) : [];
  const canExpand = (hasChildren || folderCases.length > 0) && node.name !== 'Root';

  return (
    <div className="flex flex-col">
      {/* Сама строка узла */}
      <div
        onClick={() => {
          if (canExpand) {
            onToggleOpen(node.fullPath);
          }
          if (node.fullPath) {
             onSelectSuite(node.fullPath);
          }
        }}
        className={`flex items-center gap-1.5 py-1.5 rounded-[6px] cursor-pointer text-sm transition-all duration-150 ${
          isSelected
            ? 'bg-[#21262d] text-[#58a6ff]'
            : 'text-[#8b949e] hover:bg-[#21262d]/50 hover:text-[#c9d1d9]'
        }`}
        style={{ paddingLeft: `${6 + level * 6}px`, paddingRight: '6px' }}
      >
        {/* Иконка раскрытия (шеврон) */}
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" onClick={(e) => {
          if (canExpand) {
            e.stopPropagation();
            onToggleOpen(node.fullPath);
          }
        }}>
          {canExpand ? (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <div className="w-4" />}
        </div>
        
        {/* Иконка папки */}
        <div className="flex-shrink-0 text-[#8b949e]">
          {isOpen && canExpand ? <FolderOpen size={15} /> : <Folder size={15} />}
        </div>
        
        {/* Название */}
        <span className="truncate font-medium">{node.name}</span>
      </div>

      {/* Рендер дочерних элементов (если открыто) */}
      {isOpen && (hasChildren || folderCases.length > 0) && (
        <div className="flex flex-col gap-0.5 mt-0.5">
          {Object.values(node.children).map(childNode => (
            <TreeNode
              key={childNode.fullPath}
              node={childNode}
              level={node.name === 'Root' ? 0 : level + 1}
              selectedSuite={selectedSuite}
              onSelectSuite={onSelectSuite}
              cases={cases}
              activeCaseId={activeCaseId}
              openCaseTab={openCaseTab}
              expandedStates={expandedStates}
              onToggleOpen={onToggleOpen}
            />
          ))}
          {folderCases.map(tc => (
            <div
              key={tc.id}
              onClick={(e) => {
                e.stopPropagation();
                openCaseTab(tc);
              }}
              className={`flex items-center gap-1.5 py-1.5 rounded-[6px] cursor-pointer text-sm transition-all duration-150 ${
                tc.id === activeCaseId 
                  ? 'bg-[#21262d] text-[#c9d1d9] font-medium' 
                  : 'text-[#8b949e] hover:bg-[#21262d]/50 hover:text-[#c9d1d9]'
              }`}
              style={{ paddingLeft: `${6 + (node.name === 'Root' ? 0 : level + 1) * 6}px`, paddingRight: '6px' }}
            >
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" />
              <div className="flex-shrink-0 flex items-center justify-center w-[15px]">
                {tc.isAutomated ? <AutoTestIcon size={14} /> : <ManualTestIcon size={14} />}
              </div>
              <span className="truncate">{tc.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectExplorer = ({
  allSuites,
  selectedSuite,
  setSelectedSuite,
  setNewCaseSection,
  showNewSuiteInput,
  setShowNewSuiteInput,
  newSuiteNameInput,
  setNewSuiteNameInput,
  localSuites,
  setLocalSuites,
  cases,
  activeCaseId,
  openCaseTab,
  expandedStates = {},
  setExpandedStates = () => {}
}) => {
  
  const toggleNode = (path) => {
    setExpandedStates(prev => ({
      ...prev,
      [path]: prev[path] === false ? true : false
    }));
  };

  // Построение дерева из плоского списка путей
  const tree = useMemo(() => {
    const root = { name: 'Root', fullPath: '', children: {} };
    
    // Сортируем чтобы папки шли по алфавиту
    const sortedSuites = [...allSuites].sort();

    sortedSuites.forEach(path => {
      const parts = path.split('/').filter(p => p.trim() !== '');
      let current = root;
      let currentPath = '';

      parts.forEach((part, idx) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            fullPath: currentPath,
            children: {}
          };
        }
        current = current.children[part];
      });
    });

    return root;
  }, [allSuites]);

  const handleCreateSuite = () => {
    if (newSuiteNameInput.trim()) {
      setLocalSuites([...localSuites, newSuiteNameInput.trim()]);
      setSelectedSuite(newSuiteNameInput.trim());
      setNewCaseSection(newSuiteNameInput.trim());
      setNewSuiteNameInput('');
      setShowNewSuiteInput(false);
    }
  };

  const handleSelectSuite = (fullPath) => {
    setSelectedSuite(fullPath);
    setNewCaseSection(fullPath);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {showNewSuiteInput && (
        <div className="flex flex-col gap-2 mb-4" onClick={e => e.stopPropagation()}>
          <span className="text-[10px] text-[#8b949e]">Используйте "/" для вложенных папок (напр. Core/Auth)</span>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-grow bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-1.5 text-[#c9d1d9] text-xs font-[inherit] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-[#58a6ff] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)] h-[28px]"
              placeholder="Имя папки"
              value={newSuiteNameInput}
              onChange={e => setNewSuiteNameInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateSuite();
                }
              }}
            />
            <button
              onClick={handleCreateSuite}
              className="btn btn-primary h-[28px] px-2 py-1 text-xs"
            >
              ОК
            </button>
          </div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto flex flex-col gap-0.5 pb-4">
        {Object.values(tree.children).map(childNode => (
          <TreeNode
            key={childNode.fullPath}
            node={childNode}
            level={0}
            selectedSuite={selectedSuite}
            onSelectSuite={handleSelectSuite}
            cases={cases}
            activeCaseId={activeCaseId}
            openCaseTab={openCaseTab}
            expandedStates={expandedStates}
            onToggleOpen={toggleNode}
          />
        ))}
      </div>
    </div>
  );
};
